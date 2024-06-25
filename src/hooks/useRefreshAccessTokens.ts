"use client";

import {
  refreshSpotifyAccessToken,
  refreshYoutubeAccessToken,
} from "@/actions/auth.action";
import { Provider } from "@/types/provider";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { differenceInMilliseconds } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";

type TokensResponseType =
  | { success: false; error: string }
  | {
      success: true;
      user: {
        google: {
          // if null user not found and if 0 then accessToken expired
          google_access_token_expires_in: number;
        } | null;
        spotify: {
          spotify_access_token_expires_in: number;
        } | null;
      };
    };

async function handleRefreshing({}: { prvider: Provider }) {
  return;
}

const useRefreshAccessTokens = () => {
  const [googleAccessTokenExpiresIn, setGoogleAccessTokenExpiresIn] = useState<
    number | null | "not_found"
  >(null);
  const [spotifyAccessTokenExpiresIn, setSpotifyAccessTokenExpiresIn] =
    useState<number | null | "not_found">(null);

  const queryClient = new QueryClient();

  useQuery({
    queryKey: ["user_token_state"],
    queryFn: () => {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/current-user`)
        .then((res) => res.json())
        .then((data: TokensResponseType) => {
          if (!data.success) return toast.error(data.error);
          console.log(data);
          if (!data.user.google) {
            setGoogleAccessTokenExpiresIn("not_found");
          } else {
            setGoogleAccessTokenExpiresIn(
              data.user.google.google_access_token_expires_in
            );
          }
          if (!data.user.spotify) {
            setSpotifyAccessTokenExpiresIn("not_found");
          } else {
            if (!data.user.spotify) return;
            setSpotifyAccessTokenExpiresIn(
              data.user.spotify.spotify_access_token_expires_in
            );
          }
        })
        .catch((err) => toast.error(err));
      return null;
    },
  });

  useQuery({
    queryKey: ["google_refresh_token"],
    queryFn: async () => {
      console.log("google_query", googleAccessTokenExpiresIn);
      if (googleAccessTokenExpiresIn === null) return null;
      if (googleAccessTokenExpiresIn === "not_found") {
        console.log("cancel the query");
        queryClient.removeQueries({
          queryKey: ["google_refresh_token"],
          exact: true,
        });
        return null;
      }
      const res = await refreshYoutubeAccessToken();
      console.log(res);
      if (!res.success) {
        console.log("error in google", res.error);
        queryClient.cancelQueries({
          queryKey: ["google_refresh_token"],
          exact: true,
        });
        return null;
      }
      const currentdate = new Date();
      const expiredate = res.accessTokenExpiresAt;
      const ms = differenceInMilliseconds(expiredate, currentdate);
      setGoogleAccessTokenExpiresIn(ms);
      return null;
    },
    refetchInterval:
      typeof googleAccessTokenExpiresIn === "number"
        ? Math.max(100, googleAccessTokenExpiresIn - 60 * 1000)
        : 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    enabled: typeof googleAccessTokenExpiresIn === "number",
  });

  useQuery({
    queryKey: ["spotify_refresh_token"],
    queryFn: async () => {
      const res = await refreshSpotifyAccessToken();
      if (!res.success) {
        console.log("error in spotify:", res.error);
        setSpotifyAccessTokenExpiresIn("not_found");
        return null;
      }
      const currentdate = new Date();
      const expiredate = res.accessTokenExpiresAt;
      const ms = differenceInMilliseconds(expiredate, currentdate);
      console.log(`run again in ${ms} ms`);
      setSpotifyAccessTokenExpiresIn(ms);
      return null;
    },
    retry: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: true,
    enabled: typeof spotifyAccessTokenExpiresIn === "number",
    refetchInterval: () => {
      if (typeof spotifyAccessTokenExpiresIn === "number") {
        return Math.max(1000, spotifyAccessTokenExpiresIn - 60 * 1000);
      } else {
        return false;
      }
    },
  });
};

export default useRefreshAccessTokens;
