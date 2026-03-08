import fs from "fs/promises";
import path from "path";

import database from "../src/config/database.js";
import pastFypService from "../src/app/services/past.fyp.service.js";

const SOURCE_PDFS = [
    "C:/Users/LAJWANTI/Desktop/16SW.pdf",
    "C:/Users/LAJWANTI/Desktop/17SW.pdf",
    "C:/Users/LAJWANTI/Desktop/18SW.pdf",
    "C:/Users/LAJWANTI/Desktop/19SW.pdf",
    "C:/Users/LAJWANTI/Desktop/20SW.pdf",
];

const UPLOADS_APPLICATIONS = path.resolve("public/uploads/applications");

const ensureUploadDirectory = async () => {
    await fs.mkdir(UPLOADS_APPLICATIONS, { recursive: true });
};

const copyPdfToUploads = async (sourcePath) => {
    const filename = path.basename(sourcePath);
    const destination = path.join(UPLOADS_APPLICATIONS, filename);
    await fs.copyFile(sourcePath, destination);
    return `applications/${filename}`;
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

    for (const sourcePath of SOURCE_PDFS) {
        summary.processed += 1;

        try {
            await fs.access(sourcePath);
            const pdfFile = await copyPdfToUploads(sourcePath);
            await pastFypService.createOrUpdateFromPdf(pdfFile, { overwrite: true });
            summary.imported += 1;
            console.log(`Imported: ${sourcePath}`);
        } catch (error) {
            summary.failed += 1;
            summary.errors.push({ file: sourcePath, message: error.message });
            console.error(`Failed: ${sourcePath} -> ${error.message}`);
        }
    }

    console.log("Import summary:", JSON.stringify(summary, null, 2));
    process.exit(0);
};

run().catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
});
