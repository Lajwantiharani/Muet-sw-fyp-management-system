import { DataTable, ViewUserDetails } from "@components";
import { Button, CreateUserForm, DashboardContent } from "@components";
import { retrieveUsers } from "@features";
import { capitalize, splitCamelCase } from "@utils";
import { useMemo, useState } from "react";
import { FaEye, FaUserPlus } from "react-icons/fa";
import { useSelector } from "react-redux";

const ManageAccounts = ({ roleOrStatus }) => {
    const { users, pagination, loading } = useSelector((state) => state.users);
    const [viewDetails, setViewDetails] = useState(null);
    const [role, setRole] = useState(null);
    const retrieve = useMemo(() => ({ role: roleOrStatus }), [roleOrStatus]);

    const handleViewDetails = (id) => {
        setViewDetails(users.find(user => user._id == id));
    }

    return (
        <DashboardContent title={capitalize(`${roleOrStatus == "approvalPending" ? "Pending" : roleOrStatus} Accounts`)} description="Manage your accounts here.">
            <div className="flex justify-between items-center gap-5 p-2 mb-2">
                <h4 className="font-black text-theme mb-0">Manage {splitCamelCase(roleOrStatus)} Accounts</h4>

                {!["approvalPending", "rejected"].includes(roleOrStatus) && (
                    <Button type="button" className="text-sm" onClick={() => setRole(roleOrStatus)}>
                        <FaUserPlus /> Create {capitalize(roleOrStatus)} Account
                    </Button>
                )}
            </div>

            {role && <CreateUserForm isLoading={loading} role={role} closeForm={() => setRole(null)} />}
            {viewDetails && <ViewUserDetails user={viewDetails} closeForm={() => setViewDetails(null)} />}

            <DataTable
                onChange={retrieveUsers}
                recordList={users}
                retrieve={retrieve}
                paginationData={pagination}
                empty={`No ${splitCamelCase(roleOrStatus).toLowerCase()} accounts found.`}
                recordFields={{
                    name: "Full Name",
                    email: "Email Address",
                    ...(roleOrStatus == "student" ? { rollNo: "Roll No." } : {}),
                    cnic: "CNIC No.",
                    ...(!["admin", "supervisor", "student"].includes(roleOrStatus) ? { role: "Role" } : {})
                }}
                actions={[{
                    label: "View",
                    icon: <FaEye />,
                    ShowWhen: { status: true },
                    onClick: handleViewDetails
                }]}
                searchableFields={{
                    name: "Name",
                    email: "Email",
                    ...(roleOrStatus == "student" ? { rollNo: "Roll No." } : {}),
                    cnic: "CNIC No.",
                    ...(!["admin", "supervisor", "student"].includes(roleOrStatus) ? { role: "Role" } : {})
                }}
            />
        </DashboardContent>
    );
};

export default ManageAccounts;
