import {
  SPOTIFY_USER_PLAYLISTS_URL,
  YOUTUBE_USER_PLAYLISTS_URL,
} from "@/constants";

import { Provider } from "@/types/provider";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function youtubePlaylistById(id: string, access_token: string) {
  return `${YOUTUBE_USER_PLAYLISTS_URL}?part=snippet&id=${id}&access_token=${access_token}`;
}

export function playlistsUrl(provider: Provider) {
  return provider == Provider["SPOTIFY"]
    ? SPOTIFY_USER_PLAYLISTS_URL
    : `${YOUTUBE_USER_PLAYLISTS_URL}?part=contentDetails&part=snippet&mine=true&key=${process.env.GOOGLE_API_KEY}&maxResults=50`;
}

export function userYoutubePlaylistsUrl(
  maxResult: number,
  accessToken: string,
  pageToken?: string
) {
  return `${YOUTUBE_USER_PLAYLISTS_URL}?part=id&part=snippet&mine=true${
    pageToken ? `&pagetoken=${pageToken}` : ""
  }&maxResults=${maxResult}&key=${
    process.env.GOOGLE_API_KEY
  }&access_token=${accessToken}`;
}

export const getClientSideCookie = (name: string): string | undefined => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return cookieValue;
};

export function parseISODuration(duration: string) {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = duration.match(regex);

  if (!matches) {
    throw new Error("Invalid duration format");
  }

  const hours = matches[1] ? parseInt(matches[1], 10) : 0;
  const minutes = matches[2] ? parseInt(matches[2], 10) : 0;
  const seconds = matches[3] ? parseInt(matches[3], 10) : 0;

  return (
    (hours ? hours.toString().padStart(2, "0") + ":" : "") +
    (minutes ? minutes.toString().padStart(2, "0") + ":" : "00:") +
    (seconds ? seconds.toString().padStart(2, "0") : "00")
  );
}

export function formatNumber(value: string) {
  const _value = Number(value);
  if (_value >= 1e9) {
    return (_value / 1e9).toFixed(1) + "B"; // Billions
  } else if (_value >= 1e6) {
    return (_value / 1e6).toFixed(1) + "M"; // Millions
  } else if (_value >= 1e3) {
    return (_value / 1e3).toFixed(1) + "K"; // Thousands
  } else {
    return _value.toString(); // Less than 1000
  }
}

export function millisecondsToTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Pad minutes and seconds with leading zeros if necessary
  const paddedHours = hours.toString().padStart(2, "0");
  const paddedMinutes = minutes.toString().padStart(2, "0");
  const paddedSeconds = seconds.toString().padStart(2, "0");

  if (hours > 0) {
    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  } else {
    return `${paddedMinutes}:${paddedSeconds}`;
  }
}
