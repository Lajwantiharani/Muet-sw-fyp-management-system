import React, { Fragment, useState } from 'react'
import { Button, ConfirmtionModal, MeetingButton, MeetingScreen, Overlay } from '@components'
import { capEach, capitalize, dateSatus, firstLetter, formatDateTime, formatFilePath, formatHref, getCategoryLabel, splitCamelCase } from '@utils'
import { FaRegClock, FaTrash, } from 'react-icons/fa';
import { deleteMeeting, } from '@features';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import _ from 'lodash';
import { departments } from '@data';

const ViewMeetingDetails = ({ meeting, closeForm }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const [confirming, setConfirming] = useState(false);
    const [startOrJoinMeeting, setStartOrJoinMeeting] = useState(false);

    const handleDelete = async () => {
        const result = await dispatch(deleteMeeting(meeting._id))
        if (deleteMeeting.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const isMeetingEndedOrExpired = (meeting) => {
        const now = new Date();
        const endsAt = meeting?.endsAt ? new Date(meeting.endsAt) : null;
        return meeting?.status == "ended" || (endsAt && endsAt < now);
    };

    const PersonCard = (person, label, hasRoleNo = true) => (
        <div className="bg-primary border border-primary rounded-lg p-4 flex gap-4 items-center w-full relative shadow-sm">
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

    const FieldBlock = ({ label, value, clickable }) => {
        const [href, hrefText] = formatHref(value);

        return (
            <div className="flex flex-col gap-1">
                <span className="text-sm text-secondary font-medium">{label}</span>
                <p className="text-sm text-primary whitespace-pre-line text-ellipsis overflow-hidden">
                    {!clickable && (value || "-")}
                    {clickable && value && (
                        <Button href={href} target="_blank" rel="noopener noreferrer" >
                            {hrefText} {label == "Scheduled At" && (
                                <span className="bg-red-100">{dateSatus(meeting.schedule)}</span>
                            )}
                        </Button>
                    )}
                </p>
            </div>
        );
    };

    return (
        <Fragment>
            {confirming === "postpond" && (
                <ConfirmtionModal
                    modalTitle={`${isMeetingEndedOrExpired(meeting) ? "Delete" : "Postpond"} Meeting`}
                    prompt={`Are you sure you want to ${isMeetingEndedOrExpired(meeting) ? "Delete" : "Postpond"} this meeting?`}
                    promptText="This action cannot be undone. Please confirm to proceed."
                    icon={!isMeetingEndedOrExpired(meeting) ? <FaRegClock /> : <FaTrash />}
                    buttonColor="button-danger"
                    confirmBtnText={isMeetingEndedOrExpired(meeting) ? "Delete" : "Postpond"}
                    model="meetings"
                    onConfirm={handleDelete}
                    onClose={setConfirming}
                />
            )}

            {startOrJoinMeeting && (
                <MeetingScreen meeting={meeting} closeForm={() => setStartOrJoinMeeting(false)} />
            )}

            <Overlay
                onClose={() => closeForm(true)}
                title="Meeting Details"
                width="w-[90%] sm:w-[80%] lg:w-[70%]"
            >

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 bg-primary border border-primary p-5 rounded-lg shadow-sm">
                        <FieldBlock label="Meeting Topic" value={capitalize(meeting?.title ?? "-")} />
                        <FieldBlock label="Meeting Agenda" value={meeting.summary} />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <FieldBlock label="Refernce Material Link" value={meeting?.reference ?? "-"} clickable={meeting?.reference} />
                            <FieldBlock label="Meeting Current Status" value={capitalize(meeting?.status)} />
                            <FieldBlock label="Meeting ID" value={meeting?.meetingId} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <FieldBlock label="Meeting Total Duration" value={String(meeting?.duration).padStart(2, '0') + " minutes"} />
                            <FieldBlock label="Scheduled At" value={formatDateTime(meeting?.schedule, true)} />
                            <FieldBlock label={user?.role == meeting.scheduledBy ? "Start link available until" : "Join link available until"} value={formatDateTime(meeting?.endsAt)} />
                        </div>
                    </div>
                    <MeetingButton meeting={meeting} user={user} onClick={() => setStartOrJoinMeeting(true)} />

                    {user?.role != "student" && (
                        <div className="flex flex-col gap-3 bg-primary border border-primary p-5 rounded-lg shadow-sm">
                            <p className="text-lg text-theme font-semibold">{capEach(meeting?.project?.title ?? "-")}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <FieldBlock label="Department" value={departments?.find(d => d.abbreviation == meeting?.project?.department)?.name ?? "-"} />
                                <FieldBlock label="Batch" value={meeting?.project?.batch ?? "-"} />
                                <FieldBlock label="Shift" value={capitalize(meeting?.project?.shift ?? "-")} />
                                <FieldBlock label="Status" value={splitCamelCase(meeting?.project?.status ?? "-")} />
                                <FieldBlock label="Category" value={getCategoryLabel(meeting?.project?.category ?? "-")} />
                                <FieldBlock label="Type" value={splitCamelCase(meeting?.project?.type ?? "-")} />
                            </div>
                        </div>
                    )}

                    {user?.role == "supervisor" && (() => {
                        let persons = [
                            { user: meeting?.project?.lead, label: 'Project Lead' },
                            meeting?.project?.memberOne && { user: meeting?.project?.memberOne, label: 'Team Member' },
                            meeting?.project?.memberTwo && { user: meeting?.project?.memberTwo, label: 'Team Member' },
                        ].filter(Boolean);

                        return (
                            <div
                                className={clsx(
                                    "grid gap-4",
                                    persons.length === 1 && "grid-cols-1",
                                    persons.length === 2 && "grid-cols-1 sm:grid-cols-2",
                                    persons.length === 3 && "grid-cols-1 sm:grid-cols-2",
                                )}
                            >
                                {persons.map(({ user, label, hasRoleNo = true }, index) => (
                                    <div key={label + index} className={clsx("w-full", { "sm:col-span-2": persons.length == 3 && index == 2 })}>
                                        {PersonCard(user, label, hasRoleNo)}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    {user?.role != "supervisor" && (
                        <div className="flex flex-col gap-3 bg-primary border border-primary p-5 rounded-lg shadow-sm">
                            <p className="text-lg text-theme font-semibold">Scheduled by Project Supervisor</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <FieldBlock label="Supervisor Name" value={capEach(meeting?.project?.supervisor?.name)} />
                                <FieldBlock label="Supervisor Email" clickable value={meeting?.project?.supervisor?.email} />
                                <FieldBlock label="Supervisor Phone" clickable value={meeting?.project?.supervisor?.phone ? `+92${meeting.project.supervisor.phone}` : "-"} />
                            </div>
                        </div>
                    )}

                    {user?.role == "supervisor" && (
                        <div className="flex flex-wrap justify-end gap-3 ">
                            <Button className="button-danger text-sm" onClick={() => setConfirming("postpond")}>
                                {!isMeetingEndedOrExpired(meeting) ? (<> <FaRegClock /> Postpone </>) : (<><FaTrash />Delete </>)}
                            </Button>
                        </div>
                    )}
                </div>
            </Overlay >
        </Fragment>
    );
};

export default ViewMeetingDetails;
