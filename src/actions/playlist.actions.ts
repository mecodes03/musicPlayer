"use server";

import { SPOTIFY_ACCESS_TOKEN_COOKIE_KEY } from "@/constants";
import { cookies } from "next/headers";

export async function getMoreSpotifyPlaylistItems({
  nextPageUrl,
}: {
  nextPageUrl: string;
}) {
  const access_token = cookies().get(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY)?.value;
  if (!access_token) {
    return {
      succcess: false,
      error: "no token provided",
    };
  }

  const payload = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const response = await fetch(nextPageUrl, payload);
  if (!response.ok) {
    return {
      success: false,
      error: await response.json(),
    };
  }

  const data = await response.json();
  console.log(data);
  return {
    success: true,
    data,
  };
}

export async function getMoreYoutubePlaylistItems() {}
