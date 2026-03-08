import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Button, Overlay, Select, TextArea, Input } from "@components";
import { proposalEvaluationSchema, RejectStatusHandleSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { retrieveProjects, retrieveUsers } from "@features";

const EvaluateProposal = ({ proposal, closeForm, handleEvaluation }) => {
    const dispatch = useDispatch();
    const { users } = useSelector((state) => state.users);
    const { projects } = useSelector((state) => state.projects);
    const { loading } = useSelector((state) => state.proposals);
    const supervisors = users.filter(s => s?.department == proposal?.department);
    const [status, setStatus] = useState();
    const [newPID, setNeePID] = useState('');

    useEffect(() => {
        dispatch(retrieveUsers({ role: "supervisor" }));
        dispatch(retrieveProjects({
            page: { current: 1, size: 100, query: { department: proposal?.department }, sort: { createdAt: -1 } }, status: "all"
        }));
    }, [dispatch, proposal?.department])

    useEffect(() => {
        setNeePID(`${proposal?.department}-${String(Math.max(
            0, ...projects?.map(p => Number(String(p?.pid).replace(/^[a-zA-Z]{2}-/, ''))).filter(n => !isNaN(n)) || []
        ) + 1).padStart(3, '0')}`);
    }, [projects, proposal?.department])

    return (
        <Overlay
            title="Evaluate Proposal"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
            zIndex="z-50"
            onClose={() => closeForm(true)}
        >
            <div className="flex">
                <Form onSubmit={handleEvaluation} resolver={zodResolver((!status || status == "20003") ? RejectStatusHandleSchema : proposalEvaluationSchema(proposal?.department ?? "XX"))}>
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4 w-full">
                        <div className="flex flex-col">
                            <Select
                                name="statusCode"
                                label="Decision"
                                placeholder="Please choose a decision"
                                onChange={({ target }) => setStatus(target.value)}
                                options={[
                                    { value: "20001", label: "Accept" },
                                    { value: "20002", label: "Accept with conditions" },
                                    { value: "20003", label: "Reject" },
                                ]}
                            />
                        </div>
                    </div>

                    {status && status !== "20003" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:gap-4">
                            <Select
                                name="supervisor"
                                label="Assign to the Supervisor"
                                placeholder="Please choose a supervisor"
                                options={supervisors.map((supervisor) => ({
                                    value: supervisor._id,
                                    label: supervisor.name,
                                }))}
                            />

                            <Input
                                name="pid"
                                value={newPID}
                                label="Create Project ID"
                                placeholder={`Create Project ID  e.g., ${proposal?.department ?? "SW"}-001`}
                                onChange={({ target }) => setNeePID(target.value)}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                        <TextArea
                            name="remarks"
                            label="Remarks"
                            placeholder="Remarks must be between (5-350 words)"
                            rows={10}
                        />
                    </div>

                    <Button type="submit" isLoading={loading} className="w-full text-sm">Proceed</Button>
                </Form>
            </div>
        </Overlay>
    )
};

export default EvaluateProposal;
