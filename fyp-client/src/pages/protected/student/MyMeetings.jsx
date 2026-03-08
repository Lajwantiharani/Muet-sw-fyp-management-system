import { DashboardContent, DataTable, ViewMeetingDetails } from '@components'
import { projectSpecificMeetings } from '@features'
import { useMemo, useState } from 'react'
import { FaEye } from 'react-icons/fa'
import { useSelector } from 'react-redux'

const MyMeetings = () => {
    const { meetings, pagination } = useSelector((state) => state.meetings);
    const { user } = useSelector((state) => state.auth);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ studentId: user._id }), [user._id]);

    const handleViewMeetings = (id) => {
        setViewDetails(meetings.find(meeting => meeting._id == id));
    }

    return (
        <DashboardContent title='My Meetings' description='View and manage your project meetings'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">Project Meetings</h4>
            </div>

            {viewDetails && (
                <ViewMeetingDetails meeting={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                empty="There are currently no meetings associated with your project."
                onChange={projectSpecificMeetings}
                retrieve={retrieve}
                recordList={meetings}
                paginationData={pagination}
                recordFields={{
                    title: "Topic",
                    summary: "Agenda",
                    reference: "Reference Material",
                    schedule: "Scheduled At",
                }}
                hrefs={["link", "reference"]}
                actions={[
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewMeetings },
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

export default MyMeetings
