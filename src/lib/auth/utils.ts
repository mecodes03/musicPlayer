import { cookies } from "next/headers";
import {
  GOOGLE_ACCESS_TOKEN_COOKIE_KEY,
  GOOGLE_REFRESH_TOKEN_COOKIE_KEY,
  SPOTIFY_ACCESS_TOKEN_COOKIE_KEY,
  SPOTIFY_GET_USER_INFO_URL,
  SPOTIFY_REFRESH_TOKEN_COOKIE_KEY,
  YOUTUBE_GET_USER_INFO_URL,
} from "@/constants";
import { GoogleUser, SpotifyUser } from "@/types/user";
import {
  GoogleAccessTokenExpiredError,
  GoogleError,
  SpotifyAccessTokenExpiredError,
  SpotifyError,
} from "../error";
import { TSpotifyError } from "@/types/error";

export async function getCurrentYoutubeAccount(): Promise<{
  user: GoogleUser | null;
}> {
  const accessToken = getGoogleAccessToken();

  if (!accessToken) {
    if (!getGoogleRefreshToken()) return { user: null };
    throw new GoogleAccessTokenExpiredError();
  }

  const googleRes = await fetch(YOUTUBE_GET_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!googleRes.ok) {
    const res = await googleRes.json();
    throw new GoogleError(res.message);
  }

  const youtubeUser = (await googleRes.json()) as GoogleUser;

  return { user: youtubeUser };
}

export async function getCurrentSpotifyAccount(): Promise<{
  user: SpotifyUser | null;
}> {
  const spotifyAccessToken = cookies().get(
    SPOTIFY_ACCESS_TOKEN_COOKIE_KEY
  )?.value;

  if (!spotifyAccessToken) {
    throw new SpotifyAccessTokenExpiredError();
  }

  const spotifyResponse = await fetch(SPOTIFY_GET_USER_INFO_URL, {
    headers: {
      Authorization: `Bearer ${spotifyAccessToken}`,
    },
  });

  if (!spotifyResponse.ok) {
    const { error } = (await spotifyResponse.json()) as TSpotifyError;
    // console.log(error);
    if (error.status === 401) {
      throw new SpotifyAccessTokenExpiredError();
    }
    throw new SpotifyError(error.message);
  }

  const spotifyUser = (await spotifyResponse.json()) as SpotifyUser;

  return {
    user: spotifyUser,
  };
}

export const getServerSideUser = async () => {
  return {
    urrentSpotifyUser: (await getCurrentSpotifyAccount()).user,
    currentYoutubeUser: (await getCurrentYoutubeAccount()).user,
  };
};

export const isSpotifyAuthenticated = async () => {
  const { user } = await getCurrentSpotifyAccount();
  return Boolean(user);
};

export const isGoogleAuthenticated = async () => {
  const { user } = await getCurrentYoutubeAccount();
  return Boolean(user);
};

export const getSpotifyAccessToken = () => {
  return cookies().get(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY)?.value;
};

export const getGoogleAccessToken = () => {
  return cookies().get(GOOGLE_ACCESS_TOKEN_COOKIE_KEY)?.value;
};

export const getSpotifyRefreshToken = () => {
  return cookies().get(SPOTIFY_REFRESH_TOKEN_COOKIE_KEY)?.value;
};

export const getGoogleRefreshToken = () => {
  return cookies().get(GOOGLE_REFRESH_TOKEN_COOKIE_KEY)?.value;
};
