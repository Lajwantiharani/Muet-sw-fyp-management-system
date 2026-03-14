import fs from "fs/promises";
import path from "path";
import XLSX from "xlsx";

import Student from "../models/import.student.model.js";
import Group from "../models/import.group.model.js";
import Project from "../models/import.project.model.js";
import Supervisor from "../models/import.supervisor.model.js";
import pagination from "../../utils/libs/database/pagination.js";
import constructQuery from "../../utils/libs/database/construct.query.js";

const UPLOADS_ROOT = path.resolve("public/uploads");

const readRows = async (filePath) => {
    const buffer = await fs.readFile(filePath);
    const workbook = XLSX.read(buffer, { type: "buffer" });

    // merge all sheets (each sheet represents a batch) into one unified array
    return workbook.SheetNames.flatMap((sheetName) => {
        const worksheet = workbook.Sheets[sheetName];
        return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
    });
};

const splitList = (value) => {
    if (!value) return [];
    return String(value)
        .split(/[,;|]/)
        .map((item) => item.trim())
        .filter(Boolean);
};

const memberKey = (names, batch) => {
    const normalized = names.map((name) => name.toLowerCase()).sort().join("|");
    return `${batch.toLowerCase()}::${normalized}`;
};

const buildRegexQuery = (query = {}) => {
    const entries = Object.entries(query ?? {})
        .filter(([, value]) => value !== undefined && value !== null && `${value}`.trim() !== "");

    if (entries.length === 0) return null;

    return entries.map(([key, value]) => ({
        key,
        regex: {
            $regex: String(value).trim(),
            $options: "i",
        }
    }));
};

const upsertSupervisor = async (name) => {
    if (!name) return null;
    const trimmed = name.trim();
    return Supervisor.findOneAndUpdate(
        { name: trimmed },
        { name: trimmed },
        { upsert: true, new: true, setDefaultsOnInsert: true }
    );
};

