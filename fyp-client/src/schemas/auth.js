import * as z from "zod";

const signinSchema = z.object({
    username: z
        .string().min(1, { message: "The Username field is required" }),
    password: z
        .string().min(1, { message: "The Password field is required" }),
});

const signupSupervisorSchema = z.object({
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

    role: z
        .string()
        .min(1, { message: "The Role field is required" })
        .refine((val) => ["supervisor", "student"].includes(val), {
            message: "Invalid Role selection",
        }),

    department: z
        .string()
        .min(2, { message: "Department must be at least 3 characters long" })
        .max(10, { message: "Department must not exceed 50 characters" }),

    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
        }),
});

const signupStudentSchema = (department = null, batch = null) => {
    const rollNoRegex = new RegExp(`^${batch ?? "21"}${department ?? "SW"}[0-9]{3}$`);

    // const pidRegex = new RegExp(`^${departmentPrefix}-\\d{3}$`);
    return z.object({
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
            .regex(rollNoRegex, { message: `Invalid Roll No. format (e.g., ${batch ?? 21}${department ?? "SW"}066)` }),

        department: z
            .string()
            .min(2, { message: "Department must be at least 3 characters long" })
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

        role: z
            .string()
            .min(1, { message: "The Role field is required" })
            .refine((val) => ["supervisor", "student"].includes(val), {
                message: "Invalid Role selection",
            }),

        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" })
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
                message: "Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character",
            }),
    });
};

const requestResetPasswordSchema = z.object({
    email: z
        .string()
        .min(1, { message: "The Email field is required" })
        .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
            message: "Invalid email format. Please enter a valid email address.",
        }),
});

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
                "Password must include uppercase, lowercase, number, and special character"
            ),
        confirmationPassword: z.string(),
    })
    .refine(({ password, confirmationPassword }) => password == confirmationPassword, {
        message: "Passwords do not match",
        path: ["confirmationPassword"],
    });

export { signinSchema, signupSupervisorSchema, signupStudentSchema, requestResetPasswordSchema, resetPasswordSchema };