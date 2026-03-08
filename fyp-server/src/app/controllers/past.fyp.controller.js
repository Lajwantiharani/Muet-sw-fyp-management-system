import tryCatch from "../../utils/libs/helper/try.catch.js";
import pastFypService from "../services/past.fyp.service.js";

const index = (req, res) => tryCatch(async () => {
    const data = await pastFypService.retrieveAll(req.body?.page ?? {});
    return res.response(200, "All past FYP records", data);
}, res);

const uploadAndExtract = (req, res) => tryCatch(async () => {
    const pdfFile = req.body?.pdf_file;
    if (!pdfFile) return res.response(422, "PDF file is required");

    const pastFyp = await pastFypService.createOrUpdateFromPdf(pdfFile, { overwrite: true });
    if (!pastFyp) throw new Error("Failed to save extracted metadata");

    return res.response(200, "Past FYP metadata extracted and saved", { pastFyp });
}, res);

const backfill = (req, res) => tryCatch(async () => {
    const overwrite = req.body?.overwrite === true;
    const result = await pastFypService.backfill({ overwrite });
    return res.response(200, "Past FYP backfill completed", { result });
}, res);

export default { index, uploadAndExtract, backfill };
