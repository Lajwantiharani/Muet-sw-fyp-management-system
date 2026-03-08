import cron from "node-cron";

import file from "../../../app/middlewares/file.js";
import Project from "../../../app/models/project.model.js";
import Presentation from "../../../app/models/presentation.model.js";
import Meeting from "../../../app/models/meeting.model.js";
import User from "../../../app/models/user.model.js";

// schedule cleanup every midnight
cron.schedule('0 0 * * *', async () => {
    // check and delete expired projects and their proposal files
    const expiredProjects = await Project.find({ expiresAt: { $lte: new Date() } });
    for (const project of expiredProjects) {
        // delete it's all presentations
        await Presentation.deleteMany({ project: project._id });

        // delete it's all meetings
        await Meeting.deleteMany({ project: project._id });

        // check and delete project proposal file
        if (project?.proposal) file.delete(project.proposal);

        // disable all concern students accounts to prevent them from logging in
        const refsIds = [project.lead, project.memberOne, project.memberTwo].filter(Boolean);
        for (const id of refsIds) {
            await User.findByIdAndUpdate(id, { $set: { status: 'inactive' } });
        }

        // delete project itself
        await project.deleteOne();
    }

    // check and delete expired presentations and their resource files
    const expiredPresentations = await Presentation.find({ expiresAt: { $lte: new Date() } });
    for (const presentation of expiredPresentations) {
        if (presentation?.resource) file.delete(presentation.resource);
        await presentation.deleteOne();
    }
});