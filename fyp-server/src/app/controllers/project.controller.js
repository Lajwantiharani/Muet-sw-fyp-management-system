import validateMongooseObjectId from "../../utils/libs/database/validate.mongoose.object.id.js";
import notificationService from "../services/notification.service.js"
import tryCatch from "../../utils/libs/helper/try.catch.js";
import projectService from "../services/project.service.js";
import filterRequestBody from "../../utils/libs/helper/filter.request.body.js";
import createMongooseObjectId from "../../utils/libs/database/create.mongoose.object.id.js";

// RETRIEVE ALL PROJECT DOCUMENTS
const index = (req, res) => tryCatch(async () => {
    // retrieve project documents
    const data = await projectService.retrieveAll(req.params?.status, req.body?.page ?? {});

    // return back with success response containing project documents
    return res.response(200, "All project records", data);
}, res);


// RETRIEVE ALL SUPERVISOR RELATED PROJECTS
const supervisorProjects = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { supervisorId, status } = req.params;

    // vaidate supervisor id
    validateMongooseObjectId(supervisorId);

    // retrieve supervisor related project documents
    const data = await projectService.retrieveMany({ supervisorId, status }, req.body.page ?? {});

    // return back with success response containg project document
    return res.response(200, "All supervisor related project records", data);
}, res);

// RETRIEVE ONE SINGLE PROJECT DOCUMENT
const show = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { projectId } = req.params;

    // vaidate parameter project id
    validateMongooseObjectId(projectId);

    // retrieve single specified project document
    const project = await projectService.retrieveOne(projectId);

    // return back with project document not found response
    if (!project) return res.response(404, "The project ID is invalid")

    // return back with success response containg project document
    return res.response(200, "Requested project record", { project });
}, res);


// CREATE A NEW PROJECT DOCUMENT
const create = (req, res) => tryCatch(async () => {
    // only fields that are allowed to be inserted
    const allowedFields = ['lead', 'memberOne', 'memberTwo', 'supervisor', 'pid', 'title', 'abstract', 'type', 'category'];

    // extacting only allowed fields from request body
    const data = filterRequestBody(req.body, allowedFields);

    // retrieve project document agains reference id if exists, and return back with reference has an active project response
    const refIds = [data?.lead, data?.memberOne, data?.memberTwo].filter(Boolean).map(createMongooseObjectId);
    const refs = ["lead", "memberOne", "memberTwo"];
    for (const id of refIds) {
        for (const ref of refs) {
            const project = await projectService.retrieveOne({ [ref]: id });
            if (project) return res.response(400, `${project[ref]?.name} is already a member of the project titled "${project?.title ?? 'project'}".`);
        }
    }

    // attempt to create a new project document; throw failed to create error if unsuccessful
    const project = await projectService.create(data);
    if (!project) throw new Error("Failed to initialize the project");

    // return back with success response containing newly created project document
    return res.response(200, "The project has been initialized", { project });
}, res);


