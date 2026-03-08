import React from "react";
import { spinner } from '@assets';

const Spinner = () => {
  return (
    <div className="fixed inset-0 overflow-y-auto bg-black/30 transition-opacity duration-200 z-50 flex items-center justify-center ">
      <div className="text-center">
        <div className="mb-4">
          <img
            src={spinner}
            alt="Loading spinner"
            className="w-16 h-16 animate-spin mx-auto"
          />
        </div>

      </div>
    </div>
  );
};

export default Spinner;
