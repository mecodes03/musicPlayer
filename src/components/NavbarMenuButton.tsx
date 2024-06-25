"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Home, ListMusic, Menu, Plus, X, Zap } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const NavbarMenuButton = () => {
  const { push } = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function navigateTo(path: string) {
    push(path);
    setIsOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={(val) => setIsOpen(val)}>
      <SheetTrigger asChild>
        <Button
          variant={"ghost"}
          className="rounded-full p-2 hover:bg-neutral-700"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6 text-white" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-56 p-0 sm:w-60">
        <SheetHeader className="h-16 pl-4">
          <div className="my-auto flex items-center">
            <Button
              variant={"ghost"}
              className="mr-4 rounded-full bg-transparent p-2 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>
            <Image
              height={20}
              width={80}
              className="aspect-auto h-fit w-20 fill-white"
              src={"/logo.svg"}
              alt="music logo"
            />
          </div>
        </SheetHeader>
        <div className="flex h-full w-full flex-col items-center px-2">
          <div className="w-full">
            <Button
              onClick={() => navigateTo("/home")}
              variant={"ghost"}
              className="flex w-full items-center justify-start gap-x-4 rounded-lg px-4 py-6 active:bg-neutral-400"
            >
              <Home className="h-6 w-6 text-neutral-300" />
              <span className="tracking-wide text-white">Home</span>
            </Button>
            <Button
              onClick={() => navigateTo("/explore")}
              variant={"ghost"}
              className="flex w-full items-center justify-start gap-x-4 rounded-lg px-4 py-6 active:bg-neutral-400"
            >
              <Zap className="h-6 w-6 text-neutral-300" />
              <span className="tracking-wide text-white">Explore</span>
            </Button>
            <Button
              onClick={() => navigateTo("/playlists")}
              variant={"ghost"}
              className="flex w-full items-center justify-start gap-x-4 rounded-lg px-4 py-6 active:bg-neutral-400"
            >
              <ListMusic className="h-6 w-6 text-neutral-300" />
              <span className="tracking-wide text-white">Library</span>
            </Button>
          </div>
          <span aria-disabled className="my-7 h-[1px] w-full bg-neutral-600" />
          <div className="w-full">
            <Button
              className="flex w-full items-center rounded-full py-3"
              variant={"secondary"}
            >
              <Plus />
              <span className="ml-3">Playlist</span>
            </Button>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarMenuButton;
