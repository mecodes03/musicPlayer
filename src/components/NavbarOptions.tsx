"use client";

import React, { Suspense } from "react";
import { buttonVariants } from "./ui/button";
import Link from "next/link";
import AddSpotifyButton from "./AddSpotifyButton";
import { AddYoutubeButton } from "./AddYoutubeButton";
import { UserAvatar } from "./UserAvatar";
import { Credits } from "./Credits";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";

// import { User } from "@/types/user";
// import { getGoogleAccessToken, getSpotifyAccessToken } from "@/lib/auth/utils";
// import { getGoogleAccount, getSpotifyAccount } from "@/helper/get-user";

// const getUser: () => Promise<User> = async () => {
//   let user: User = { google: null, spotify: null };

//   const spotify_access_token = getSpotifyAccessToken();
//   if (spotify_access_token) {
//     user.spotify = (await getSpotifyAccount(spotify_access_token)).user;
//   }

//   const google_access_token = getGoogleAccessToken();
//   console.log(google_access_token);
//   if (google_access_token) {
//     user.google = (await getGoogleAccount(google_access_token)).user;
//   }

//   return user;
// };

const NavbarOptions = () => {
  const result = useUser();

  if (result.status === "pending") {
    return "loading";
  }

  if (result.status === "error" || !result.user) {
    result.status === "error" && toast.error(result.error);
    return (
      <Link
        href={"/connect"}
        className={buttonVariants({
          variant: "default",
          size: "sm",
          className: "text-base",
        })}
      >
        connect
      </Link>
    );
  }

  if (result.user.google || result.user.spotify)
    return (
      <div className="flex items-center gap-2 md:gap-4">
        <div className="hidden sm:flex">
          {!result.user.spotify ? (
            <AddSpotifyButton size={"sm"} variant={"outline"} />
          ) : (
            <Suspense fallback={<>loading...</>}>
              <Credits id={result.user.spotify.id} />
            </Suspense>
          )}
        </div>
        <div className="hidden sm:flex">
          {!result.user.google ? (
            <AddYoutubeButton size={"sm"} variant={"secondary"} />
          ) : null}
        </div>
        <UserAvatar user={result.user} />
      </div>
    );

  return (
    <Link
      href={"/connect"}
      className={buttonVariants({
        variant: "default",
        size: "sm",
        className: "text-base",
      })}
    >
      connect
    </Link>
  );
};

export default NavbarOptions;
