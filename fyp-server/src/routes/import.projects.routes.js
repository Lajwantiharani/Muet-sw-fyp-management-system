import { Router } from "express";

import importProjectsController from "../app/controllers/import.projects.controller.js";
import file from "../app/middlewares/file.js";
import auth from "../app/middlewares/auth.js";

const importProjectsRoutes = Router({ mergeParams: true });

importProjectsRoutes.post("/import-projects",
    auth.authenticate,
    auth.authorize("admin"),
    file.save("excel_file"),
    importProjectsController.importFromExcel
);

importProjectsRoutes.post("/import-projects/retrieve",
    auth.authenticate,
    auth.authorize("*"),
    importProjectsController.retrieve
);

export default importProjectsRoutes;
