import mongoose from "mongoose";

const ImportStudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    batch: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true, versionKey: false });

ImportStudentSchema.index({ name: 1, batch: 1 }, { unique: true });

const Student = mongoose.models.ImportStudent
    || mongoose.model("ImportStudent", ImportStudentSchema, "import_students");

export default Student;
