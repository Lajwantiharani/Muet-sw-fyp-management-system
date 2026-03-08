import tryCatch from "../../../utils/libs/helper/try.catch.js";
import validator from "../../../utils/libs/validation/validator.js";
import file from "../file.js";

const uploadPdfForm = async (req, res, next) => tryCatch(async () => {
    const { errors, validationFailed } = await validator(req.body, {
        pdf_file: {
            required: true,
            extension: ["pdf"],
            filesize: 15360,
        },
    });

    if (validationFailed && req.body.pdf_file?.name) {
        file.delete(req.body.pdf_file.name);
    }

    if (validationFailed) {
        return res.response(422, "There was a validation failure", { errors });
    }

    if (req.body.pdf_file?.name) {
        req.body.pdf_file = req.body.pdf_file.name;
    }

    next();
}, res);

export default { uploadPdfForm };
