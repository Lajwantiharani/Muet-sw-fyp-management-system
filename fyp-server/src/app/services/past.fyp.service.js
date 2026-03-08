import fs from "fs/promises";
import path from "path";

import tryCatch from "../../utils/libs/helper/try.catch.js";
import constructQuery from "../../utils/libs/database/construct.query.js";
import pagination from "../../utils/libs/database/pagination.js";
import PastFyp from "../models/past.fyp.model.js";
import extractPdfMetadata from "../../utils/libs/helper/extract.pdf.metadata.js";

const UPLOADS_ROOT = path.resolve("public/uploads");
const APPLICATIONS_DIR = path.join(UPLOADS_ROOT, "applications");

const retrieveAll = async ({ query = {}, current = 1, size = 10, sort = { createdAt: -1 } } = {}) => tryCatch(async () => {
    // allow legacy key from client searches
    if (query?.technology && !query?.technologies) {
        query.technologies = query.technology;
        delete query.technology;
    }

    const hasSearch = Object.keys(query || {}).length > 0;
    const searchQuery = hasSearch ? constructQuery(query, true) : {};
    return await pagination(PastFyp, { query: searchQuery, current, size, sort });
});

const createOrUpdateFromPdf = async (pdfFile, { overwrite = false } = {}) => tryCatch(async () => {
    const absoluteFilePath = path.join(UPLOADS_ROOT, pdfFile);
    const metadata = await extractPdfMetadata(absoluteFilePath, path.basename(pdfFile));

    const existing = await PastFyp.findOne({ pdf_file: pdfFile });
    if (existing && !overwrite) return existing;

    if (existing && overwrite) {
        return await PastFyp.findOneAndUpdate(
            { _id: existing._id },
            { ...metadata, pdf_file: pdfFile },
            { new: true }
        );
    }

    return await PastFyp.create({ ...metadata, pdf_file: pdfFile });
});

const backfill = async ({ overwrite = false, namePrefix = "past-fyp-" } = {}) => tryCatch(async () => {
    const files = await fs.readdir(APPLICATIONS_DIR);
    const pdfFiles = files
        .filter((filename) => filename.toLowerCase().endsWith(".pdf"))
        .filter((filename) => filename.toLowerCase().startsWith(namePrefix.toLowerCase()))
        .map((filename) => `applications/${filename}`);

    const result = {
        scanned: pdfFiles.length,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: [],
    };

    for (const pdfFile of pdfFiles) {
        try {
            const existing = await PastFyp.findOne({ pdf_file: pdfFile });
            const record = await createOrUpdateFromPdf(pdfFile, { overwrite });

            if (!existing) result.created += 1;
            else if (overwrite) result.updated += 1;
            else result.skipped += 1;

            if (!record) result.errors.push({ pdf_file: pdfFile, message: "Unable to extract metadata" });
        } catch (error) {
            result.errors.push({ pdf_file: pdfFile, message: error.message });
        }
    }

    return result;
});

export default { retrieveAll, createOrUpdateFromPdf, backfill };
