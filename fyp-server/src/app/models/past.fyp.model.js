import mongoose from "mongoose";

const PastFypSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    technologies: {
        type: [String],
        default: [],
    },
    abstract: {
        type: String,
        default: "",
    },
    pdf_file: {
        type: String,
        required: true,
        unique: true,
    },
    members: {
        type: [
            {
                name: { type: String, default: "" },
                studentId: { type: String, default: "" },
            }
        ],
        default: [],
    },
    supervisor: {
        type: String,
        default: "",
    },
}, { timestamps: true, versionKey: false });

PastFypSchema.index({ title: "text", technologies: "text", supervisor: "text" });

const PastFyp = mongoose.model("FypProject", PastFypSchema, "fypProjects");
export default PastFyp;
