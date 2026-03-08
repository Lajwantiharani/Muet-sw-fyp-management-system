import Meeting from "../../../app/models/meeting.model.js";
import Presentation from "../../../app/models/presentation.model.js";
import Project from "../../../app/models/project.model.js";
import Proposal from "../../../app/models/proposal.model.js";
import User from "../../../app/models/user.model.js";
import userService from "../../../app/services/user.service.js";
import proposalService from "../../../app/services/proposal.service.js";
import projectService from "../../../app/services/project.service.js";
import presentationService from "../../../app/services/presentation.service.js";
import meetingService from "../../../app/services/meeting.service.js";
import getBatchQuery from "./getBatchQuery.js";

const admin = async (user) => {
    const currentQuery = getBatchQuery("current", {});

    const accountsQuery = { query: {}, current: 1, size: await User.countDocuments(), sort: {} };
    const proposalsQuery = { query: { ...currentQuery }, current: 1, size: await Proposal.countDocuments(), sort: {} };
    const projectsQuery = { query: {}, current: 1, size: await Project.countDocuments(), sort: {} };
    const presentationsQuery = { query: {}, current: 1, size: await Presentation.countDocuments(), sort: {} };

    return {
        accounts: {
            total: (await userService.retrieveAll('all', user._id, accountsQuery))?.users?.length ?? 0,
            active: (await userService.retrieveAll('active', user._id, accountsQuery))?.users?.length ?? 0,
            inactive: (await userService.retrieveAll('inactive', user._id, accountsQuery))?.users?.length ?? 0,
            pending: (await userService.retrieveAll('approvalPending', user._id, accountsQuery))?.users?.length ?? 0,
            rejected: (await userService.retrieveAll('rejected', user._id, accountsQuery))?.users?.length ?? 0,
        },

        proposals: {
            total: (await proposalService.retrieveAll(user._id, 'all', proposalsQuery))?.proposals?.length ?? 0,
            accepted: (await proposalService.retrieveAll(user._id, 'accepted', proposalsQuery))?.proposals?.length ?? 0,
            conditionallyAccepted: (await proposalService.retrieveAll(user._id, 'conditionallyAccepted', proposalsQuery))?.proposals?.length ?? 0,
            rejected: (await proposalService.retrieveAll(user._id, 'rejected', proposalsQuery))?.proposals?.length ?? 0,
            pending: (await proposalService.retrieveAll(user._id, 'pending', proposalsQuery))?.proposals?.length ?? 0,
        },

        projects: {
            total: (await projectService.retrieveAll('all', projectsQuery))?.projects?.length ?? 0,
            completed: (await projectService.retrieveAll('completed', projectsQuery))?.projects?.length ?? 0,
            underDevelopment: (await projectService.retrieveAll('underDevelopment', projectsQuery))?.projects?.length ?? 0,
            initialized: (await projectService.retrieveAll('initialized', projectsQuery))?.projects?.length ?? 0,
        },

        presentations: {
            total: (await presentationService.retrieveAll({ requestUser: user, status: 'all' }, presentationsQuery))?.presentations?.length ?? 0,
            pendingReview: (await presentationService.retrieveAll({ requestUser: user, status: 'pendingReview' }, presentationsQuery))?.presentations?.length ?? 0,
            approved: (await presentationService.retrieveAll({ requestUser: user, status: 'approved' }, presentationsQuery))?.presentations?.length ?? 0,
            rejected: (await presentationService.retrieveAll({ requestUser: user, status: 'rejected' }, presentationsQuery))?.presentations?.length ?? 0,
        },
    };
}

const supervisor = async (user) => {
    const projectsQuery = { query: {}, current: 1, size: await Project.countDocuments(), sort: {} };
    const presentationsQuery = { query: {}, current: 1, size: await Presentation.countDocuments(), sort: {} };
    const meetingsQuery = { query: {}, current: 1, size: await Meeting.countDocuments(), sort: {} };

    return {
        projects: {
            total: (await projectService.retrieveMany({ supervisorId: user._id.toString(), status: 'all' }, projectsQuery))?.projects?.length ?? 0,
            completed: (await projectService.retrieveMany({ supervisorId: user._id.toString(), status: 'completed' }, projectsQuery))?.projects?.length ?? 0,
            underDevelopment: (await projectService.retrieveMany({ supervisorId: user._id.toString(), status: 'underDevelopment' }, projectsQuery))?.projects?.length ?? 0,
            initialized: (await projectService.retrieveMany({ supervisorId: user._id.toString(), status: 'initialized' }, projectsQuery))?.projects?.length ?? 0,
        },

        presentations: {
            total: (await presentationService.retrieveAll({ requestUser: user, status: 'all' }, presentationsQuery))?.presentations?.length ?? 0,
            pendingReview: (await presentationService.retrieveAll({ requestUser: user, status: 'pendingReview' }, presentationsQuery))?.presentations?.length ?? 0,
            approved: (await presentationService.retrieveAll({ requestUser: user, status: 'approved' }, presentationsQuery))?.presentations?.length ?? 0,
            rejected: (await presentationService.retrieveAll({ requestUser: user, status: 'rejected' }, presentationsQuery))?.presentations?.length ?? 0,
        },

        meetings: {
            total: (await meetingService.retrieveAll({ requestUser: user, status: 'all' }, meetingsQuery))?.meetings?.length ?? 0,
            past: (await meetingService.retrieveAll({ requestUser: user, status: 'past' }, meetingsQuery))?.meetings?.length ?? 0,
            scheduled: (await meetingService.retrieveAll({ requestUser: user, status: 'scheduled' }, meetingsQuery))?.meetings?.length ?? 0,
        }
    };
}

const student = async (user) => {
    const presentationsQuery = { query: {}, current: 1, size: await Presentation.countDocuments(), sort: {} };
    const meetingsQuery = { query: {}, current: 1, size: await Meeting.countDocuments(), sort: {} };

    return {
        project: {
            title: (await projectService.retrieveOne(String(user._id)))?.title ?? null,
            progress: (await projectService.retrieveOne(String(user._id)))?.progress ?? 0,
            status: (await projectService.retrieveOne(String(user._id)))?.status ?? null,
        },

        presentations: {
            total: (await presentationService.retrieveAll({ requestUser: user, status: 'all' }, presentationsQuery))?.presentations?.length ?? 0,
            pendingReview: (await presentationService.retrieveAll({ requestUser: user, status: 'pendingReview' }, presentationsQuery))?.presentations?.length ?? 0,
            approved: (await presentationService.retrieveAll({ requestUser: user, status: 'approved' }, presentationsQuery))?.presentations?.length ?? 0,
            rejected: (await presentationService.retrieveAll({ requestUser: user, status: 'rejected' }, presentationsQuery))?.presentations?.length ?? 0,
        },

        meetings: {
            total: (await meetingService.retrieveAll({ requestUser: user, status: 'all' }, meetingsQuery))?.meetings?.length ?? 0,
            past: (await meetingService.retrieveAll({ requestUser: user, status: 'past' }, meetingsQuery))?.meetings?.length ?? 0,
            scheduled: (await meetingService.retrieveAll({ requestUser: user, status: 'scheduled' }, meetingsQuery))?.meetings?.length ?? 0,
        }
    };
}

const dashboardData = async (user) => {
    switch (user.role) {
        case "admin":
            return await admin(user);

        case "supervisor":
            return await supervisor(user);

        case "student":
            return await student(user);

        default:
            throw new Error("Invalid user role");
    }
}
export default dashboardData;