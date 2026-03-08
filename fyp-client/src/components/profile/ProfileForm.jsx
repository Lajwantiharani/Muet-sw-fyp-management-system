import { Button, Form, Input, Select } from "@components";
import { departments } from "@data";
import { updateAuthenticatedUser, updateProfile } from "@features";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAdminProfileSchema, updateSupervisorProfileSchema, updateStudentProfileSchema } from "@schemas";
import { capitalize } from "@utils";
import { Fragment, useState } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

const ProfileForm = () => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const profile = useSelector((state) => state.auth?.user);

    const getValidatorSchema = () => {
        switch (profile?.role) {
            case "admin": return updateAdminProfileSchema;
            case "supervisor": return updateSupervisorProfileSchema;
            case "student": return updateStudentProfileSchema;
            default: return updateStudentProfileSchema;
        }
    }

    const onSubmit = async (data) => {
        data = Object.fromEntries(data.entries());
        if (Object.keys(data).some(key => data[key] !== profile[key])) {
            const result = await dispatch(updateProfile(data));
            if (updateProfile.fulfilled.match(result)) {
                dispatch(updateAuthenticatedUser(result.payload.user));
                setIsEditing(false);
            } return;
        }
        setIsEditing(false);
    }

    const renderViewMode = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <label className="text-secondary">Full Name</label>
                    <p className="text-priamrys break-words">{profile?.name}</p>
                </div>
                <div>
                    <label className="text-secondary">Email Address</label>
                    <p className="text-priamrys break-words">{profile?.email}</p>
                </div>
                <div>
                    <label className="text-secondary">CNIC No.</label>
                    <p className="text-priamrys break-words">{profile?.cnic ?? "-"}</p>
                </div>
                <div>
                    <label className="text-secondary">Phone Number</label>
                    <p className="text-priamrys break-words">{profile?.phone ?? "-"}</p>
                </div>
                {profile?.role != "admin" && (
                    <div>
                        <label className="text-secondary">Department</label>
                        <p className="text-priamrys break-words">{departments.find(d => d.abbreviation == profile?.department)?.name ?? "-"}</p>
                    </div>
                )}
                {profile?.role == "student" && (
                    <Fragment>
                        <div>
                            <label className="text-secondary">Roll No.</label>
                            <p className="text-priamrys break-words">{profile?.rollNo ?? "-"}</p>
                        </div>
                        <div>
                            <label className="text-secondary">Batch</label>
                            <p className="text-priamrys break-words">{profile?.batch ?? "-"}</p>
                        </div>
                        <div>
                            <label className="text-secondary">Shift</label>
                            <p className="text-priamrys break-words">{capitalize(profile?.shift ?? "-")}</p>
                        </div>
                    </Fragment>
                )}
            </div>

            <Button type="button" onClick={() => setIsEditing(true)} className="w-full text-sm">
                <FaEdit /> Edit Profile
            </Button>
        </div>
    );

    const renderEditMode = () => (
        <Form onSubmit={onSubmit} resolver={zodResolver(getValidatorSchema())} className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Input
                    name="name"
                    label="Full Name"
                    placeholder="Your full name"
                    defaultValue={profile?.name ?? undefined}
                />
                <Input
                    name="email"
                    label="Email Address"
                    placeholder="Your email address"
                    defaultValue={profile?.email ?? undefined}
                />

                <Input
                    name="cnic"
                    label="CNIC No."
                    defaultValue={profile?.cnic ?? undefined}
                    placeholder="Your cnic no."
                    readonly
                />

                <Input
                    name="phone"
                    label="Phone Number"
                    placeholder="Your phone number"
                    defaultValue={profile?.phone ?? undefined}
                />

                {profile?.role != "admin" && (
                    <Select
                        name="department"
                        label="Department"
                        placeholder="Please select your department"
                        defaultValue={profile?.department ?? null}
                        options={departments?.map(record => ({ label: record?.name, value: record?.abbreviation }))}
                        readonly={profile?.role == "student"}
                    />
                )}

                {profile?.role == "student" && (
                    <Fragment>
                        <Input
                            name="rollNo"
                            label="Roll No."
                            defaultValue={profile?.rollNo ?? undefined}
                            placeholder="Your roll no."
                            readonly
                        />
                        <Input
                            name="batch"
                            label="Batch"
                            defaultValue={profile?.batch ?? undefined}
                            placeholder="Your roll no."
                            readonly
                        />
                        <Select
                            name="shift"
                            label="Batch Shift"
                            placeholder="Please select your batch shift"
                            defaultValue={profile?.shift ?? null}
                            options={[
                                { label: "Morning", value: "morning" },
                                { label: "Evening", value: "evening" }
                            ]}
                        />
                    </Fragment>
                )}
            </div>

            <div className="flex flex-row gap-2">
                <Button type="button" onClick={() => setIsEditing(false)} className="button-secondary flex-1 text-sm">
                    <FaTimes /> Cancel
                </Button>

                <Button type="submit" className="flex-1 text-sm">
                    <FaSave /> Save Changes
                </Button>
            </div>
        </Form>
    );

    return (
        <div className="bg-primary border border-primary rounded-lg p-6 w-full">
            <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
            {isEditing ? renderEditMode() : renderViewMode()}
        </div>
    );
};

export default ProfileForm;
