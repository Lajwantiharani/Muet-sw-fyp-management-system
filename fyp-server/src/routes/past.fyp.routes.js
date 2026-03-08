import { Router } from "express";

import pastFypController from "../app/controllers/past.fyp.controller.js";
import validatePastFyp from "../app/middlewares/validate/validate.past.fyp.js";
import file from "../app/middlewares/file.js";
import auth from "../app/middlewares/auth.js";

const pastFypRoutes = Router({ mergeParams: true });

pastFypRoutes.post("/retrieve",
    auth.authenticate,
    auth.authorize("*"),
    pastFypController.index
);

pastFypRoutes.post("/upload",
    auth.authenticate,
    auth.authorize("admin"),
    file.save("pdf_file"),
    validatePastFyp.uploadPdfForm,
    pastFypController.uploadAndExtract
);

pastFypRoutes.post("/backfill",
    auth.authenticate,
    auth.authorize("admin"),
    pastFypController.backfill
);

export default pastFypRoutes;
