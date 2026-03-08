import fs from "fs/promises";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const loadPdfParse = () => {
    try {
        return require("pdf-parse");
    } catch (error) {
        throw new Error("pdf-parse is missing. Install it in fyp-server with: npm install pdf-parse");
    }
};

const TECHNOLOGY_KEYWORDS = [
    "AI", "Artificial Intelligence", "Machine Learning", "Deep Learning", "NLP",
    "Computer Vision", "MERN", "MEAN", "React", "Node.js", "Express", "MongoDB",
    "Python", "Django", "Flask", "Java", "C#", ".NET", "PHP", "Laravel",
    "Blockchain", "Smart Contracts", "Web3", "IoT", "Android", "Kotlin",
    "Flutter", "Data Mining", "Data Science", "Cybersecurity", "Cloud",
];

const cleanText = (value = "") => value
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[ ]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const extractTitle = (text = "") => {
    const firstPage = text.split("\f")[0] ?? text;
    const lines = firstPage
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .slice(0, 20);

    const ignored = [
        /^abstract$/i,
        /^keywords?$/i,
        /^index terms?$/i,
        /^submitted to/i,
        /^department of/i,
        /^final year project/i,
        /^supervisor/i,
        /^batch/i,
        /^\d+$/,
    ];

    const candidate = lines.find((line) => {
        if (line.length < 12 || line.length > 180) return false;
        return !ignored.some((pattern) => pattern.test(line));
    });

    return candidate || lines[0] || "Untitled FYP";
};

const extractAbstract = (text = "") => {
    const normalized = cleanText(text);
    const directMatch = normalized.match(
        /\babstract\b[\s:\-]*([\s\S]{80,5000}?)(?=\n\s*(keywords?|index terms?|introduction|chapter\s*1|1[\.\s]))/i
    );

    if (directMatch?.[1]) {
        return cleanText(directMatch[1]).split(/\s+/).slice(0, 350).join(" ");
    }

    const abstractStart = normalized.search(/\babstract\b/i);
    if (abstractStart >= 0) {
        const after = normalized.slice(abstractStart).replace(/\babstract\b[\s:\-]*/i, "");
        return cleanText(after).split(/\s+/).slice(0, 350).join(" ");
    }

    return "";
};

const splitKeywords = (value = "") => value
    .split(/[;,|]/)
    .map((item) => item.trim())
    .filter(Boolean);

const extractTechnologies = (text = "") => {
    const normalized = cleanText(text);
    const set = new Set();

    const keywordMatch = normalized.match(/\b(keywords?|index terms?)\b\s*[:\-]?\s*([^\n]{3,400})/i);
    if (keywordMatch?.[2]) {
        splitKeywords(keywordMatch[2]).forEach((item) => set.add(item));
    }

    TECHNOLOGY_KEYWORDS.forEach((keyword) => {
        const pattern = new RegExp(`\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
        if (pattern.test(normalized)) set.add(keyword);
    });

    return Array.from(set).slice(0, 12);
};

const extractMembers = (text = "") => {
    const lines = cleanText(text).split("\n").map((line) => line.trim()).filter(Boolean);
    const members = [];
    const seenIds = new Set();

    const idRegex = /\b(\d{2}[A-Za-z]{2}\d{2,3})\b/g;
    for (const line of lines) {
        const ids = [...line.matchAll(idRegex)].map((match) => match[1].toUpperCase());
        if (!ids.length) continue;

        for (const studentId of ids) {
            if (seenIds.has(studentId)) continue;
            seenIds.add(studentId);

            // Attempt to isolate name nearby the student ID
            const beforeId = line.split(new RegExp(studentId, "i"))[0]
                .replace(/(student\s*name|name|member|group\s*member|roll\s*no\.?|id)[:\-]*/ig, "")
                .replace(/[^a-zA-Z\s\.]/g, " ")
                .replace(/[ ]{2,}/g, " ")
                .trim();

            const name = beforeId.length >= 3 ? beforeId : "Unknown";
            members.push({ name, studentId });
        }
    }

    return members.slice(0, 8);
};

const extractSupervisor = (text = "") => {
    const normalized = cleanText(text);
    const match = normalized.match(/\b(supervisor|supervised\s*by|project\s*supervisor)\b\s*[:\-]?\s*([^\n]{3,140})/i);
    if (!match?.[2]) return "";

    return match[2]
        .replace(/\b(department|faculty|university|submitted)\b.*$/i, "")
        .replace(/[ ]{2,}/g, " ")
        .trim();
};

const extractPdfMetadata = async (absoluteFilePath, pdfFile = "") => {
    const fileBuffer = await fs.readFile(path.resolve(absoluteFilePath));
    const pdfParse = loadPdfParse();
    const parsed = await pdfParse(fileBuffer);
    const text = cleanText(parsed?.text ?? "");

    return {
        title: extractTitle(text),
        abstract: extractAbstract(text),
        technologies: extractTechnologies(text),
        members: extractMembers(text),
        supervisor: extractSupervisor(text),
        pdfFile: pdfFile || path.basename(absoluteFilePath),
    };
};

export default extractPdfMetadata;
