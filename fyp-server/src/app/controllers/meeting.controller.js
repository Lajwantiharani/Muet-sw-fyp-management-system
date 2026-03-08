import validateMongooseObjectId from "../../utils/libs/database/validate.mongoose.object.id.js";
import notificationService from "../services/notification.service.js"
import meetingService from "../services/meeting.service.js";
import tryCatch from "../../utils/libs/helper/try.catch.js";
import filterRequestBody from "../../utils/libs/helper/filter.request.body.js";
import dateSatus from "../../utils/libs/helper/dateStatus.js";
import scheduleZoomMeetingSession from "../../utils/libs/helper/scheduleZoomMeetingSession.js";
import Meeting from "../models/meeting.model.js";
import email from "../../utils/libs/helper/email.js";

// RETRIEVE ALL MEETING DOCUMENTS
const index = (req, res) => tryCatch(async () => {
    // retrieve user concerned
    const userConcerned = { requestUser: req.user, status: req.params.status };

    // retrieve project documents
    const data = await meetingService.retrieveAll(userConcerned, req.body.page ?? {});

    // return back with success response containing meeting documents
    return res.response(200, "All meeting records", data);
}, res);


// RETRIEVE ALL PROJECT RELATED PROGRESSES
const projectMeetings = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { projectId } = req.params;

    // vaidate project id
    validateMongooseObjectId(projectId);

    // retrieve project documents
    const data = await meetingService.retrieveMany(projectId, req.body.page ?? {});

    // return back with success response containing project documents
    return res.response(200, "All meeting reference records", data);
}, res);


// RETRIEVE ONE SINGLE MEETING DOCUMENT
const show = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { meetingId } = req.params;

    // retrieve single specified meeting document
    const meeting = await meetingService.retrieveOne(meetingId);

    // return back with meeting document not found response
    if (!meeting) return res.response(404, "The meeting ID is invalid");

    // return back with success response containg meeting document
    return res.response(200, "Requested meeting reference record", { meeting });
}, res);


// CREATE A NEW MEETING DOCUMENT
const create = (req, res) => tryCatch(async () => {
    // only fields that are allowed to be inserted
    const allowedFields = ['project', 'title', 'schedule', 'endsAt', 'duration', 'reference', 'summary'];

    // extacting only allowed fields from request body
    const data = filterRequestBody(req.body, allowedFields);

    // schedule zoom meeting session
    const session = await scheduleZoomMeetingSession(data);

    // create data for final meeting storing
    const dataWithZoomSession = {
        ...data,
        scheduledBy: req.user?.role ?? "admin",
        meetingId: session.id,
        uuid: session.uuid,
        startUrl: session.start_url,
        joinUrl: session.join_url,
        password: session.password,
        encryptedPassword: session.encrypted_password
    }

    // create a new meeting document
    const meeting = await meetingService.create(dataWithZoomSession);

    // return back with failed to create meeting response once failed
    if (!meeting) throw new Error("Failed to create a meeting reference");

    // notify all student participants
    const teamIds = [meeting.project.lead?._id, meeting.project.memberOne?._id, meeting.project.memberTwo?._id];
    notificationService.push({
        title: "New Meeting Scheduled",
        message: `A new meeting "${data.title}" for project PID: ${meeting.project?.pid} has been scheduled on ${new Date(data?.schedule).toLocaleString()}. You can join using the provided link.`,
    }, teamIds);

    // email to all concerned students
    const students = [meeting?.project?.lead, meeting?.project?.memberOne, meeting?.project?.memberTwo];
    students.filter(Boolean).forEach(student => {
        email.send(student.email, {
            subject: `Meeting Scheduled At ${new Date(data?.schedule).toLocaleString()}`,
            name: (student.name ?? "Student").capEach(),
            topic: meeting.title?.cap(),
            duration: meeting.duration,
            schedule: new Date(data?.schedule).toLocaleString(),
            template: 'meeting-schedule'
        });
    });

    // return back with success response containing newly created meeting document
    return res.response(201, "The meeting has been scheduled", { meeting });
}, res);


