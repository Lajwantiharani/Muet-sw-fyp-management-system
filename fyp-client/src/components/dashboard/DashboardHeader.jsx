import { Button, NotificationPanel, ThemeSwitcher } from "@components";
import { useSelector } from "react-redux";
import { FaBars, FaUser, FaSignOutAlt, FaBell } from "react-icons/fa";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import { capEach, capitalize, firstLetter, formatFilePath } from "@utils";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";

const DashboardHeader = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { title } = useSelector((state) => state.ui);
  const { unreadCount } = useSelector((state) => state.notifications);

  return (
    <header className="bg-primary border-b border-primary shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-2 ">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-primary md:hidden"
          >
            <FaBars className="h-7 w-7" />
          </button>
          <p className="pl-3">{title}</p>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeSwitcher />

          <Popover className="relative">
            <PopoverButton className="flex items-center space-x-2">
              <FaBell className="h-6 w-6 text-primary" />
              {unreadCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </div>
              )}
            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <PopoverPanel className="absolute top-9 right-0 mt-2 z-20">
                <NotificationPanel />
              </PopoverPanel>
            </Transition>
          </Popover>

          <Popover className="relative ">
            <PopoverButton className="flex items-center gap-2 px-2 py-1 hover:bg-secondary rounded-md transition-all focus:outline-[">
              <div className="flex justify-center items-center w-9 h-9 rounded-full overflow-hidden border border-primary text-secondary text-xs shadow-sm">
                {user?.image ? (
                  <img
                    src={formatFilePath(user.image)}
                    alt={user?.name || 'User Avatar'}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <span>
                    {firstLetter(user?.name)}
                  </span>
                )}
              </div>

              <p className="hidden sm:flex flex-col text-sm font-medium text-gray-800 dark:text-gray-200">
                <span>{capEach(user?.name)}</span>
                <span className="text-left text-secondary text-xs">{capitalize(user?.role)}</span>
              </p>

            </PopoverButton>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <PopoverPanel className="absolute right-0 mt-2 w-60 shadow-md bg-primary border border-primary rounded-md z-20 min-w-[200px]">
                <div className="flex justify-center items-center flex-col gap-2 text-xs p-3 border-b border-primary">
                  <div className="flex justify-center items-center self-center w-16 h-16 rounded-full overflow-hidden border border-primary text-secondary text-sm shadow-sm">
                    {user?.image ? (
                      <img
                        src={formatFilePath(user.image)}
                        alt={user?.name || 'User Avatar'}
                        className="w-full h-full object-cover object-center"
                      />
                    ) : (
                      <span>
                        {firstLetter(user?.name)}
                      </span>
                    )}
                  </div>

                  <div className="text-center">
                    <p>{capEach(user?.name)}</p>
                    <p className="text-secondary">{user.email}</p>
                  </div>
                </div>

                <div className="py-2">
                  <Button href="/profile" className="text-sm flex justify-start items-center p-2 ps-5 text-primary hover:bg-primary-hover hover:no-underline">
                    <FaUser className="mr-2" />
                    Profile
                  </Button>

                  <Button href="#" onClick={() => navigate(`/signout/${token}`)} className="text-sm flex justify-start items-center p-2 ps-5 !text-red-500 hover:bg-[#ff000011] hover:no-underline group">
                    <FaSignOutAlt className="mr-2 text-red-500" />
                    Signout
                  </Button>
                </div>
              </PopoverPanel>
            </Transition>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
