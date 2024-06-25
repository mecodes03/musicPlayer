"use client";

import { useActiveRoutePath } from "@/hooks/useActivePath";
import { cn } from "@/lib/utils";
import { Home, ListMusic, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const SideBarButtons = () => {
  const isPathActive = useActiveRoutePath();

  return (
    <div className="flex flex-col items-center h-full w-full">
      <Link
        href={"/home"}
        className={cn(
          "flex active:bg-white flex-col items-center hover:bg-neutral-700 w-14 py-4 rounded-lg",
          { "bg-neutral-800 hover:bg-neutral-800": isPathActive("/home") }
        )}
      >
        <Home className="h-5 w-5 text-neutral-300" />
        <span className="text-[0.70rem] mt-1 text-white tracking-wide font-normal">
          Home
        </span>
      </Link>
      <Link
        href="/explore"
        className={cn(
          "flex active:bg-white flex-col items-center hover:bg-neutral-700 w-14 py-4 rounded-lg",
          {
            "bg-neutral-800 hover:bg-neutral-800": isPathActive("/explore"),
          }
        )}
      >
        <Zap className="h-5 w-5 text-neutral-300" />
        <span className="text-[0.70rem] mt-1 text-white tracking-[0.06rem] font-normal">
          Explore
        </span>
      </Link>
      <Link
        href="/playlists"
        className={cn(
          "flex active:bg-white flex-col items-center hover:bg-neutral-700 w-14 py-4 rounded-lg",
          {
            "bg-neutral-800 hover:bg-neutral-800":
              isPathActive("/playlists/*") || isPathActive("/playlists"),
          }
        )}
      >
        <ListMusic className="h-5 w-5 text-neutral-300" />
        <span className="text-[0.70rem] mt-1 text-white tracking-wide font-normal">
          Library
        </span>
      </Link>
    </div>
  );
};

export default SideBarButtons;
