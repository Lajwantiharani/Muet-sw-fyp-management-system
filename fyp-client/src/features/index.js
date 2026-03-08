// ui
export { default as notificationReducer } from "./notificationSlice"
export { retrieveNotifications, markNotificationAsRead, markNotificationsAllAsRead, receiveNotification, clearNotifications } from "./notificationSlice"

// ui
export { default as uiReducer } from "./uiSlice"
export { setTheme, setLoading, setMetadata, setErrors, clearErrors } from "./uiSlice"

// auth
export { default as authReducer } from "./authSlice";
export { signin, signup, confirmAccount, requestResetPassword, resetPassword, verifyToken, signout, updateAuthenticatedUser } from "./authSlice";

// users
export { default as userReducer } from "./userSlice";
export { retrieveUsers, createUser, updateProfile, updatePassword, deleteUser, updateStatus, dashboardData } from "./userSlice";

//proposals
export { default as proposalReducer } from "./proposalSlice";
export { retrieveProposals, createProposal, updateProposal, retrieveManyProposal, deleteProposal } from "./proposalSlice";

//projects
export { default as projectReducer } from "./projectSlice";
export { retrieveProjects, createProject, updateProject, uploadProjectFile, retrieveSupervisorProjects, retrieveSingleProject, deleteProject } from "./projectSlice";

//presentations
export { default as presentationReducer } from "./presentationSlice";
export { retrievePresentations, createPresentation, updatePresentation, projectSpecificPresentations, getOnePresentation, deletePresentation } from "./presentationSlice";

//meetings
export { default as meetingsReducer } from "./meetingSlice";
export { retrieveMeetings, createMeeting, updateMeeting, projectSpecificMeetings, getOneMeeting, deleteMeeting, generateSignature } from "./meetingSlice";

//past fyps
export { default as pastFypReducer } from "./pastFypSlice";
export { retrievePastFyps, uploadPastFypPdf, backfillPastFyps } from "./pastFypSlice";