const upsertStudents = async (names, batch) => {
    const ids = [];
    for (const name of names) {
        const trimmed = name.trim();
        if (!trimmed) continue;

        const student = await Student.findOneAndUpdate(
            { name: trimmed, batch },
            { name: trimmed, batch },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        ids.push(student._id);
    }
    return ids;
};

const findOrCreateGroup = async (batch, memberNames, memberIds) => {
    const key = memberKey(memberNames, batch);
    const update = { batch, members: memberIds, memberNamesKey: key };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    return Group.findOneAndUpdate({ memberNamesKey: key }, update, options);
};

const saveProject = async ({ title, abstract, technologies, batch, groupId, supervisorId }, overwrite) => {
    const existing = await Project.findOne({ title });
    if (existing && !overwrite) return { status: "skipped", project: existing };

    if (existing && overwrite) {
        const updated = await Project.findOneAndUpdate(
            { _id: existing._id },
            { title, abstract, technologies, batch, group: groupId, supervisor: supervisorId },
            { new: true }
        );
        return { status: "updated", project: updated };
    }

    const created = await Project.create({
        title,
        abstract,
        technologies,
        batch,
        group: groupId,
        supervisor: supervisorId,
    });
    return { status: "inserted", project: created };
};

const importRows = async (rows, { overwrite = false } = {}) => {
    const summary = {
        scanned: rows.length,
        inserted: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };

    for (const [index, row] of rows.entries()) {
        const batch = String(row.batch ?? "").trim();
        const title = String(row.title ?? "").trim();
        const abstract = String(row.abstract ?? "").trim();
        const technologies = splitList(row.technologies);
        const memberNames = splitList(row.members);
        const supervisorName = String(row.supervisor ?? "").trim();

        if (!batch || !title) {
            summary.skipped += 1;
            summary.errors.push({ row: index + 2, message: "Batch and title are required" });
            continue;
        }

        try {
            const supervisor = await upsertSupervisor(supervisorName);
            const studentIds = await upsertStudents(memberNames, batch);
            const group = await findOrCreateGroup(batch, memberNames, studentIds);
            const { status } = await saveProject(
                { title, abstract, technologies, batch, groupId: group._id, supervisorId: supervisor?._id ?? null },
                overwrite
            );
            summary[status] += 1;
        } catch (error) {
            summary.errors.push({ row: index + 2, message: error.message });
        }
    }

    return summary;
};

const importFromFile = async (absolutePath, options = {}) => {
    const rows = await readRows(absolutePath);
    return importRows(rows, options);
};

const importFromUploaded = async (relativePath, options = {}) => {
    const absolutePath = path.join(UPLOADS_ROOT, relativePath);
    return importFromFile(absolutePath, options);
};

const retrieveImportedProjects = async ({ current = 1, size = 10, query = {}, sort = { createdAt: -1 } } = {}) => {
    current = Math.max(1, parseInt(current, 10) || 1);
    size = Math.max(1, parseInt(size, 10) || 10);

    const regexList = buildRegexQuery(query);

    // normalize sort: convert "asc"/"desc" to 1/-1 and allow only known fields
    const allowedSortKeys = new Set(["batch", "title", "supervisorName", "membersLabel", "abstract", "createdAt"]);
    const sortStage = Object.entries(sort || {}).reduce((acc, [key, value]) => {
        if (!allowedSortKeys.has(key)) return acc;
        const direction = (value === "asc" || value === 1 || value === "1") ? 1 : -1;
        acc[key] = direction;
        return acc;
    }, {});
    if (Object.keys(sortStage).length === 0) sortStage.createdAt = -1;

    const pipeline = [
        {
            $lookup: {
                from: "import_supervisors",
                localField: "supervisor",
                foreignField: "_id",
                as: "supervisor"
            }
        },
        { $unwind: { path: "$supervisor", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "import_groups",
                localField: "group",
                foreignField: "_id",
                as: "group"
            }
        },
        { $unwind: { path: "$group", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "import_students",
                localField: "group.members",
                foreignField: "_id",
                as: "members"
            }
        },
        {
            $addFields: {
                supervisorName: "$supervisor.name",
                membersLabel: {
                    $map: {
                        input: "$members",
                        as: "m",
                        in: "$$m.name"
                    }
                },
                membersLabelStr: {
                    $reduce: {
                        input: "$members",
                        initialValue: "",
                        in: {
                            $cond: [
                                { $eq: ["$$value", ""] },
                                "$$this.name",
                                { $concat: ["$$value", ", ", "$$this.name"] }
                            ]
                        }
                    }
                },
            }
        },
    ];

    if (regexList) {
        const orClauses = regexList.map(({ key, regex }) => {
            if (key === "membersLabel" || key === "members" || key === "membersLabelStr") return { membersLabelStr: regex };
            if (key === "supervisorName" || key === "supervisor") return { supervisorName: regex };
            if (key === "batch") return { batch: regex };
            if (key === "title") return { title: regex };
            if (key === "abstract") return { abstract: regex };
            // fallback: try key directly
            return { [key]: regex };
        });

        pipeline.push({ $match: { $or: orClauses } });
    }

    pipeline.push(
        { $sort: sortStage },
        { $skip: (current - 1) * size },
        { $limit: size },
        {
            $project: {
                _id: 1,
                title: 1,
                batch: 1,
                abstract: 1,
                technologies: 1,
                supervisor: { _id: "$supervisor._id", name: "$supervisor.name", department: "$supervisor.department" },
                supervisorName: 1,
                group: { _id: "$group._id", members: "$members" },
                membersLabel: "$membersLabelStr",
                createdAt: 1,
            }
        }
    );

    const countPipeline = pipeline.slice(0, -4); // remove sort/skip/limit/project
    countPipeline.push({ $count: "total" });

    const [data, totalResult] = await Promise.all([
        Project.aggregate(pipeline),
        Project.aggregate(countPipeline),
    ]);

    const totalItems = totalResult?.[0]?.total ?? 0;

    return {
        importProjects: data,
        pagination: {
            page: current,
            perPage: size,
            totalPages: Math.ceil(totalItems / size),
            itemsOnPage: data.length,
            totalItems,
        }
    };
};

export default { importFromFile, importFromUploaded, retrieveImportedProjects };
