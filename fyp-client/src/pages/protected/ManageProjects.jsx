import { DashboardContent, DataTable, ViewProjectDetails } from '@components'
import { retrieveProjects, retrieveSupervisorProjects } from '@features'
import { capitalize, splitCamelCase } from '@utils';
import { useMemo, useState } from 'react';
import { FaEye, FaInfoCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux'

const ManageProjects = ({ status }) => {
    const { projects, pagination } = useSelector((state) => state.projects);
    const { user } = useSelector((state) => state.auth);
    const [viewDetails, setViewDetails] = useState(null);
    const retrieve = useMemo(() => {
        if (user.role == "supervisor") {
            return { status, supervisorId: user._id };
        }

        return { status };
    }, [status, user]);

    const handleViewDetails = (id) => {
        setViewDetails(projects.find(project => project._id == id));
    }

    return (
        <DashboardContent title={capitalize(`${splitCamelCase(status)} Projects`)} description='View and manage projects'>
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">
                    {user.role == "supervisor" ? "Manage Supervised Projects" : `Manage ${status != "all" ? splitCamelCase(status) : ''} Projects`}
                </h4>
            </div>

            {viewDetails && (
                <ViewProjectDetails status={status} project={viewDetails} closeForm={() => setViewDetails(null)} />
            )}

            <DataTable
                onChange={user.role == "supervisor" ? retrieveSupervisorProjects : retrieveProjects}
                retrieve={retrieve}
                recordList={projects}
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
                    { label: "Details", icon: <FaEye />, ShowWhen: { status: true }, onClick: handleViewDetails },
                ]}
                searchableFields={{
                    title: "Title",
                    department: "department",
                    batch: "batch",
                    category: "Category",
                    type: "Type",
                    ...(status == "all" ? { status: "Status" } : {})
                }}
                empty={`No ${splitCamelCase(status).toLowerCase()} projects found.`}
            />
        </DashboardContent >
    )
}

export default ManageProjects