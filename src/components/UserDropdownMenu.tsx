"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { GoogleUser, SpotifyUser } from "@/types/user";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UserDropdownMenu = ({
  user,
}: {
  user: { spotify: SpotifyUser | null; google: GoogleUser | null };
}) => {
  const imageUrl =
    user.spotify?.images[0].url ?? user.google?.picture ?? "/user.svg";
  const altStr =
    user.google?.name.slice(0, 2).toUpperCase() ??
    user.spotify?.display_name.slice(0, 2).toUpperCase() ??
    "UI";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="aspect-square h-7 w-7 cursor-pointer">
          <AvatarImage
            src={imageUrl}
            className={cn({
              "aspect-square h-8": !user.spotify && !user.google,
            })}
          />
          <AvatarFallback>{altStr}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-3">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.spotify || user.google ? (
          <>
            <DropdownMenuItem>
              <Link href={"/profile"}>Profile</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href={"/add-key"}>Add a Key</Link>
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link href="/playlists">Playlists</Link>
            </DropdownMenuItem>

            {!user.spotify && user.google ? (
              <DropdownMenuItem>
                <Link href="/connect">Connect Spotify</Link>
              </DropdownMenuItem>
            ) : null}

            {!user.google && user.spotify ? (
              <DropdownMenuItem>
                <Link href="/connect">Connect Youtube</Link>
              </DropdownMenuItem>
            ) : null}

            <DropdownMenuItem>
              <Link href="/logout">logout</Link>
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdownMenu;
