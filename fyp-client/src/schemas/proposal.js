import * as z from "zod";

const createProposalSchema = z.object({
    memberOne: z
        .string()
        .optional()
        .or(z.literal("")),

    memberTwo: z
        .string()
        .optional()
        .or(z.literal("")),

    title: z
        .string()
        .min(3, { message: "Title must be at least 3 characters long" })
        .max(255, { message: "Title must not exceed 50 characters" }),

    abstract: z
        .string()
        .refine(
            (val) => {
                const wordCount = val.trim().split(/\s+/).length;
                return wordCount >= 200 && wordCount <= 350;
            },
            {
                message: "Abstract must be between 200 and 350 words",
            }
        ),

    type: z
        .string()
        .refine((val) =>
            ["new", "modifiedOrExtension", "researchBased"].includes(val),
            {
                message: "Type must be either 'New', 'Modified Or Extension', or 'Research Based'",
            }
        ),

    category: z
        .string()
        .min(3, { message: "Category must be at least 3 characters long" })
        .max(50, { message: "Category must not exceed 50 characters" }),
});

const proposalEvaluationSchema = (departmentPrefix = "XX") => {
    const pidRegex = new RegExp(`^${departmentPrefix}-\\d{3}$`);

    return z.object({
        supervisor: z.string().min(1, { message: "The supervisor is required" }),

        pid: z.
            string()
            .min(1, {message:"Project ID is required"})
            .refine(
                (val) => pidRegex.test(val),
                {
                    message: `Project ID format '${departmentPrefix}-001'`,
                }
            ),

        statusCode: z.string().refine(
            (val) => ["20001", "20002", "20003"].includes(val),
            {
                message: "Set status to one of 'Accept', 'Accept with conditions', or 'Reject'",
            }
        ),

        remarks: z.string().refine((val) => {
            const wordCount = val.trim().split(/\s+/).length;
            return wordCount >= 5 && wordCount <= 350;
        }, {
            message: "Abstract must be between 5 and 350 words",
        }),
    });
};

const RejectStatusHandleSchema = z.object({
    supervisor: z
        .string()
        .optional()
        .or(z.literal("")),

    statusCode: z
        .string()
        .refine((val) =>
            ["20001", "20002", "20003"].includes(val),
            {
                message: "Set status one of the 'Accept', Accept with conditions', or 'Reject'",
            }
        ),

    remarks: z
        .string()
        .refine(
            (val) => {
                const wordCount = val.trim().split(/\s+/).length;
                return wordCount >= 5 && wordCount <= 350;
            },
            {
                message: "Remarks must be between 5 and 350 words",
            }
        ),
});

export { createProposalSchema, proposalEvaluationSchema, RejectStatusHandleSchema }