import validateMongooseObjectId from "../../utils/libs/database/validate.mongoose.object.id.js";
import notificationService from "../services/notification.service.js"
import tryCatch from "../../utils/libs/helper/try.catch.js";
import proposalService from "../services/proposal.service.js";
import projectService from "../services/project.service.js";
import filterRequestBody from "../../utils/libs/helper/filter.request.body.js";
import createMongooseObjectId from "../../utils/libs/database/create.mongoose.object.id.js";
import getDept from '../../utils/libs/helper/getDept.js';
import email from '../../utils/libs/helper/email.js';
import env from "../../config/env.js";

// RETRIEVE ALL IDEA DOCUMENTS
const index = (req, res) => tryCatch(async () => {
    // retrieve proposal documents
    const data = await proposalService.retrieveAll(req.user, req.params.status, req.body.page ?? {});

    // return back with success response containing proposal documents
    return res.response(200, "All proposal records", data);
}, res);


// RETRIEVE ONE SINGLE IDEA DOCUMENT
const retrieveMany = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { proposalId } = req.params;

    // vaidate parameter proposal id
    validateMongooseObjectId(proposalId);

    // retrieve request user related proposal document
    const query = {
        $or: [
            { _id: proposalId },
            { lead: proposalId },
            { memberOne: proposalId },
            { memberTwo: proposalId }
        ]
    }

    // retrieve many proposal documents
    const data = await proposalService.retrieveMany(query, req.body.page ?? {});

    // return back with success response containg proposal document
    return res.response(200, "Requested proposal record", data);
}, res);


// CREATE A NEW IDEA DOCUMENT
const create = (req, res) => tryCatch(async () => {
    // only fields that are allowed to be inserted
    const allowedFields = ['memberOne', 'memberTwo', 'title', 'abstract', 'type', 'category'];

    // extacting only allowed fields from request body
    const data = filterRequestBody(req.body, allowedFields);

    // retrieve project document agains reference id if exists, and return back with reference has an active project response
    const refIds = [req.user?._id, data?.memberOne, data?.memberTwo].filter(Boolean).map(createMongooseObjectId);
    const refs = ["lead", "memberOne", "memberTwo"];
    for (const id of refIds) {
        for (const ref of refs) {
            const idea = await proposalService.retrieveOne({ [ref]: id });
            if (idea && idea?.status != "rejected") {
                const projectOrPicthedIdea = idea?.status != "pending" ? "project" : "pitched project idea";
                return res.response(400, `${ref == "lead" ? "You are" : idea[ref]?.name + " is"} already a member of the ${projectOrPicthedIdea} titled "${idea?.title ?? 'project'}".`)
            };
        }
    }

    // attempt to create a new proposal document; throw failed to create error if unsuccessful
    const proposal = await proposalService.create({
        lead: req.user._id,
        department: req.user?.department,
        batch: req.user?.batch,
        shift: req.user?.shift,
        ...data
    });
    if (!proposal) throw new Error("Failed to create proposal");

    // push notification
    notificationService.push({
        title: `Proposal received: "${proposal.title}"`,
        message: `A new project proposal titled "${proposal.title}" has been submitted by ${req.user?.name} from the ${getDept(req.user?.department)} department, batch ${req.user?.batch} (${req.user?.shift} shift). Please review the submission.`,
    }, "admins");

    // return back with success response containing newly created proposal document
    return res.response(200, "The proposal was created", { proposal });
}, res);


