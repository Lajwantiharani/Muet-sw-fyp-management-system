import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Overlay, Select } from "@components";
import { createAdminSchema, createSupervisorSchema, createStudentSchema } from "@schemas";
import { useDispatch } from "react-redux";
import { createUser } from "@features";
import { capitalize, retrieveYearRange } from "@utils";
import { departments } from "@data";
import { Fragment } from "react";


const CreateUserForm = ({ role, closeForm, isLoading }) => {
    const dispatch = useDispatch();

    const onSubmit = async (data) => {
        data.append("role", role);
        const result = await dispatch(createUser(data));
        if (createUser.fulfilled.match(result)) closeForm(true);
    }

    const getRespectiveRoleValidator = () => ({
        admin: createAdminSchema,
        supervisor: createSupervisorSchema,
        student: createStudentSchema,
    }[role]);

    return (
        <Overlay onClose={() => closeForm(true)} title={`Create ${capitalize(role)} Account`} width="w-[90%] sm:w-[70%] md:w-[50%]">
            <div className="flex">
                <Form onSubmit={onSubmit} resolver={zodResolver(getRespectiveRoleValidator())} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4 w-full">
                        <div className="flex flex-col">
                            <Input
                                name="name"
                                label="Full Name"
                                placeholder="Enter your name"
                            />
                        </div>
                        <div className="flex flex-col">
                            <Input
                                name="email"
                                label="Email Address"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4">
                        <div className="flex flex-col">
                            <Input
                                name="cnic"
                                label="CNIC No."
                                placeholder="CNIC No. (without dashes)"
                            />
                        </div>

                        <div className="flex flex-col">
                            <Input
                                name="phone"
                                label="Phone Number"
                                placeholder="Enter your phone number (10-digits)"
                                optional
                            />
                        </div>
                    </div>

                    {role != "admin" && (
                        <div className={`grid grid-cols-1 md:grid-cols-${role == "supervisor" ? "1" : "2"} lg:gap-4`}>
                            <Select
                                name="department"
                                label="Department"
                                placeholder="Please select your department"
                                options={departments?.map(record => ({ label: record?.name, value: record?.abbreviation }))}
                            />

                            {role == "student" && (
                                <Input name="rollNo" id="rollNo" label="Roll No." placeholder="Enter roll no. (e.g., 21SW066)" />
                            )}
                        </div>
                    )}

                    {role == "student" && (
                        <Fragment>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4">
                                <Select
                                    name="batch"
                                    label="Batch"
                                    placeholder="Please select your batch"
                                    options={retrieveYearRange(2000).map(y => ({ label: y, value: String(y) }))}
                                />

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

                    <Button type="submit" isLoading={isLoading} className="w-full mt-3">Create</Button>
                </Form>
            </div>
        </Overlay>
    )
};

export default CreateUserForm;
