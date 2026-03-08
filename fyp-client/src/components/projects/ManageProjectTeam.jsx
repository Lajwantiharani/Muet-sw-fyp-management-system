import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Overlay, Select } from "@components";
import { manageTeamSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { retrieveUsers } from "@features";

const ManageProjectTeam = ({ project, handleManageTeam, closeForm }) => {
    const dispatch = useDispatch();
    const { loading } = useSelector((state) => state.projects);
    const { users } = useSelector((state) => state.users);
    const [students, setStudents] = useState([]);
    const supervisors = users.filter(user => user.role == "supervisor");

    const [holders, setHolders] = useState({
        supervisor: project?.supervisor?._id ?? null,
        lead: project?.lead?._id ?? null,
        memberOne: project?.memberOne?._id ?? null,
        memberTwo: project?.memberTwo?._id ?? null
    });

    useEffect(() => {
        dispatch(retrieveUsers({
            page: { current: 1, size: 100, query: { department: project?.department }, sort: { createdAt: -1 } },
            status: "active"
        }));
    }, [dispatch, project?.department]);

    useEffect(() => setStudents(users.filter(user => user.role == "student")), [users]);

    return (
        <Overlay
            title="Manage Project Team"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
            zIndex="z-50"
            onClose={() => closeForm(true)}
        >
            <div className="flex">
                <Form onSubmit={handleManageTeam} resolver={zodResolver(manageTeamSchema)}>
                    <Select
                        name="supervisor"
                        label="Supervisor"
                        placeholder="Select a supervisor"
                        defaultValue={holders.supervisor}
                        onChange={({ target }) => setHolders(pre => ({ ...pre, supervisor: target.value }))}
                        options={supervisors.map(s => ({
                            value: s._id,
                            label: s.name,
                        }))}
                    />

                    <Select
                        name="lead"
                        label="Project Lead"
                        placeholder="Select a lead student"
                        defaultValue={holders.lead}
                        onChange={({ target }) => setHolders(pre => ({ ...pre, lead: target.value }))}
                        options={students.map(s => ({
                            value: s._id,
                            label: s.name,
                        })).filter(Boolean)}
                    />

                    <Select
                        name="memberOne"
                        label="Team Member 1"
                        placeholder="Select first team member"
                        defaultValue={
                            [holders.lead, holders.memberTwo].includes(holders.memberOne) ? null : holders.memberOne
                        }
                        onChange={({ target }) => setHolders(pre => ({ ...pre, memberOne: target.value }))}
                        options={students.map(s => ![holders.lead, holders.memberTwo].includes(s?._id) && ({
                            value: s._id,
                            label: s.name,
                        })).filter(Boolean)}
                        removable={holders.memberOne}
                    />

                    <Select
                        name="memberTwo"
                        label="Team Member 2"
                        placeholder="Select second team member"
                        defaultValue={
                            [holders.lead, holders.memberOne].includes(holders.memberTwo) ? null : holders.memberTwo
                        }
                        onChange={({ target }) => setHolders(pre => ({ ...pre, memberTwo: target.value }))}
                        options={students.map(s => ![holders.lead, holders.memberOne].includes(s?._id) && ({
                            value: s._id,
                            label: s.name,
                        })).filter(Boolean)}
                        removable={holders.memberTwo}
                    />

                    <Button type="submit" isLoading={loading} className="w-full mt-3">
                        Save Changes
                    </Button>
                </Form>
            </div>
        </Overlay>
    );
};

export default ManageProjectTeam;
