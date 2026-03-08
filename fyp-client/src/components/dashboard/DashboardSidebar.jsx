import clsx from "clsx";
import { Navigations } from "./navigations";
import { FaTimes } from "react-icons/fa";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={clsx(
        "z-30 lg:w-[20%] w-[80%] bg-primary border-r border-primary px-4 py-5 absolute inset-y-0 transform md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col",
        { "translate-x-0": isOpen, "-translate-x-full": !isOpen }
      )}
    >
      {/* Header with Collapse Button */}
      <div className="relative flex items-center justify-center mb-4">
        <div>
          <h1 className="text-2xl text-center font-bold transition-all m-0 text-theme">
            Final Year Project
          </h1>
          <p className="text-secondary text-sm text-center">Management System</p>
        </div>

        <button onClick={toggleSidebar} className="md:hidden absolute top-0 right-0">
          <FaTimes className="h-5 w-5" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-b border-primary mb-4" />

      {/* Navigation */}
      <div className="flex-grow overflow-auto">
        <Navigations toggleSidebar={toggleSidebar} />
      </div>
    </div>
  );
};

export default Sidebar;
