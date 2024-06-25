import { SPOTIFY_ACCESS_TOKEN_COOKIE_KEY } from "@/constants";
import { getSpotifyAccessToken } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { spotifyPlaylistUrl, spotifyPlaylistsUrl } from "@/lib/url-utils";
import { Song } from "@/types/song";
import {
  SpotifyPlaylistSong,
  TSpotifyPlaylist,
  TSpotifyPlaylists,
} from "@/types/spotify";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

export async function getCurrentUserSpotifyPlaylists() {
  const access_token = getSpotifyAccessToken();

  if (!access_token) {
    return {
      success: false,
      error: "no_access_token_provided",
    };
  }

  const url = spotifyPlaylistsUrl();

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    // console.log(res.status);
  }

  const data = (await res.json()) as TSpotifyPlaylists;
  return { success: true, data };
}

type SpotifyPlaylistReturnType =
  | {
      success: false;
      error: string;
    }
  | { success: true; data: Data };

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

type Data = {
  description: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  href: string;
  owner: { href: string; display_name: string };
  tracks: {
    next: string;
    total: number;
    items: SpotifySong[];
  };
};

export async function getSpotifyPlaylist({
  id,
}: {
  id: string;
}): Promise<SpotifyPlaylistReturnType> {
  const access_token = cookies().get(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!access_token) {
    return {
      success: false,
      error: "no_access_token_provided",
    };
  }

  const url = spotifyPlaylistUrl(id);

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!res.ok) {
      return {
        success: false,
        error: await res.json(),
      };
    }

    const data = (await res.json()) as TSpotifyPlaylist;

    const promises: Promise<SpotifySong>[] = [];

    data.tracks.items.forEach((track) => {
      const promise = db.query.spotifyToYoutube
        .findFirst({
          where: (table) => eq(table.spotifySongId, track.track.id),
          with: { youtubeSong: {} },
        })
        .then((res) => ({
          youtubeSong: (res && res.youtubeSong.song) ?? null,
          ...track,
        }));
      promises.push(promise);
    });

    const pro = await Promise.all(promises);
    console.log(pro);
    return {
      success: true,
      data: {
        ...data,
        tracks: {
          ...data.tracks,
          items: pro,
        },
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}
