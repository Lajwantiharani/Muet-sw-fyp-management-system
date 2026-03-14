import mongoose from "mongoose";

const ImportSupervisorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    department: {
        type: String,
        default: "",
        trim: true,
    },
}, { timestamps: true, versionKey: false });

const Supervisor = mongoose.models.ImportSupervisor
    || mongoose.model("ImportSupervisor", ImportSupervisorSchema, "import_supervisors");

export default Supervisor;
