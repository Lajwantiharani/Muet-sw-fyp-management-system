import React, { Fragment, useState } from 'react'
import { Button, ConfirmtionModal, CreateMeetingForm, Overlay, ReviewPresentation } from '@components'
import { capEach, capitalize, firstLetter, formatDateTime, formatFilePath, getCategoryLabel, splitCamelCase } from '@utils'
import { FaAnchor, FaCheck, FaCheckCircle, FaClock, FaGavel, FaTrashAlt } from 'react-icons/fa';
import { deletePresentation, updatePresentation } from '@features';
import { useDispatch, useSelector } from 'react-redux';
import { departments } from '@data';
import clsx from 'clsx';

const ViewPresentationDetails = ({ presentation, closeForm }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.meetings);
    const [confirming, setConfirming] = useState(false);
    const [createMeeting, setcreateMeeting] = useState(false);

    const handleDelete = async () => {
        const result = await dispatch(deletePresentation(presentation._id))
        if (deletePresentation.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const handleReview = async (data) => {
        const result = await dispatch(updatePresentation({ id: presentation._id, formData: data }));
        if (updatePresentation.fulfilled.match(result)) {
            setConfirming(false); closeForm();
        };
    }

    const FieldBlock = ({ label, value }) => (
        <div className="flex flex-col gap-1">
            <span className="text-sm text-secondary font-medium">{label}</span>
            <p className="text-sm text-primary whitespace-pre-line">{value || "-"}</p>
        </div>
    );

    const PersonCard = (person, label, hasRoleNo = true) => (
        <div className="bg-primary border border-primary rounded-lg p-4 flex gap-4 items-center w-full relative shadow-sm">
            {user?._id == person?._id && (
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
                    modalTitle="Delete Presentation"
                    prompt="Are you sure you want to delete this presentation?"
                    promptText="This action cannot be undone. Please confirm to proceed."
                    icon={<FaTrashAlt />}
                    buttonColor="button-danger"
                    confirmBtnText="Delete"
                    model="presentations"
                    onConfirm={handleDelete}
                    onClose={setConfirming}
                />
            )}

            {confirming === "review" && (
                <ReviewPresentation handleReview={handleReview} closeForm={() => setConfirming(false)} />
            )}

            {createMeeting && (
                <CreateMeetingForm
                    closeForm={() => setcreateMeeting(false)}
                    project={presentation?.project}
                    isLoading={loading}
                    zIndex="z-50"
                />
            )}

            <Overlay
                onClose={() => closeForm(true)}
                title="Presentation Details"
                width="w-[90%] sm:w-[80%] lg:w-[70%]"
            >

                <div className="flex flex-col gap-4">
                    {user?.role != "student" && (
                        <div className="flex flex-col gap-3 bg-primary border border-primary p-5 rounded-lg shadow-sm">
                            <p className="text-lg text-theme font-semibold">{capEach(presentation?.project?.title ?? "-")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <FieldBlock label="Department" value={departments?.find(d => d.abbreviation == presentation?.project?.department)?.name ?? "-"} />
                                <FieldBlock label="Batch" clickable value={presentation?.project?.batch ?? "-"} />
                                <FieldBlock label="Shift" clickable value={capitalize(presentation?.project?.shift ?? "-")} />
                                <FieldBlock label="Status" value={splitCamelCase(presentation?.project?.status ?? "-")} />
                                <FieldBlock label="Category" clickable value={getCategoryLabel(presentation?.project?.category ?? "-")} />
                                <FieldBlock label="Type" clickable value={splitCamelCase(presentation?.project?.type ?? "-")} />
                            </div>
                        </div>
                    )}

                    {(() => {
                        let persons = [
                            ...(user?.role != "student" ? [
                                { user: presentation?.project?.lead, label: 'Project Lead' },
                                presentation?.project?.memberOne && { user: presentation?.project?.memberOne, label: 'Team Member' },
                                presentation?.project?.memberTwo && { user: presentation?.project?.memberTwo, label: 'Team Member' }
                            ] : []),
                            ...(user?.role != "supervisor" ? [
                                presentation?.project?.supervisor && { user: presentation?.project?.supervisor, label: 'Supervisor', hasRoleNo: false }
                            ] : [])
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

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-primary p-5 border border-primary rounded-lg overflow-hidden shadow-sm">
                        <FieldBlock label="Presentation" value={<Button href={formatFilePath(presentation.resource)} target="_blank">{String(presentation?.resource ?? "").endsWith(".pdf") ? "View" : "Download"} File</Button>} />
                        <FieldBlock label="Phase" value={splitCamelCase(presentation.fyp)} />
                        <FieldBlock label="Status" value={splitCamelCase(presentation.status)} />
                        <FieldBlock label="Submitted On" value={formatDateTime(presentation.createdAt)} />
                    </div>

                    {presentation?.remarks && (
                        <div className="bg-primary border border-primary p-5 rounded-lg shadow-sm">
                            <FieldBlock label="Remarks from Supervisor" value={presentation.remarks} />
                        </div>
                    )}

                    <div className="bg-primary border border-primary p-5 rounded-lg shadow-sm">
                        <FieldBlock label="Summary" value={presentation.summary} />
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 ">
                        {presentation?.status == "pending" && user.role == "admin" && (
                            <Button className="text-sm" onClick={() => setConfirming("action")}>
                                <FaAnchor /> Take Action
                            </Button>
                        )}

                        {user.role == "supervisor" && (
                            <Fragment>
                                {presentation?.status == "pendingReview" && (
                                    <Button className="button-success text-sm" onClick={() => setConfirming("review")}>
                                        <FaGavel /> Review
                                    </Button>
                                )}

                                <Button className="button-primary" onClick={() => setcreateMeeting(true)}>
                                    <FaClock /> Schedule Meeting
                                </Button>
                            </Fragment>
                        )}

                        {!["approved"].includes(presentation?.status) && user?.role != "supervisor" && (
                            <Button className="button-danger text-sm" onClick={() => setConfirming("delete")}>
                                <FaTrashAlt /> Delete
                            </Button>
                        )}
                    </div>
                </div>
            </Overlay>
        </Fragment>
    );
};

export default ViewPresentationDetails;
