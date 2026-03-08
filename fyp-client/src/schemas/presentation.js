import * as z from "zod";

const createPresentationSchema = z.object({
    fyp: z
        .string()
        .refine((val) =>
            ["fyp1", "fyp2", "fyp3", 'fypFinal'].includes(val),
            {
                message: "Phase must be in 'FPY 01', 'FYP 02', or 'FYP Final'",
            }
        ),

    summary: z
        .string()
        .refine((val) => {
            const wordCount = val.trim().split(/\s+/).length;
            return wordCount >= 10 && wordCount <= 350;
        }, {
            message: "Summary must be between 10 and 350 words",
        }),

    resource: z
        .any()
        .refine(
            (file) => file && file.length > 0,
            { message: "Proposal file is required" }
        )
        .refine(
            (file) => {
                console.log(file);
                return file && file.length > 0 &&
                    [
                        "application/pdf",
                        "application/msword",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        "application/vnd.ms-powerpoint",
                        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        "application/zip",
                        "application/x-zip-compressed",
                        "application/x-rar-compressed",
                        "application/x-7z-compressed",
                        "application/x-tar",
                    ].includes(file[0].type);
            },
            {
                message: "Only PDF, DOC, DOCX, PPT, PPTX, ZIP, RAR, 7Z, and TAR files are allowed",
            }
        )
        .refine(
            (file) => file && file.length > 0 && file[0].size <= 10 * 1024 * 1024,
            { message: "File size must not exceed 10MB", }
        ),
});

const ReviewPresentationSchema = z.object({
    status: z
        .string()
        .refine((val) =>
            ["approved", "rejected"].includes(val),
            {
                message: "Choose the status as 'Approve' or 'Reject'",
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


export { createPresentationSchema, ReviewPresentationSchema };
