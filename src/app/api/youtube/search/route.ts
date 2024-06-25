import { formatSong } from "@/helper/song";
import { getGoogleAccessToken } from "@/lib/auth/utils";
import { db } from "@/lib/db";
import { spotifyToYoutube, youtubeSong } from "@/lib/db/schema";
import { youtubeSearchVideoUrl, youtubeVideoUrl } from "@/lib/url-utils";
import { TYoutubeVideo } from "@/types/youtube";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type SearchVideoResponse = Omit<TYoutubeVideo, "contentDetails" | "statistics">;
type TYoutubeVideoRes = { items: TYoutubeVideo[] };

export const POST = async (req: Request) => {
  const start = performance.now();
  const access_token = getGoogleAccessToken();
  if (!access_token)
    return NextResponse.json({
      success: false,
      error: "access_token_not_found",
    });

  const { artists, title, songId } = (await req.json()) as {
    artists: string;
    title: string;
    songId: string;
  };

  const songFromDb = await db.query.spotifyToYoutube.findFirst({
    where: (t) => eq(t.spotifySongId, songId),
    with: {
      youtubeSong: {},
    },
  });

  if (songFromDb) {
    console.log("songFromDb");
    return NextResponse.json({
      success: true,
      song: songFromDb.youtubeSong.song,
    });
  }

  const _title = title + " " + artists;
  console.log(_title);

  const url = youtubeSearchVideoUrl(_title);

  try {
    const res = await fetch(url);
    console.log(res);

    if (!res.ok) {
      const _res = await res.json();
      return NextResponse.json({
        success: false,
        error: _res.message as string,
      });
    }

    const data = (await res.json()).items as SearchVideoResponse[];
    console.log(data);

    if (data.length === 0) {
      return NextResponse.json({
        success: false,
        error: "could not found the song",
      });
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
      return NextResponse.json({
        success: false,
        error: _res,
      });
    }

    const { items: videos } = (await videosRes.json()) as TYoutubeVideoRes;

    if (videos.length === 0) {
      return NextResponse.json({ success: true, song: [] });
    }

    const video = formatSong(videos[0]);

    await db
      .insert(spotifyToYoutube)
      .values({ spotifySongId: songId, youtubeSongId: video.id })
      .then(async () => {
        await db
          .insert(youtubeSong)
          .values({ song: video, youtubeSongId: video.id })
          .execute()
          .catch((err) => console.log(err));
      });

    console.log(performance.now() - start);
    return NextResponse.json({ success: true, song: video });
  } catch (error: any) {
    console.log(performance.now() - start);
    console.log(error.message);
    if (error.message === "fetch failed") {
      return NextResponse.json({
        success: false,
        error: "fetch failed",
      });
    }

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
};
