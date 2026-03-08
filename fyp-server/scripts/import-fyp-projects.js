import fs from "fs/promises";
import path from "path";

import database from "../src/config/database.js";
import pastFypService from "../src/app/services/past.fyp.service.js";

const PDF_NAMES = ["16SW.pdf", "17SW.pdf", "18SW.pdf", "19SW.pdf", "20SW.pdf"];

const UPLOADS_APPLICATIONS = path.resolve("public/uploads/applications");
const DESKTOP_DIR = "C:/Users/LAJWANTI/Desktop";

const ensureUploadDirectory = async () => {
    await fs.mkdir(UPLOADS_APPLICATIONS, { recursive: true });
};

const copyPdfToUploads = async (sourcePath) => {
    const filename = path.basename(sourcePath);
    const destination = path.join(UPLOADS_APPLICATIONS, filename);
    await fs.copyFile(sourcePath, destination);
    return `applications/${filename}`;
};

const resolveSourcePath = async (filename) => {
    const desktopPath = path.join(DESKTOP_DIR, filename);
    const uploadsPath = path.join(UPLOADS_APPLICATIONS, filename);

    try {
        await fs.access(desktopPath);
        return { path: desktopPath, shouldCopy: true };
    } catch (_) { }

    await fs.access(uploadsPath);
    return { path: uploadsPath, shouldCopy: false };
};

const run = async () => {
    await ensureUploadDirectory();
    await database.connect();

    const summary = {
        processed: 0,
        imported: 0,
        failed: 0,
        errors: [],
    };

    for (const filename of PDF_NAMES) {
        summary.processed += 1;

        try {
            const source = await resolveSourcePath(filename);
            const pdfFile = source.shouldCopy
                ? await copyPdfToUploads(source.path)
                : `applications/${filename}`;

            await pastFypService.createOrUpdateFromPdf(pdfFile, { overwrite: true });
            summary.imported += 1;
            console.log(`Imported: ${source.path}`);
        } catch (error) {
            summary.failed += 1;
            summary.errors.push({ file: filename, message: error.message });
            console.error(`Failed: ${filename} -> ${error.message}`);
        }
    }

    console.log("Import summary:", JSON.stringify(summary, null, 2));
    process.exit(0);
};

run().catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
});
