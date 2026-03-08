import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Overlay, Select, TextArea } from "@components";
import { createProposalSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { createProposal, retrieveUsers } from "@features";
import { useEffect, useState } from "react";
import { getAllProjectCategories } from "@utils";

const CreateProposalForm = ({ closeForm, isLoading }) => {
    const dispatch = useDispatch();
    const authenticatedUser = useSelector((state) => state.auth.user);
    const { users } = useSelector((state) => state.users);
    const [otherCategory, setOtherCategory] = useState({ cat: null, otherCat: "other" });
    const [memberOne, setMemberOne] = useState(null);
    const [memberTwo, setMemberTwo] = useState(null);

    const students = users.filter(u =>
        u?.role == "student" && u?.batch == authenticatedUser?.batch &&
        u?.department == authenticatedUser?.department && u?.shift == authenticatedUser?.shift
        && u?._id != authenticatedUser?._id
    );
    const filteredStudents = students.filter((student) => student._id !== memberOne);

    const onSubmit = async (data) => {
        data = Object.fromEntries(data.entries());

        if (otherCategory?.cat == "other") {
            data.category = otherCategory.otherCat;
        }

        const result = await dispatch(createProposal(data));
        if (createProposal.fulfilled.match(result)) closeForm(true);
    };

    useEffect(() => {
        dispatch(retrieveUsers({ page: {}, role: "student" }));
    }, [dispatch]);

    return (
        <Overlay
            onClose={() => closeForm(true)}
            title="Have an Idea?"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
        >
            <Form onSubmit={onSubmit} resolver={zodResolver(createProposalSchema)}>
                <Input
                    name="title"
                    label="Idea Title"
                    placeholder="Enter your idea title"
                />

                <div className={memberOne ? "grid grid-cols-1 md:grid-cols-2 md:gap-4" : "grid grid-cols-1"}>
                    <Select
                        name="memberOne"
                        label="Team Member"
                        placeholder="Please choose a team member"
                        onChange={({ target }) => { setMemberOne(target.value); if (target?.value == memberTwo) setMemberTwo(null) }}
                        defaultValue={memberOne}
                        options={students.map((student) => ({
                            value: student._id,
                            label: `${student.name} - (${student.rollNo})`,
                        }))}
                        optional
                    />

                    {memberOne && (
                        <Select
                            name="memberTwo"
                            label="Team Member"
                            placeholder="Please choose a team member"
                            onChange={({ target }) => setMemberTwo(target.value)}
                            defaultValue={memberTwo}
                            options={filteredStudents.map((student) => ({
                                value: student._id,
                                label: `${student.name} - (${student.rollNo})`,
                            }))}
                            optional
                        />
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                    <Select
                        name="category"
                        label="Project Category"
                        placeholder="Please choose a project category"
                        onChange={({ target }) => setOtherCategory({ cat: target.value, otherCat: null })}
                        options={[
                            ...getAllProjectCategories(),
                            { value: "other", label: "Other" },
                        ]}
                    />

                    {otherCategory?.cat == "other" && (
                        <Input
                            name="otherCategory"
                            label="Other Category"
                            placeholder="Enter your project category"
                            onChange={({ target }) => setOtherCategory({ cat: "other", otherCat: target.value })}
                            optional
                        />
                    )}

                    {otherCategory?.cat != "other" && (
                        <Select
                            name="type"
                            label="Type"
                            placeholder="Please Choose a type"
                            options={[
                                { value: "new", label: "New" },
                                { value: "modifiedOrExtension", label: "Modified Or Extension" },
                                { value: "researchBased", label: "Research Based" },
                            ]}
                        />
                    )}

                </div>

                {otherCategory?.cat == "other" && (
                    <Select
                        name="type"
                        label="Type"
                        placeholder="Please Choose a type"
                        options={[
                            { value: "new", label: "New" },
                            { value: "modifiedOrExtension", label: "Modified Or Extension" },
                            { value: "researchBased", label: "Research Based" },
                        ]}
                    />
                )}

                <TextArea
                    name="abstract"
                    label="Abstract"
                    placeholder="Enter your abstract (200-350 words)"
                    rows={10}
                />

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Spark the Idea
                </Button>
            </Form>
        </Overlay>
    );
};

export default CreateProposalForm;
