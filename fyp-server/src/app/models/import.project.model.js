import mongoose from "mongoose";

const ImportProjectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    abstract: {
        type: String,
        default: "",
    },
    technologies: {
        type: [String],
        default: [],
    },
    batch: {
        type: String,
        required: true,
        trim: true,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImportGroup",
        required: true,
    },
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImportSupervisor",
        default: null,
    },
}, { timestamps: true, versionKey: false });

const Project = mongoose.models.ImportProject
    || mongoose.model("ImportProject", ImportProjectSchema, "import_projects");

export default Project;
