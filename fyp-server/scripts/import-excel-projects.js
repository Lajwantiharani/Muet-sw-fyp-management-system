import fs from "fs/promises";
import path from "path";

import database from "../src/config/database.js";
import importProjectsService from "../src/app/services/import.projects.service.js";

const DEFAULT_EXCEL = "C:/Users/LAJWANTI/Desktop/records_16SW_to_20SW_organized.xlsx";

const resolveExcelPath = async (inputPath) => {
    const candidate = inputPath ? path.resolve(inputPath) : DEFAULT_EXCEL;
    await fs.access(candidate);
    return candidate;
};

const run = async () => {
    const filePath = await resolveExcelPath(process.argv[2]);
    await database.connect();

    console.log("Reading Excel file:", filePath);
    const summary = await importProjectsService.importFromFile(filePath, { overwrite: true });
    console.log("Import summary:", JSON.stringify(summary, null, 2));

    process.exit(0);
};

run().catch((error) => {
    console.error("Import failed:", error.message);
    process.exit(1);
});
