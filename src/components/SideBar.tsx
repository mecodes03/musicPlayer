import React from "react";
import Scroll from "./Scroll";
import SideBarButtons from "./SideBarButtons";

const SideBar = () => {
  return (
    <>
      <div className="h-16" />
      <div className="relative pt-3 flex flex-col items-center h-full">
        <div className="absolute right-0 top-0 bottom-0">
          <Scroll className="h-full w-[1px]" />
        </div>
        <SideBarButtons />
      </div>
    </>
  );
};

export default SideBar;