// UDATE A MEETING DOCUMENT BY ID WHEN REQUEST USER IS ADMIN/SUPERVISOR OTHERWISE BY LEAD/MEMBERONE/MEMBERTWO
const update = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { meetingId } = req.params;

    // validate meeting project belongs to request supervisor
    if (req.user.role === "supervisor") {
        // retrieve meeting project supervisor id
        const meeting = await meetingService.retrieveOne(meetingId);

        // return back with meeting document not found response when document is unavailable
        if (!meeting) return res.response(404, "The meeting ID is invalid");

        // return back with access denied response if request supervisor isn't meeting project supervisor
        if (!meeting.project?.supervisor?._id.equals(req.user._id)) {
            return res.response(403, "Access forbidden");
        }
    }

    // initialize allowed fields array
    const allowedFields = ['summary', 'link', 'schedule', 'reference', 'status'];

    // retrieve only allowed fields from request body
    const changes = filterRequestBody(req.body, allowedFields);

    // update meeting document fields accordingly
    const meeting = await meetingService.update(meetingId, changes);

    // return back with meeting document not found response when document is unavailable
    if (!meeting) return res.response(404, "The meeting ID is invalid");

    // return back with success response containing update meeting document
    return res.response(200, "The meeting has been re-sheduled", { meeting });
}, res);


// DELETE MEETING DOCUMENT 
const del = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { meetingId } = req.params;

    // validate meetings ID
    validateMongooseObjectId(meetingId);

    // retrieve meetings document
    let meeting = await meetingService.retrieveOne(meetingId);

    // return back with invalid meeting id response; if document is unavailable
    if (!meeting) return res.response(404, "The meeting ID is invalid");

    // validate meeting project belongs to request supervisor
    if (req.user.role !== "supervisor") {
        // return back with access denied response if request supervisor isn't meeting project supervisor
        if (!meeting.project?.supervisor?._id.equals(req.user._id)) {
            return res.response(403, "Access forbidden");
        }
    }

    // format appropriate message
    const message = (() => {
        if (dateSatus(meeting.schedule) != "Expired") return "The meeting has been postpond";
        return "The meeting record has been deleted";
    })();
    // attempt to delete single specified meeting document
    meeting = await meetingService.delete(meetingId);

    const isMeetingEndedOrExpired = (meeting) => {
        const now = new Date();
        const endsAt = meeting?.endsAt ? new Date(meeting.endsAt) : null;
        return meeting?.status == "ended" || (endsAt && endsAt < now);
    };

    if (!isMeetingEndedOrExpired(meeting)) {
        // push notification
        const teamIds = [meeting.project.lead?._id, meeting.project.memberOne?._id, meeting.project.memberTwo?._id];
        notificationService.push({
            title: "Meeting Postponed",
            message: `The meeting scheduled on ${new Date(meeting?.schedule).toLocaleString()} has been postponed. Please contact your supervisor for further details.`,
        }, teamIds);
    }

    // return back with success response
    return res.response(200, message);
}, res);

// GENERATE MEETING SIGNATURE 
const generateSignature = (req, res) => tryCatch(async () => {
    // destructure request parameters
    const { id, meetingId, role = 0 } = req.body;

    // update meeting status to started
    if (role == 1) {
        const meeting = await meetingService.retrieveOne({ _id: id });

        // if this is the first time meeting is being started
        if (meeting?.status == "waiting") {
            const meeting = await meetingService.update(id, { status: "started" });

            // push notification
            const teamIds = [meeting.project?.lead?._id, meeting.project?.memberOne?._id, meeting.project?.memberTwo?._id];
            notificationService.push({
                title: "Meeting Started",
                message: `Your meeting "${meeting.title}" has just started. Join now using the join button in the meeting.`,
            }, teamIds);

            setTimeout(() => {
                meetingService.update(id, { status: "ended" });

                notificationService.push({
                    title: "Meeting Ended",
                    message: `The meeting "${meeting.title}" has ended. Please make sure to review any notes or summary shared during the session.`,
                }, teamIds);

            }, meeting.duration * 60 * 1000);
        }
    }

    // generate meeting signature to start sdk
    const signature = Meeting.generateSignature({ meetingId, role });

    // return back with success response
    return res.response(200, "The meeting signature created", { signature });
}, res);

export default { index, projectMeetings, show, create, update, generateSignature, delete: del }