// UPDATE A IDEA DOCUMENT BY ID WHEN REQUEST USER IS ADMIN ONLY
const update = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { proposalId } = req.params;

    // vaidate parameter proposal id
    validateMongooseObjectId(proposalId);

    // allowed fields that can be modified
    const allowedFields = ["supervisor", "remarks", "pid", "statusCode"];

    // retrieve only allowed fields from request body
    const changes = filterRequestBody(req.body, allowedFields);

    // generate user status data based on statuCode
    let status;
    if (changes?.statusCode) switch (changes.statusCode) {
        case "20001": status = { label: "accepted", value: "accepted" }; break;
        case "20002": status = { label: "accepted with conditions", value: "conditionallyAccepted" }; break;
        case "20003": status = { label: "rejected", value: "rejected" }; break;
        default: throw new Error("An unknown status code");
    }

    // return back with bad request if proposal was accepted but no supervisor assigned
    if (changes?.statusCode !== "20003" && !changes?.supervisor) {
        return res.response(400, "Supervisor is required once proposal is accepted");
    }

    // adjust the status accordingly
    changes.status = status.value;

    // update proposal document fields accordingly
    const proposal = await proposalService.update({ _id: proposalId }, changes);

    // return back with proposal document not found response
    if (!proposal) return res.response(404, "The proposal ID is invalid");

    // team ids
    const teamIds = [proposal.lead?._id, proposal.memberOne?._id, proposal.memberTwo?._id];

    // initialize the project
    if (status.value != "rejected") {
        const project = await projectService.create({
            lead: proposal?.lead?._id ?? null,
            memberOne: proposal?.memberOne?._id ?? null,
            memberTwo: proposal?.memberTwo?._id ?? null,
            supervisor: proposal?.supervisor?._id ?? null,
            pid: changes?.pid.toUpperCase(),
            title: proposal.title,
            abstract: proposal.abstract,
            type: proposal.type,
            category: proposal.category,
            department: proposal?.department ?? null,
            batch: proposal?.batch ?? null,
            shift: proposal?.shift ?? null,
        });

        if (!project) return res.response(404, "Failed to initialize project");

        // push notification
        notificationService.push({
            title: "Project initialized",
            message: `Your proposal "${proposal.title}" has been ${status.label} and converted into a project with PID: ${changes?.pid} your supervisor will be ${project.supervisor?.name}. Please proceed accordingly.`,
        }, teamIds);

        // push notification
        notificationService.push({
            title: "New supervision assigned",
            message: `You have been assigned as the supervisor for the project titled "${proposal.title}" PID: ${changes?.pid}. Please review the project details and coordinate with the student team.`,
        }, proposal?.supervisor?._id);
    }

    // push notification
    notificationService.push({
        title: `Proposal ${status.label}`,
        message: `Your proposal titled "${proposal.title}" has been ${status.label} by the admin. Please check for remarks or next steps.`,
    }, teamIds);

    // email to all concerned students
    const students = [proposal.lead, proposal.memberOne, proposal.memberTwo];
    students.filter(Boolean).forEach(student => {
        email.send(student.email, {
            subject: `Proposal ${proposal.title.capEach()} | ${status.label.capEach()}`,
            name: (student.name ?? "Student").capEach(),
            status: status.label,
            dashboardLink: `${env.client.origin}/my-ideas`,
            template: 'proposal-update'
        });
    });

    // return back with success response containing update proposal document
    return res.response(200, `The proposal was ${status.label}`, { proposal });
}, res);


// DELETE IDEA DOCUMENT 
const del = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { proposalId } = req.params;

    // vaidate parameter proposal id
    validateMongooseObjectId(proposalId);

    // if requet user is student
    if (req.user.role == "student") {
        // retrieve request user related proposal document when lead
        const proposal = await proposalService.retrieveOne({ _id: proposalId, lead: req.user._id });

        // return back with access denied response; if proposal document not found
        if (!proposal) return res.response(403, "Access forbidden");
    }

    // attempt to delete single specified proposal document
    const proposal = await proposalService.delete(proposalId);

    // return back with proposal document not found response when document is unavailable
    if (!proposal) return res.response(404, "The proposal ID is invalid");

    // return back with success response
    return res.response(200, "The proposal has been deleted");
}, res);


export default { index, retrieveMany, create, update, delete: del }