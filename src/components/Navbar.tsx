import React from "react";
import Image from "next/image";
import Link from "next/link";
import Scroll from "./Scroll";
import NavbarMenuButton from "./NavbarMenuButton";
import NavbarOptions from "./NavbarOptions";

const Navbar = async () => {
  return (
    <nav className="relative h-full bg-neutral-950 backdrop-blur-xl">
      <div className="absolute bottom-0 left-0 right-0">
        <Scroll className="h-[1px] w-full" />
      </div>
      <div className="flex h-full items-center justify-between px-2 sm:px-4">
        <div className="flex items-center gap-x-2">
          <NavbarMenuButton />

          <Link href={"/"}>
            <Image
              height={20}
              width={80}
              className="aspect-auto h-fit w-20 fill-white"
              src={"/logo.svg"}
              alt="music logo"
            />
          </Link>
        </div>
        <div>
          {/* this component is dynamic and it is making the all pages dynamic so we should make it client component and fetch the data using hooks.  */}
          <NavbarOptions />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
