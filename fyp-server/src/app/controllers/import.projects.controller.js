import tryCatch from "../../utils/libs/helper/try.catch.js";
import importProjectsService from "../services/import.projects.service.js";

const importFromExcel = (req, res) => tryCatch(async () => {
    const excelFile = req.body?.excel_file?.name || req.body?.excel_file;
    if (!excelFile) return res.response(422, "Excel file is required");

    const overwrite = req.body?.overwrite === true || req.body?.overwrite === "true";
    const summary = await importProjectsService.importFromUploaded(excelFile, { overwrite });

    return res.response(200, "Excel imported successfully", { summary });
}, res);

const retrieve = (req, res) => tryCatch(async () => {
    const page = req.body?.page ?? {};
    const data = await importProjectsService.retrieveImportedProjects(page);
    return res.response(200, "Imported projects", data);
}, res);

export default { importFromExcel, retrieve };
