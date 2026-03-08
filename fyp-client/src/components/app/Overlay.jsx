import clsx from "clsx";
import { FaTimes } from "react-icons/fa";
import { useEffect, useState } from "react";

export let closeModal = null;

const Overlay = ({
  children,
  title,
  width = "max-w-2xl",
  onClose,
  zIndex = "z-30",
  dismisible = true,
  hasHeader = true,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setVisible(false);
      setTimeout(() => onClose(false), 200);
    }
  };

  return (
    <div
      onClick={dismisible ? closeModal : undefined}
      className={clsx(
        "fixed inset-0 flex items-center justify-center px-4 py-6 transition-opacity duration-200",
        zIndex,
        visible ? "opacity-100" : "opacity-0",
        "bg-[rgba(250,250,250,0.75)] dark:bg-[rgba(34,34,34,0.7)]"
      )}
    >
      <div
        className={clsx(
          "w-full text-sm",
          width,
          "bg-primary rounded-lg border border-primary shadow-xl transition-all duration-300",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
          "max-h-[90vh] flex flex-col"
        )}
      >
        {hasHeader && (
          <div className="relative px-6 py-3 border-b border-primary flex items-center justify-center">
            <h3 className=" text-base sm:text-lg font-semibold text-primary m-0">{title}</h3>
            {onClose && (
              <button
                onClick={() => {
                  setVisible(false);
                  setTimeout(() => onClose(false), 200);
                }}
                title="Close"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-secondary"
              >
                {/* <FaTimes size={18} className="text-gray-500 group-hover:text-red-500" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:text-red-500 !transition-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Scrollable Content */}
        <div className="px-6 py-5 overflow-y-auto" style={{ flex: 1 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Overlay;
