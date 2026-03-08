import { DashboardContent, DataTable, ViewPresentationDetails, ViewProposalDetails } from '@components'
import { retrievePresentations } from '@features'
import { capitalize, splitCamelCase } from '@utils';
import { useMemo, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { useSelector } from 'react-redux'

const ManagePresentations = ({ status }) => {
    const { presentations, pagination } = useSelector((state) => state.presentations);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ status }), [status]);

    const handleViewDetails = (id) => {
        setViewDetails(presentations.find(presentation => presentation._id == id));
    }

    return (
        <DashboardContent title={capitalize(`${splitCamelCase(status)} Presentations`)} description='View and manage presenations'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">
                    Manage {status != "all" && splitCamelCase(status)} Presentations
                </h4>
            </div>

            {viewDetails && (
                <ViewPresentationDetails presentation={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                onChange={retrievePresentations}
                retrieve={retrieve}
                recordList={presentations}
                paginationData={pagination}
                recordFields={{
                    "project.title": "Project",
                    summary: "Summary",
                    fyp: "Phase",
                    ...(status == "all" ? { status: "Status" } : {})
                }}
                actions={[
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    summary: "Summary",
                    remarks: "Remarks",
                    fyp: "Phase",
                    ...(status == "all" ? { status: "Status" } : {})
                }}
                empty={`No ${splitCamelCase(status).toLowerCase()} presentations found.`}
            />
        </DashboardContent >
    )
}

export default ManagePresentations