// UDATE A PROJECT DOCUMENT BY ID WHEN REQUEST USER IS ADMIN/SUPERVISOR OTHERWISE BY LEAD/MEMBERONE/MEMBERTWO
const update = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { projectId } = req.params;

    // vaidate parameter project id
    validateMongooseObjectId(projectId);

    // retrieve specified project document
    let project = await projectService.retrieveOne({ _id: projectId });

    // return back with project document not found response when document is unavailable
    if (!project) return res.response(404, "The project ID is invalid");

    // fields allowed that can be replaced/null
    const referenceFields = ['lead', 'memberOne', 'memberTwo'];

    // initialize allowed fields array
    let allowedFields = [];

    // if the request user is lead/memberOne|Two
    if (req.user.role == "student") {
        // retrieve student reference IDs
        const references = project.only(referenceFields, true);

        // find match whether the request user is one of them project lead/memberOne|Two
        const requestUser = Object.keys(references).find((field) => {
            return references[field] && references[field]._id.equals(req.user._id);
        });

        // return back with access denied response when request user is not one of them (lead/memberOne|Two)
        if (!requestUser) return res.response(403, "Access forbidden");

        // set allowed fields for lead/memberOne|Two
        allowedFields = ['title', 'abstract', 'proposal', 'type', 'category'];

        // let project lead to add/remoce memberOne|Two
        if (requestUser === 'lead') {
            allowedFields.push('memberOne', 'memberTwo');
        }
    }

    // if the request user is supervisor
    if (req.user.role == "supervisor") {
        // return back with access denied response when request user is not project supervisor
        if (!project.supervisor || !project.supervisor._id.equals(req.user._id)) {
            return res.response(403, "Access forbidden");
        }

        // set allowed fields for project supervisor
        allowedFields = ['lead', 'memberOne', 'memberTwo', 'status'];
    }

    // it request user is admin add-on 
    if (req.user.role == "admin") {
        // set allowed fields for an admin
        allowedFields = ['lead', 'memberOne', 'memberTwo', 'supervisor', 'status'];
        referenceFields.push('supervisor');
    }

    // retrieve only allowed fields from request body
    const changes = filterRequestBody(req.body, allowedFields, { acceptNull: referenceFields });

    // // allow lead/memberOne|two and supervisor to be completely removed or replaced
    referenceFields.forEach((field) => changes[field] == "" && (changes[field] = null));

    // retrieve project document agains reference id if exists, and return back with reference has an active project response
    const refIds = [changes?.lead, changes?.memberOne, changes?.memberTwo].filter(Boolean).map(createMongooseObjectId);
    const refs = ["lead", "memberOne", "memberTwo"];
    for (const id of refIds) {
        for (const ref of refs) {
            const pro = await projectService.retrieveOne({ [ref]: id });
            if (pro && !pro?._id.equals(projectId)) return res.response(400, `${pro[ref]?.name} is already a member of the project titled "${pro?.title ?? 'project'}".`);
        }
    }

    // update project document fields accordingly
    const updatedProject = await projectService.update({ _id: project._id }, changes);

    // push notification
    const prevMemberIds = [project.lead?._id, project.memberOne?._id, project.memberTwo?._id].filter(Boolean).map(String);
    const newMemberIds = [changes?.lead, changes?.memberOne, changes?.memberTwo].filter(Boolean);
    prevMemberIds.forEach(id => {
        if (!newMemberIds.includes(id)) {
            notificationService.push({
                title: "You have been removed from a project",
                message: `You are no longer a member of the project titled "${project.title}" PID: ${project?.pid}.`,
            }, id);
        }
    });

    // push notification
    if (!project.lead?._id.equals(changes?.lead)) {
        notificationService.push({
            title: "You're now a Project Team Lead",
            message: `You are now the team lead for the project titled "${project.title}" PID: ${project?.pid}. Lead responsibly and ensure smooth coordination with your team.`,
        }, changes?.lead);
    }

    // push notification
    const addedMemberIds = newMemberIds.filter(id => !prevMemberIds.includes(id) && id?.toString() != changes?.lead?.toString());
    addedMemberIds.forEach(id => {
        notificationService.push({
            title: "You've been added to a Project Team",
            message: `You have been added as a team member to the project titled "${project.title}" PID: ${project?.pid}. Collaborate closely with your team and supervisor.`,
        }, id);
    });

    // push notification
    if (!project.supervisor?._id.equals(changes?.supervisor)) {
        notificationService.push({
            title: "New Supervision Assigned",
            message: `You have been assigned to supervise the project titled "${project.title}" PID: ${project?.pid}. Please review the proposal and guide the team accordingly.`,
        }, changes?.supervisor);
    }

    // return back with success response containing update project document
    return res.response(200, "The project has been updated", { project: updatedProject });
}, res);

const uploadProposalFile = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { projectId } = req.params;

    // vaidate parameter project id
    validateMongooseObjectId(projectId);

    // retrieve specified project document
    let project = await projectService.retrieveOne({ _id: projectId });

    // return back with project document not found response when document is unavailable
    if (!project) return res.response(404, "The project ID is invalid");

    // allowed fields that can be replaced/null
    const allowedFields = ["proposal"];

    // retrieve only allowed fields from request body
    const changes = filterRequestBody(req.body, allowedFields);

    // update project document fields accordingly
    project = await projectService.update({ _id: project._id }, { ...changes, status: "underDevelopment", progress: 25 });

    // push notification
    notificationService.push({
        title: "Proposal File Submitted",
        message: `The project team for "${project.title}" PID: ${project.pid} has submitted the proposal file. Please review and provide feedback.`,
    }, project.supervisor._id);

    // return back with success response containing update project document
    return res.response(200, "The project proposal file uploaded", { project });
}, res);


// DELETE PROJECT DOCUMENT 
const del = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { projectId } = req.params;

    // attempt to delete single specified project document
    const project = await projectService.delete(projectId);

    // return back with project document not found response when document is unavailable
    if (!project) return res.response(404, "The project ID is invalid");

    // return back with success response
    return res.response(200, "The project has been deleted");
}, res);


export default { index, show, supervisorProjects, create, update, uploadProposalFile, delete: del }