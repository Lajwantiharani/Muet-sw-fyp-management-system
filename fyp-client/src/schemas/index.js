// auth schemas
export { signinSchema, signupSupervisorSchema, signupStudentSchema, requestResetPasswordSchema, resetPasswordSchema } from "./auth";

//  user
export { createAdminSchema, createSupervisorSchema, createStudentSchema, updateAdminProfileSchema, updateSupervisorProfileSchema, updateStudentProfileSchema, updateProfileImageschema, updatePasswordSchema } from "./user";

// proposal
export { createProposalSchema, proposalEvaluationSchema, RejectStatusHandleSchema } from "./proposal";

// presentation
export { createPresentationSchema, ReviewPresentationSchema } from "./presentation";

// meeting
export { createMeetingSchema } from "./meeting";

// project
export { uploadProposalFileSchema, manageTeamSchema } from "./project";