import { FaChalkboardTeacher, FaFileSignature, FaHistory, FaProjectDiagram, FaTachometerAlt, FaUserEdit, FaUserShield } from "react-icons/fa";

const admin = [
    {
        icon: FaTachometerAlt,
        label: "Dashboard",
        href: "/",
        hasDropdown: false
    },
    {
        icon: FaUserShield,
        label: "Manage Accounts",
        href: "/accounts",

        hasDropdown: true,
        children: [
            { label: "Admins", href: "/admins" },
            { label: "Supervisors", href: "/supervisors" },
            { label: "Students", href: "/students" },
            { label: "Pending", href: "/pending" },
            { label: "Rejected", href: "/rejected" },
        ],
    },
    {
        icon: FaFileSignature,
        label: "Manage Proposals",
        href: "/proposals",

        hasDropdown: true,
        children: [
            { label: "All", href: "" },
            { label: "Accepted", href: "/accepted" },
            { label: "Cond. Accepted", href: "/conditionally-accepted" },
            { label: "Pending", href: "/pending" },
            { label: "Rejected", href: "/rejected" },
        ],
    },
    {
        icon: FaProjectDiagram,
        label: "Manage Projects",
        href: "/projects",

        hasDropdown: true,
        children: [
            { label: "All", href: "" },
            { label: "Initialized", href: "/initialized" },
            { label: "Under Dev.", href: "/under-development" },
            { label: "Completed", href: "/completed" },
        ],
    },
    {
        icon: FaChalkboardTeacher,
        label: "Manage Presentations",
        href: "/presentations",

        hasDropdown: true,
        children: [
            { label: "All", href: "" },
            { label: "Reviewing", href: "/pending-review" },
            { label: "Approved", href: "/approved" },
            { label: "Rejected", href: "/rejected" },
        ],
    },
    {
        icon: FaHistory,
        label: "Past FYPs",
        href: "/previous-projects",
        hasDropdown: false
    },
    {
        icon: FaUserEdit,
        label: "Profile Settings",
        href: "/profile",
        hasDropdown: false
    },
];

export default admin;
