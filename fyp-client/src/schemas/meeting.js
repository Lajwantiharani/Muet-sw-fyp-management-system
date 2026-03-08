import * as z from "zod";

const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/;

const createMeetingSchema = z
    .object({
        project: z
            .string()
            .min(1, { message: "The project is required" }),

        title: z
            .string()
            .min(5, { message: "The meeting title must be at least 5 characters long" })
            .max(100, { message: "The meeting title must not exceed 100 characters" }),

        schedule: z.preprocess(
            (val) => {
                if (typeof val === "string" || val instanceof Date) {
                    return new Date(val);
                }
                return val;
            },
            z.date().refine((date) => date > new Date(), {
                message: "Schedule must be a future date and time",
            })
        ),

        endsAt: z.preprocess(
            (val) => {
                if (typeof val === "string" || val instanceof Date) {
                    return new Date(val);
                }
                return val;
            },
            z.date()
        ),

        duration: z
            .string()
            .refine((val) => /^\d+$/.test(val), {
                message: "Duration must be a number",
            })
            .transform(Number)
            .refine((val) => val >= 5 && val <= 999, {
                message: "Duration must be between 5 and 999 minutes",
            }),

        reference: z
            .string()
            .optional()
            .refine((val) => !val || urlRegex.test(val), {
                message: "The reference must be a valid URL",
            }),

        summary: z
            .string()
            .refine((val) => {
                const wordCount = val.trim().split(/\s+/).length;
                return wordCount >= 5 && wordCount <= 350;
            }, {
                message: "Meeting overview must be between 5 and 350 words",
            }),
    })
    .refine((data) => data.endsAt > data.schedule, {
        message: "End date must be after the start date and time",
        path: ["endsAt"],
    });

export { createMeetingSchema };
