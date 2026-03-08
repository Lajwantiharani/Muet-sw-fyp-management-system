import { Fragment, useState } from 'react'
import { Button, ConfirmtionModal, CreateMeetingForm, ManageProjectTeam, Overlay } from '@components'
import { capEach, capitalize, firstLetter, formatDateTime, formatFilePath, getCategoryLabel, splitCamelCase } from '@utils'
import { FaAnchor, FaClock, FaTrashAlt, FaUserCog } from 'react-icons/fa';
import { deleteProject, updateProject } from '@features';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import { departments } from '@data';

const ViewProjectDetails = ({ project, closeForm, status }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { loading } = useSelector((state) => state.meetings);
    const [confirming, setConfirming] = useState(false);
    const [createMeeting, setcreateMeeting] = useState(false);

    if (!project?.title) closeForm(true);

    const handleDelete = async () => {
        const result = await dispatch(deleteProject(project._id))
        if (deleteProject.fulfilled.match(result)) {
            setConfirming(false); closeForm();
            return true;
        }
    }

    const handleManageTeam = async (data) => {
        const result = await dispatch(updateProject({ id: project._id, formData: data }));
        if (updateProject.fulfilled.match(result)) {
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
                    modalTitle="Delete Project"
                    prompt="Are you sure you want to delete this project?"
                    promptText="This action cannot be undone. Please confirm to proceed."
                    icon={<FaTrashAlt />}
                    buttonColor="button-danger"
                    confirmBtnText="Delete"
                    model="projects"
                    onConfirm={handleDelete}
                    onClose={setConfirming}
                />
            )}

            {confirming === "action" && (
                <ManageProjectTeam
                    project={project}
                    handleManageTeam={handleManageTeam}
                    closeForm={() => setConfirming(false)}
                />
            )}

            {createMeeting && (
                <CreateMeetingForm
                    closeForm={() => setcreateMeeting(false)}
                    project={project}
                    isLoading={loading}
                    zIndex="z-50"
                />
            )}

            <Overlay
                onClose={() => closeForm(true)}
                title={capitalize(project.title)}
                width="w-[90%] sm:w-[80%] lg:w-[70%]"
            >

                <div className="flex flex-col gap-4">
                    {(() => {
                        let persons = [
                            { user: project.lead, label: 'Project Lead' },
                            project.memberOne && { user: project.memberOne, label: 'Team Member' },
                            project.memberTwo && { user: project.memberTwo, label: 'Team Member' },
                            project.supervisor && { user: project.supervisor, label: 'Supervisor', hasRoleNo: false }
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
                                    <div key={label + index} className={clsx("w-full", { "sm:col-span-2": persons.length == 3 && index == 2 })}>
                                        {PersonCard(user, label, hasRoleNo)}
                                    </div>
                                ))}
                            </div>
                        );
                    })()}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-primary p-5 border border-primary rounded-lg shadow-sm">
                        <FieldBlock label="Department" value={departments?.find(d => d.abbreviation == project.department)?.name ?? "-"} />
                        <FieldBlock label="Batch" value={project.batch ?? "-"} />
                        <FieldBlock label="Shift" value={capitalize(project.shift ?? "-")} />
                        <FieldBlock label="PID" value={project.pid} />
                        <FieldBlock label="Type" value={splitCamelCase(project.type)} />
                        <FieldBlock label="Category" value={getCategoryLabel(project.category)} />
                        <FieldBlock label="Status" value={splitCamelCase(project.status)} />
                        <FieldBlock label="Proposal File" value={
                            <Button target="_blank" href={formatFilePath(project.proposal)}>View File</Button>
                        } />
                        <FieldBlock label="Started On" value={formatDateTime(project.createdAt)} />

                        {status != "past" && (
                            <div className="flex-1 relative shadow-sm mt-4 col-span-3">
                                <div className="w-full h-4 bg-[#2357e42d] rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-theme rounded-full transition-all duration-300 flex items-center justify-center"
                                        style={{ width: `${project.progress}%` }}
                                    >
                                        <span className="text-xs text-white font-semibold ">
                                            <span className={clsx({ "hidden": window.innerWidth < 640 && project.progress <= 25 })}>Progress </span>
                                            {project.progress}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-primary border border-primary p-5 rounded-lg shadow-sm">
                        <FieldBlock label="Abstract" value={project.abstract} />
                    </div>

                    {user.role != "student" && (
                        <div className="flex flex-wrap justify-end gap-3 ">
                            {project?.status != "completed" && user?.role == "admin" && (
                                <Button onClick={() => setConfirming("action")}>
                                    <FaUserCog /> Manage Team
                                </Button>
                            )}

                            {/* {user.role == "admin" && (
                                <Button className="button-danger" onClick={() => setConfirming("delete")}>
                                    <FaTrashAlt /> Delete
                                </Button>
                            )} */}

                            {user.role == "supervisor" && (
                                <Button className="button-primary" onClick={() => setcreateMeeting(true)}>
                                    <FaClock /> Schedule Meeting
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </Overlay>
        </Fragment>
    );
};

export default ViewProjectDetails;
