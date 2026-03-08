import * as z from "zod";

const uploadProposalFileSchema = z.object({
    proposal: z
        .any()
        .refine(
            (file) => file && file.length > 0,
            { message: "Proposal file is required" }
        )
        .refine(
            (file) => file && file.length > 0 && [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            ].includes(file[0].type),
            { message: "Only PDF, DOC, DOCX, PPT, and PPTX files are allowed" }
        )
        .refine(
            (file) => file && file.length > 0 && file[0].size <= 10 * 1024 * 1024,
            { message: "File size must not exceed 10MB", }
        ),
});

const manageTeamSchema = z.object({
    supervisor: z
        .string()
        .min(1, { message: "The supervisor cannot be removed" }),

    lead: z
        .string()
        .min(1, { message: "Project lead cannot be removed" }),

    memberOne: z
        .string()
        .optional()
        .or(z.literal("")),

    memberTwo: z
        .string()
        .optional()
        .or(z.literal("")),
});

export { uploadProposalFileSchema, manageTeamSchema };
