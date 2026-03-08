import { DashboardContent, DataTable, ViewProposalDetails } from '@components'
import { retrieveProposals } from '@features'
import { capitalize, splitCamelCase } from '@utils';
import { useMemo, useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'

const ManageProposals = ({ status }) => {
    const { proposals, pagination } = useSelector((state) => state.proposals);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => ({ status }), [status]);

    const handleViewDetails = (id) => {
        setViewDetails(proposals.find(proposal => proposal._id == id));
    }

    return (
        <DashboardContent title={capitalize(`${splitCamelCase(status)} Proposals`)} description='View and manage proposal ideas'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">Manage {status != "all" && splitCamelCase(status)} Proposals</h4>
            </div>

            {viewDetails && (
                <ViewProposalDetails proposal={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                onChange={retrieveProposals}
                retrieve={retrieve}
                recordList={proposals}
                paginationData={pagination}
                recordFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                    ...(status == "all" ? { status: "Status" } : {})
                }}
                actions={[
                    { label: "Details", icon: <FaInfoCircle />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                    ...(status == "all" ? { status: "Status" } : {})
                }}
                empty={`No ${splitCamelCase(status).toLowerCase()} proposals found.`}
            />
        </DashboardContent >
    )
}

export default ManageProposals