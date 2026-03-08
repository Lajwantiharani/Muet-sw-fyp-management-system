import { Button, CreateMeetingForm, DashboardContent, DataTable, ViewMeetingDetails, ViewProposalDetails } from '@components'
import { retrieveMeetings } from '@features'
import { capitalize, splitCamelCase } from '@utils';
import { useMemo, useState } from 'react';
import { FaClock, FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux'

const ManageMeetings = ({ status }) => {
    const { meetings, pagination, loading } = useSelector((state) => state.meetings);
    const [schedulingMeeting, setSchedulingMeeting] = useState(false);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ status }), [status]);

    const handleViewDetails = (id) => {
        setViewDetails(meetings.find(meeting => meeting._id == id));
    }

    return (
        <DashboardContent title={capitalize(`${splitCamelCase(status)} Meetings`)} description='View and manage meetings'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">Manage Projects' {capitalize(status)} Meetings</h4>
                <Button type="button" className="text-sm" onClick={() => setSchedulingMeeting(true)}>
                    <FaClock /> Schedule a meeting
                </Button>
            </div>

            {schedulingMeeting && (
                <CreateMeetingForm isLoading={loading} closeForm={() => setSchedulingMeeting(false)} />
            )}

            {viewDetails && (
                <ViewMeetingDetails meeting={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                onChange={retrieveMeetings}
                retrieve={retrieve}
                recordList={meetings}
                paginationData={pagination}
                empty="No meetings found"
                recordFields={{
                    "project.title": "Project",
                    title: "Topic",
                    summary: "Agenda",
                    reference: "Reference Material",
                }}
                hrefs={["link", "reference"]}
                actions={[
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    title: "Topic",
                    summary: "Agenda",
                    reference: "Reference Material",
                }}
            />
        </DashboardContent >
    )
}

export default ManageMeetings