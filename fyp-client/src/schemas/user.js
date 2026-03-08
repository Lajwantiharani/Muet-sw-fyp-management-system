import * as z from "zod";

const createAdminSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    cnic: z
        .string()
        .length(13, { message: "CNIC No. must be exactly 13 digits" })
        .regex(/^\d{13}$/, { message: "NIC must contain only digits" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal(""))
});

const createSupervisorSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    cnic: z
        .string()
        .length(13, { message: "CNIC No. must be exactly 13 digits" })
        .regex(/^\d{13}$/, { message: "NIC must contain only digits" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal("")),

    department: z
        .string()
        .min(2, { message: "Department must be at least 2 characters long" })
        .max(10, { message: "Department must not exceed 50 characters" }),
});

const createStudentSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    cnic: z
        .string()
        .length(13, { message: "CNIC No. must be exactly 13 digits" })
        .regex(/^\d{13}$/, { message: "NIC must contain only digits" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal("")),

    rollNo: z
        .string()
        .min(1, { message: "The Roll No. is required" })
        .regex(/^[0-9]{2}[a-zA-Z]{2}[0-9]{3}$/, { message: "Invalid Roll No. format (e.g., 21SW066)" }),

    department: z
        .string()
        .min(2, { message: "Department must be at least 2 characters long" })
        .max(10, { message: "Department must not exceed 50 characters" }),

    batch: z
        .string()
        .min(4, { message: "Batch year must be at least 4 digits" })
        .max(4, { message: "Batch year must be exactly 4 digits" })
        .refine((val) => /^\d{4}$/.test(val), {
            message: "Batch year must be a valid 4-digit year",
        }),

    shift: z
        .string()
        .min(1, { message: "The batch shift field is required" })
        .refine((val) => ["morning", "evening"].includes(val), {
            message: "Invalid batch shift selection",
        }),
});

const updateAdminProfileSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal("")),

});

const updateSupervisorProfileSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal("")),

    department: z
        .string()
        .min(2, { message: "Department must be at least 3 characters long" })
        .max(10, { message: "Department must not exceed 50 characters" }),

});

const updateStudentProfileSchema = z.object({
    name: z
        .string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(50, { message: "Name must not exceed 50 characters" }),

    email: z
        .string()
        .email({ message: "Invalid email address" })
        .min(6, { message: "Email must be at least 6 characters long" })
        .max(255, { message: "Email must not exceed 255 characters" }),

    phone: z
        .string()
        .regex(/^(3[0-3,7]\d{8})$/, { message: "Enter a valid Phone number (10-digits)" })
        .optional()
        .or(z.literal("")),

    shift: z
        .string()
        .min(1, { message: "The batch shift field is required" })
        .refine((val) => ["morning", "evening"].includes(val), {
            message: "Invalid batch shift selection",
        }),

});

const updateProfileImageschema = z.object({
    image: z
        .any()
        .refine((file) => file && file.length > 0, { message: "Image file is required" })
        .refine(
            (file) => file && file.length > 0 && ["image/jpeg", "image/png", "image/jpg"].includes(file[0].type),
            { message: "Only JPG, JPEG, and PNG images are allowed" }
        )
        .refine(
            (file) => file && file.length > 0 && file[0].size <= 3 * 1024 * 1024,
            { message: "Image size must not exceed 3MB" }
        ),
});

const updatePasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(1, { message: "The current password is required" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        }),
});

export { createAdminSchema, createSupervisorSchema, createStudentSchema, updateAdminProfileSchema, updateSupervisorProfileSchema, updateStudentProfileSchema, updateProfileImageschema, updatePasswordSchema };
