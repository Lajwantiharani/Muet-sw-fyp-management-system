import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Select, Button, AuthContent } from "@components";
import { signupSupervisorSchema, signupStudentSchema } from "@schemas";
import { departments } from "@data";
import { useDispatch, useSelector } from "react-redux";
import { signup } from "@features";
import { Fragment, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { retrieveYearRange } from "@utils";
import clsx from "clsx";

const Signup = () => {
    const dispatch = useDispatch();
    const [form, setForm] = useState({ d: null, b: null });
    const [wasSuccessfull, setWasSuccessful] = useState(false);
    const [role, setRole] = useState("student");
    const { loading } = useSelector((state) => state.auth);

    const handleSignup = async (data) => {
        const result = await dispatch(signup(data));
        if (signup.fulfilled.match(result)) {
            setWasSuccessful(true);
        }
    };

    return (
        <AuthContent
            title="Sign Up | FYP Management System"
            description="Quick registration to streamline your FYP process."
            className="md:w-[50%] my-10"
        >
            {!wasSuccessfull && (
                <Fragment>
                    <div className="flex">
                        <Form onSubmit={handleSignup} resolver={zodResolver(role == "supervisor" ? signupSupervisorSchema : signupStudentSchema(form.d, form.b))} encType="multipart/form-data">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="name" label="Name" id="name" placeholder="Enter your name" />
                                <Input name="email" label="Email" id="email" placeholder="Enter your email" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="cnic" id="cnic" label="CNIC No." placeholder="CNIC No. (without dashes)" />
                                <Input name="phone" label="Phone Number" placeholder="Enter your phone number (10-digits)" optional />
                            </div>

                            <Select
                                name="role"
                                label="Role"
                                placeholder="Please select your role"
                                defaultValue={role}
                                onChange={({ target }) => setRole(target.value)}
                                options={[
                                    { label: "Student", value: "student" },
                                    { label: "Supervisor", value: "supervisor" }
                                ]}
                            />

                            {role == "student" && (
                                <Fragment>
                                    <div className={`grid grid-cols-1 md:grid-cols-${role === "student" ? "2" : "1"} gap-4`}>

                                        <Select
                                            name="department"
                                            label="Department"
                                            onChange={({ target }) => setForm({ ...form, d: target.value })}
                                            placeholder="Please select your department"
                                            options={departments?.map(record => ({ label: record?.name, value: record?.abbreviation }))}
                                        />
                                        <Select
                                            name="batch"
                                            label="Batch"
                                            onChange={({ target }) => setForm({ ...form, b: String(target.value).slice(-2) })}
                                            placeholder="Please select your batch"
                                            options={retrieveYearRange(2000).map(y => ({ label: y, value: String(y) }))}
                                        />
                                    </div>

                                    <div className={clsx("grid grid-cols-1 gap-4", {
                                        "md:grid-cols-2": form.d && form.b
                                    })}>
                                        {form.d && form.b && (
                                            <Input name="rollNo" id="rollNo" label="Roll No." placeholder={`Enter roll no. (e.g., ${form.b ?? 21}${form.d ?? "SW"}066)`} />
                                        )}

                                        <Select
                                            name="shift"
                                            label="Batch Shift"
                                            placeholder="Please select your batch shift"
                                            options={[
                                                { label: "Morning", value: "morning" },
                                                { label: "Evening", value: "evening" }
                                            ]}
                                        />
                                    </div>
                                </Fragment>
                            )}

                            <div className={`grid grid-cols-1 md:grid-cols-${role == "supervisor" ? "2" : "1"} gap-4`}>
                                {role == "supervisor" && (
                                    <Select
                                        name="department"
                                        label="Department"
                                        placeholder="Please select your department"
                                        options={departments?.map(record => ({ label: record?.name, value: record?.abbreviation }))}
                                    />
                                )}

                                <Input type="password" label="Password" name="password" id="password" placeholder="Create strong password" />
                            </div>

                            <Button type="submit" isLoading={loading} className="w-full mt-2">Sign Up</Button>
                        </Form>
                    </div>

                    <div className="mt-4 text-center text-secondary">
                        Got an account? <Button href="/signin" className="text-sm">Sign In</Button>
                    </div>
                </Fragment>
            )}

            {wasSuccessfull && (
                <div className="rounded-lg border border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <FaCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
                        <h2 className="text-green-600 dark:text-green-400 text-lg font-semibold m-0">
                            Confirmation Email Sent!
                        </h2>
                    </div>
                    <p className="text-sm text-secondary mb-4">
                        Your account has been created successfully. Please check your email to confirm your account.
                        If you don't see the confirmation email, be sure to check your spam or junk folder.
                    </p>
                    <Button href="/signin" className="flex items-center justify-center gap-2 w-full mt-2">
                        Sign In
                    </Button>
                </div>
            )}
        </AuthContent>
    );
};

export default Signup;
