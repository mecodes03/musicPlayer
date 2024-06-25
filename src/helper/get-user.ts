import {
  SPOTIFY_GET_USER_INFO_URL,
  YOUTUBE_GET_USER_INFO_URL,
} from "@/constants";

import { SpotifyUser, GoogleUser } from "@/types/user";

// these functions doesn't throw
export async function getSpotifyAccount(
  access_token: string
): Promise<{ user: SpotifyUser | null }> {
  const userRes = await fetch(SPOTIFY_GET_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!userRes.ok) return { user: null };
  const user = (await userRes.json()) as SpotifyUser;
  return { user: user };
}

export async function getGoogleAccount(
  access_token: string
): Promise<{ user: GoogleUser | null }> {
  const userRes = await fetch(YOUTUBE_GET_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!userRes.ok) return { user: null };
  const user = (await userRes.json()) as GoogleUser;
  return { user: user };
}
