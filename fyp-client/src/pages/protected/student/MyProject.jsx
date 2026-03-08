
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiUpload, HiLockClosed } from 'react-icons/hi';
import { Button, DashboardContent, Form, Input } from '@components';
import { uploadProjectFile } from '@features';
import { capEach, firstLetter, formatFilePath, getCategoryLabel, splitCamelCase } from '@utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { uploadProposalFileSchema } from '@schemas';
import clsx from 'clsx';

const MyProject = () => {
    const dispatch = useDispatch();
    const { project, loading } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);
    const [readMore, setReadMore] = useState(false);

    const handleUploadFile = async (data) => {
        await dispatch(uploadProjectFile({ projectId: project._id, formData: data }));
    }

    // useEffect(() => {
    //     if (user._id) dispatch(retrieveSingleProject(user._id));
    // }, [user, dispatch]);

    const PersonCard = (person, label, hasRoleNo = true) => (
        <div className="bg-primary sm:border sm:border-primary sm:rounded-lg sm:p-4 flex gap-3  sm:gap-4 items-center w-full relative sm:shadow-sm">
            {user?._id === person?._id && (
                <span className="absolute top-0 sm:top-2 right-2 bg-primary/10 text-primary text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full border border-primary font-semibold tracking-wide">
                    You
                </span>
            )}

            {person?.image ? (
                <img
                    src={formatFilePath(person.image)}
                    alt={person?.name}
                    className="w-12 sm:w-16 h-12 sm:h-16 object-cover rounded-full border border-primary"
                />
            ) : (
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full flex items-center justify-center bg-secondary border border-primary text-lg font-semibold text-secondary">
                    {firstLetter(person?.name)}
                </div>
            )}

            <div>
                <h3 className="text-base sm:text-lg font-semibold text-primary m-0">{label}</h3>
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
        <DashboardContent title="My Project" description="View and manage your project">
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0 whitespace-nowrap">My Project</h4>
            </div>

            <div className="flex flex-col gap-4">
                <div className="bg-primary border border-primary rounded-lg p-6 text-center shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-theme mb-1">{capEach(project.title)}</h2>
                    <p className="text-xs sm:text-sm text-secondary mb-4 font-bold">PID: {project?.pid}</p>

                    {project.status === 'initialized' ? (
                        <div className="mt-4 relative bg-primary/70 backdrop-blur-md rounded-2xl p-6 text-center">
                            <HiLockClosed className="text-4xl text-secondary mb-2 mx-auto" />
                            <h3 className="text-xl font-bold text-secondary">Project Locked</h3>
                            <p className="text-sm text-secondary mb-4">Please upload your proposal file to unlock project details.</p>

                            <Form className="max-w-md mx-auto" onSubmit={handleUploadFile} encType="multipart/form-data" resolver={zodResolver(uploadProposalFileSchema)}>
                                <Input type="file" name="proposal" accept=".pdf,.doc,.docx" className="input-primary w-full" />
                                <Button type="submit" className="w-full mt-2" isLoading={loading}>
                                    <HiUpload className="text-lg" /> Upload
                                </Button>
                            </Form>
                        </div>
                    ) : (

                        <Fragment>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-2 mt-6 text-sm text-left sm:text-center text-secondary w-full">
                                <span>Status: <span className="text-primary">{splitCamelCase(project.status)}</span></span>
                                <span>Category: <span className="text-primary">{getCategoryLabel(project.category)}</span></span>
                                <span>Type: <span className="text-primary">{splitCamelCase(project.type)}</span></span>
                                <span>Proposal: <Button href={formatFilePath(project?.proposal)} target="_blank" rel="noopener noreferrer" className="text-sm">{String(project?.proposal ?? "").endsWith(".pdf") ? "View" : "Download"} File</Button></span>
                            </div>

                            <div className="flex-1 relative shadow-sm mt-4">
                                <div className="w-full h-5 bg-blue-100/40 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all duration-300 flex items-center justify-center"
                                        style={{ width: `${project.progress}%` }}
                                    >
                                        <span className="text-xs text-white font-semibold ">
                                            <span className={clsx({ "hidden": window.innerWidth < 640 && project.progress <= 25 })}>Progress </span>
                                            {project.progress}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Fragment>
                    )}
                </div>

                {project.status !== 'initialized' && (
                    <div className="bg-primary border border-primary rounded-lg p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-primary mb-4">Project Team</h3>

                        {(() => {
                            let persons = [
                                { user: project.lead, label: 'Project Lead' },
                                project?.memberOne && { user: project.memberOne, label: 'Team Member' },
                                project?.memberTwo && { user: project.memberTwo, label: 'Team Member' },
                                project?.supervisor && { user: project.supervisor, label: 'Supervisor', hasRoleNo: false }
                            ].filter(Boolean);

                            persons = persons.sort((a, b) => {
                                const isAUser = a.user?._id === user._id;
                                const isBUser = b.user?._id === user._id;
                                return isBUser - isAUser;
                            });

                            return (
                                <div className={clsx(
                                    "grid gap-4",
                                    persons.length === 1 && "grid-cols-1",
                                    persons.length === 2 && "grid-cols-1 sm:grid-cols-2",
                                    persons.length === 3 && "grid-cols-1 sm:grid-cols-2",
                                    persons.length === 4 && "grid-cols-1 sm:grid-cols-2"
                                )}>
                                    {persons.map(({ user, label, hasRoleNo = true }, index) => (
                                        <div key={label + index} className={clsx("w-full", persons.length === 3 && index === 2 && "sm:col-span-2")}>
                                            {PersonCard(user, label, hasRoleNo)}
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>
                )}

                {project.status != 'initialized' && project?.abstract && (
                    <div className="bg-primary border border-primary rounded-lg p-6 shadow-sm">
                        <h4 className="text-lg font-semibold text-secondary mb-2">Abstract</h4>
                        <p className="text-sm text-primary whitespace-pre-line">
                            {readMore
                                ? <>
                                    {project.abstract}
                                    <Button href="#" className="!text-sm ml-2" onClick={() => setReadMore(false)}>Hide</Button>
                                </>
                                : <>
                                    {project.abstract.slice(0, 500)}...
                                    <Button href="#" className="!text-sm ml-2" onClick={() => setReadMore(true)}>Read full</Button>
                                </>
                            }
                        </p>
                    </div>
                )}
            </div>
        </DashboardContent>
    );
};

export default MyProject;
