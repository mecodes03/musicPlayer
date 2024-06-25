"use server";

import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { TYoutubeVideo } from "@/types/youtube";
import { PgRelationalQuery } from "drizzle-orm/pg-core/query-builders/query";
import { youtubeSearchVideoUrl, youtubeVideoUrl } from "@/lib/url-utils";
import { getGoogleAccessToken } from "@/lib/auth/utils";

export const existingSpotifyToYoutube = async ({ ids }: { ids: string[] }) => {
  const promises: PgRelationalQuery<
    | {
        spotifySongId: string;
        youtubeSongId: string;
      }
    | undefined
  >[] = [];

  ids.forEach((id) => {
    const promise = db.query.spotifyToYoutube.findFirst({
      where: (table) => eq(table.spotifySongId, id),
    });
    promises.push(promise);
  });

  const res = (await Promise.all(promises)).filter((res) => res !== undefined);
  console.log(res);
  return res;
};

type SearchVideoResponse = Omit<TYoutubeVideo, "contentDetails" | "statistics">;
type TYoutubeVideoRes = { items: TYoutubeVideo[] };

type ReturnType =
  | {
      success: true;
      song: TYoutubeVideo;
    }
  | {
      success: false;
      error: string;
    };

export const getYoutubeSong: ({
  song,
}: {
  song: { artists: string[]; title: string };
}) => Promise<ReturnType> = async ({ song }) => {
  const _title =
    song.title + " " + song.artists.reduce((acc, crr) => acc + " " + crr);
  console.log(_title);

  const access_token = getGoogleAccessToken();
  if (!access_token) return { success: false, error: "access_token_not_found" };

  const url = youtubeSearchVideoUrl(_title);

  try {
    const res = await fetch(url);
    console.log(res);

    if (!res.ok) {
      const _res = await res.json();
      return {
        success: false,
        error: _res.message as string,
      };
    }

    const data = (await res.json()).items as SearchVideoResponse[];
    console.log(data);

    if (data.length === 0) {
      return {
        success: false,
        error: "could not found the song",
      };
    }

    // @ts-ignore
    const id = data[0].id.videoId! as string;

    const videoUrl = youtubeVideoUrl([id]);
    console.log(videoUrl);

    const payload = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    const videosRes = await fetch(videoUrl, payload);

    if (!videosRes.ok) {
      const _res = await videosRes.json();
      return {
        success: false,
        error: _res,
      };
    }

    const { items: videos } = (await videosRes.json()) as TYoutubeVideoRes;
    return { success: true, song: videos[0] ?? [] };
  } catch (error: any) {
    console.log(error.message);

    if (error.message === "fetch failed") {
      return {
        success: false,
        error: "fetch failed",
      };
    }

    return {
      success: false,
      error: error.message,
    };
  }
};

// https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=krsna&type=video&videoCategoryId=10&access_token=adfdf&key=[YOUR_API_KEY]
