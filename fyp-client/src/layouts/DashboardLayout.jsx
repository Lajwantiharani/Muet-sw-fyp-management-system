import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { DashboardHeader, DashboardSidebar, NotificationListener, SocketHandler } from "@components";
import { useDispatch } from "react-redux";
import { retrieveNotifications } from "@features";

const DashboardLayout = ({ hidesidebar }) => {
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(()=>{
      dispatch(retrieveNotifications());
  },[dispatch]);

  return (
    <div className="flex h-screen relative" key={location.pathname}>
      <SocketHandler />
      <NotificationListener />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {!hidesidebar && (
        <DashboardSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <DashboardHeader toggleSidebar={toggleSidebar} />
        <main className="  flex-1 overflow-y-auto overflow-x-hidden ">

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
