import { FaTachometerAlt, FaRegLightbulb, FaDochub, FaChalkboardTeacher, FaHistory, FaMeetup, FaUserEdit } from "react-icons/fa";

const student = [
    {
        icon: FaTachometerAlt,
        label: "Dashboard",
        href: "/",
        hasDropdown: false
    },
    {
        icon: FaRegLightbulb,
        label: "My Ideas",
        href: "/my-ideas",
        hasDropdown: false
    },
    {
        icon: FaDochub,
        label: "My Project",
        href: "/my-project",
        hasDropdown: false
    },
    {
        icon: FaChalkboardTeacher,
        label: "My Presentations",
        href: "/my-presentations",
        hasDropdown: false
    },
    {
        icon: FaMeetup,
        label: "My Meetings",
        href: "/my-meetings",
        hasDropdown: false
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

export default student;
