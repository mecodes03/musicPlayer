import React, { ReactNode } from "react";

const PlaylistsGrid = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full grid sm: grid-cols-[repeat(auto-fill,minmax(120px,1fr))] justify-items-center lg:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-y-7 gap-x-5 sm:gap-x-5 sm:gap-y-10 md:gap-x-10 md:gap-y-20">
      {children}
    </div>
  );
};

export default PlaylistsGrid;
