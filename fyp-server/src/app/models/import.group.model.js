import mongoose from "mongoose";

const ImportGroupSchema = new mongoose.Schema({
    batch: {
        type: String,
        required: true,
        trim: true,
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ImportStudent",
        required: true,
    }],
    memberNamesKey: {
        type: String,
        required: true,
        unique: true,
    },
}, { timestamps: true, versionKey: false });

ImportGroupSchema.index({ batch: 1 });

const Group = mongoose.models.ImportGroup
    || mongoose.model("ImportGroup", ImportGroupSchema, "import_groups");

export default Group;
