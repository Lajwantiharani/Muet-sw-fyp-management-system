import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input, Button, Overlay, Select, TextArea } from "@components";
import { createMeetingSchema } from "@schemas";
import { useDispatch, useSelector } from "react-redux";
import { createMeeting, retrieveSupervisorProjects } from "@features";
import { useEffect, useState } from "react";
import clsx from "clsx";

const CreateMeetingForm = ({ closeForm, isLoading, project = null, zIndex = "z-30" }) => {
    const dispatch = useDispatch();
    const authenticatedUser = useSelector((state) => state.auth.user);
    const { projects } = useSelector((state) => state.projects);
    const [schedule, setSchedule] = useState(null);

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const onSubmit = async (data) => {
        const result = await dispatch(createMeeting(data));
        if (createMeeting.fulfilled.match(result)) closeForm(true);
    };

    useEffect(() => {
        if (!project) {
            dispatch(retrieveSupervisorProjects({ page: { size: 1000 }, status: "all", supervisorId: authenticatedUser._id }));
        }
    }, [project, dispatch, authenticatedUser?._id]);

    return (
        <Overlay
            dasboardSpecific
            onClose={() => closeForm(true)}
            title="Create Meeting"
            width="w-[90%] sm:w-[70%] md:w-[50%]"
            zIndex={zIndex}
        >
            <Form onSubmit={onSubmit} resolver={zodResolver(createMeetingSchema)}>
                {!project && (
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                        <Select
                            name="project"
                            label="Concerned Project"
                            placeholder="Select meeting concerned project"
                            options={projects.map((project) => ({
                                value: project._id,
                                label: project.title,
                            }))}
                        />
                    </div>
                )}


                <div className="grid grid-cols-1">
                    {!!project?._id && (
                        <Input
                            type="hidden"
                            name="project"
                            value={project?._id}
                        />
                    )}
                    <Input
                        name="title"
                        label="Meeting Topic"
                        placeholder="Enter the meeting title (e.g., FYP 02 – Progress Monitoring Session)"
                    />
                </div>

                <div className={clsx("grid grid-cols-1 lg:gap-4", { "md:grid-cols-4": schedule, "md:grid-cols-3": !schedule })}>
                    <div className="col-span-2">
                        <Input
                            type="datetime-local"
                            name="schedule"
                            label="Starts at"
                            onChange={({ target }) => setSchedule(target?.value)}
                            placeholder="Select the start date and time for the meeting"
                            min={new Date().toISOString().slice(0, 16)}
                        />
                    </div>
                    {!!schedule && (
                        <Input
                            type="date"
                            name="endsAt"
                            label="Ends at"
                            placeholder="Select the end date for the meeting"
                            min={addDays(schedule, 1).toISOString().split("T")[0]}
                            max={addDays(schedule, 3).toISOString().split("T")[0]}
                        />

                    )}

                    <Input
                        type="number"
                        name="duration"
                        label="Duration"
                        hint="in minutes"
                        placeholder="Meeting duration"
                    />
                </div>
                <Input
                    name="reference"
                    label="Reference Material link"
                    placeholder="Enter a link to reference material"
                    optional
                />
                <div className="grid grid-cols-1 md:grid-cols-1 lg:gap-4">
                    <TextArea
                        name="summary"
                        label="Meeting Agenda"
                        placeholder="Briefly outline the purpose and key discussion points for this meeting"
                        rows={10}
                    />
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full">
                    Create
                </Button>
            </Form>
        </Overlay >
    );
};

export default CreateMeetingForm;
