import { DashboardContent, StatCard } from "@components";
import { capEach, splitCamelCase } from "@utils";
import {
    FaPercent,
    FaUserAlt,
    FaUserCheck,
    FaUserTimes,
    FaUserClock,
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaProjectDiagram,
    FaClipboardCheck,
    FaClipboardList,
    FaChalkboardTeacher,
    FaHistory
} from "react-icons/fa";
import { useSelector } from "react-redux";

const Dashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const { dashboard } = useSelector((state) => state.users);

    return (
        <DashboardContent title="Dashboard" description="Your personal dashboard">
            <h1 className="block text-primary text-base my-8 sm:text-3xl">
                Welcome, {capEach(user.name)}
            </h1>

            {user?.role == "admin" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                    <StatCard label="Total Accounts" count={dashboard?.accounts?.total} icon={FaUserAlt} />
                    <StatCard label="Active Accounts" count={dashboard?.accounts?.active} icon={FaUserCheck} />
                    <StatCard label="Inactive Accounts" count={dashboard?.accounts?.inactive} icon={FaUserTimes} />
                    <StatCard label="Pending Accounts" count={dashboard?.accounts?.pending} icon={FaUserClock} />
                </div>
            )}

            {user?.role == "admin" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                    <StatCard label="Total Proposals" count={dashboard?.proposals?.total} icon={FaFileAlt} />
                    <StatCard label="Accepted Proposals" count={dashboard?.proposals?.accepted} icon={FaCheckCircle} />
                    <StatCard label="Rejected Proposals" count={dashboard?.proposals?.rejected} icon={FaTimesCircle} />
                    <StatCard label="Pending Proposals" count={dashboard?.proposals?.pending} icon={FaClock} />
                </div>
            )}

            {user?.role != "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                    <StatCard label="Total Projects" count={dashboard?.projects?.total} icon={FaProjectDiagram} />
                    <StatCard label="Completed Projects" count={dashboard?.projects?.completed} icon={FaClipboardCheck} />
                    <StatCard label="Initialized Projects" count={dashboard?.projects?.initialized} icon={FaClipboardList} />
                    <StatCard label="Under-dev Projects" count={dashboard?.projects?.underDevelopment} icon={FaChalkboardTeacher} />
                </div>
            )}

            {user?.role == "student" && dashboard?.project?.title && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <StatCard label="Project Title" count={dashboard?.project?.title} icon={FaProjectDiagram} />
                    <StatCard label="Project Progress" count={dashboard?.project?.progress} icon={FaPercent} />
                    <StatCard label="Project Status" count={splitCamelCase(dashboard?.project?.status)} icon={FaClipboardList} />
                </div>
            )}

            {user?.role != "admin" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <StatCard label="Total Meetings" count={dashboard?.meetings?.total} icon={FaClipboardList} />
                    <StatCard label="Scheduled Meetings" count={dashboard?.meetings?.scheduled} icon={FaClock} />
                    <StatCard label="Past Meetings" count={dashboard?.meetings?.past} icon={FaHistory} />
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <StatCard label="Total Presentations" count={dashboard?.presentations?.total} icon={FaClipboardList} />
                <StatCard label="Approved Presentations" count={dashboard?.presentations?.approved} icon={FaCheckCircle} />
                <StatCard label="Reviewing Presentations" count={dashboard?.presentations?.pendingReview} icon={FaClock} />
                <StatCard label="Rejected Presentations" count={dashboard?.presentations?.rejected} icon={FaTimesCircle} />
            </div>
        </DashboardContent>
    );
};

export default Dashboard;
