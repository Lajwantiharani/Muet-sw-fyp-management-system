import React, { Fragment, useState } from 'react'
import { Button, ConfirmtionModal, EvaluateProposal, Overlay } from '@components'
import { capEach, capitalize, firstLetter, formatFilePath, getCategoryLabel, splitCamelCase } from '@utils'
import { FaAnchor, FaClipboardCheck, FaGavel, FaSearch, FaTrashAlt } from 'react-icons/fa';
import { deleteProposal, updateProposal } from '@features';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { departments } from '@data';

const ViewProposalDetails = ({ proposal, closeForm }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [confirming, setConfirming] = useState(false);

    if (!proposal?.title) closeForm(true);

    const handleDelete = async () => {
        const result = await dispatch(deleteProposal(proposal._id))
        if (deleteProposal.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const handleEvaluation = async (data) => {
        const result = await dispatch(updateProposal({ id: proposal._id, formData: data }));
        if (updateProposal.fulfilled.match(result)) {
            setConfirming(false); closeForm();
        };
    }

    const FieldBlock = ({ label, value }) => (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-secondary font-medium">{label}</span>
            <p className="text-sm text-primary whitespace-pre-line">{value || "N/A"}</p>
        </div>
    );

    const PersonCard = (person, label, hasRoleNo = true) => (
        <div className="bg-primary border border-primary rounded-lg p-4 flex gap-4 items-center w-full relative shadow-sm">
            {user?._id === person?._id && (
                <span className="absolute top-2 right-2 bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary font-semibold tracking-wide">
                    You
                </span>
            )}

            {person?.image ? (
                <img
                    src={formatFilePath(person.image)}
                    alt={person?.name}
                    className="w-16 h-16 object-cover rounded-full border border-primary"
                />
            ) : (
                <div className="w-16 h-16 rounded-full flex items-center justify-center bg-secondary border border-primary text-lg font-semibold text-secondary">
                    {firstLetter(person?.name)}
                </div>
            )}

            <div>
                <h3 className="text-lg font-semibold text-primary m-0">{label}</h3>
                <p className="text-sm text-secondary font-medium">
                    Name: <span className="text-primary">{capEach(person?.name)} {hasRoleNo && (<span className="font-extralight">({person?.rollNo})</span>)}</span>
                </p>
                <p className="text-sm text-secondary">
                    Email: <span className="text-primary">{person?.email}</span>
                </p>
            </div>
        </div>
    );

    return (
        <Fragment>
            {confirming === "delete" && (
                <ConfirmtionModal
                    modalTitle="Delete Proposal"
                    prompt="Are you sure you want to delete this proposal?"
                    promptText="This action cannot be undone. Please confirm to proceed."
                    icon={<FaTrashAlt />}
                    buttonColor="button-danger"
                    confirmBtnText="Delete"
                    model="proposals"
                    onConfirm={handleDelete}
                    onClose={setConfirming}
                />
            )}

            {confirming === "action" && (
                <EvaluateProposal proposal={proposal} handleEvaluation={handleEvaluation} closeForm={() => setConfirming(false)} />
            )}

            <Overlay
                onClose={() => closeForm(true)}
                title={capitalize(proposal.title)}
                width="w-[90%] sm:w-[80%] lg:w-[70%]"
            >

                <div className="flex flex-col gap-4">
                    {(() => {
                        let persons = [
                            { user: proposal.lead, label: 'Project Lead' },
                            proposal.memberOne && { user: proposal.memberOne, label: 'Team Member' },
                            proposal.memberTwo && { user: proposal.memberTwo, label: 'Team Member' },
                            proposal?.supervisor && { user: proposal.supervisor, label: 'Supervisor', hasRoleNo: false },
                        ].filter(Boolean);

                        persons = persons.sort((a, b) => {
                            const isAUser = a.user?._id === user._id;
                            const isBUser = b.user?._id === user._id;
                            return isBUser - isAUser;
                        });

                        return (
                            <div
                                className={clsx(
                                    "grid gap-4",
                                    persons.length === 1 && "grid-cols-1",
                                    persons.length === 2 && "grid-cols-1 sm:grid-cols-2",
                                    persons.length === 3 && "grid-cols-1 sm:grid-cols-2",
                                    persons.length >= 4 && "grid-cols-1 sm:grid-cols-2"
                                )}
                            >
                                {persons.map(({ user, label, hasRoleNo = true }, index) => (
                                    <div key={label+index} className={clsx("w-full", { "sm:col-span-2": persons.length == 3 && index == 2 })}>
                                        {PersonCard(user, label, hasRoleNo)}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-primary p-5 border border-primary rounded-lg shadow-sm">
                        <FieldBlock label="Department" value={departments?.find(d => d.abbreviation == proposal?.department)?.name ?? "-"} />
                        <FieldBlock label="Batch" value={proposal?.batch ?? "-"} />
                        <FieldBlock label="Shift" value={capEach(proposal?.shift ?? "-")} />
                        <FieldBlock label="Category" value={getCategoryLabel(proposal.category)} />
                        <FieldBlock label="Type" value={splitCamelCase(proposal.type)} />
                        <FieldBlock label="Status" value={splitCamelCase(proposal.status)} />
                        {/* <FieldBlock label="Accepted On" value={formatDateTime(proposal.createdAt)} /> */}
                    </div>

                    <div className="bg-primary border border-primary p-5 rounded-lg shadow-sm">
                        <FieldBlock label="Abstract" value={proposal.abstract} />
                    </div>

                    {proposal?.remarks && (
                        <div className="bg-primary border border-primary p-5 rounded-lg shadow-sm">
                            <FieldBlock label="Remarks from Admin" value={proposal.remarks} />
                        </div>
                    )}

                    {user.role != "supervisor" && (
                        <div className="flex flex-wrap justify-end gap-3 ">
                            {proposal?.status == "pending" && user.role == "admin" && (
                                <Button onClick={() => setConfirming("action")}>
                                    <FaGavel /> Evaluate
                                </Button>
                            )}

                            {["rejected", "pending"].includes(proposal?.status) && (
                                <Button className="button-danger" onClick={() => setConfirming("delete")}>
                                    <FaTrashAlt /> Delete
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Overlay>
        </Fragment>
    );
};

export default ViewProposalDetails;
