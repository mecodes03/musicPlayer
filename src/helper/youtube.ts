import { GOOGLE_ACCESS_TOKEN_COOKIE_KEY } from "@/constants";
import {
  youtubePlaylistItemsUrl,
  youtubePlaylistUrl,
  youtubeVideoUrl,
} from "@/lib/url-utils";
import {
  TYoutubePlaylistById,
  TYoutubePlaylistItems,
  TYoutubeVideo,
} from "@/types/youtube";
import { cookies } from "next/headers";

type PlaylistItems = {
  items: TYoutubeVideo[];
  playlistId: string;
  playlistTitle: string;
  publishedAt: string;
  channelTitle: string;
  nextPageToken: string | null;
  pageInfo: TYoutubePlaylistItems["pageInfo"];
  itemCount: number;
  privacyStatus: string;
};

type TYoutubeVideoRes = {
  items: TYoutubeVideo[];
};

type PlaylisReturnType =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      data: PlaylistItems;
    };

export async function getPlaylist(
  id: string,
  maxResults: number = 5, // how many items do we wanna get for a certain playlist
  pageToken?: string,
  currentCount: number = 0
): Promise<PlaylisReturnType> {
  const access_token = cookies().get(GOOGLE_ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!access_token) {
    throw new Error("no_access_token");
  }

  const playlistUrl = youtubePlaylistUrl(id);

  const payload = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  const playlistRes = await fetch(playlistUrl, payload);

  if (!playlistRes.ok) {
    const res = await playlistRes.json();
    return {
      success: false,
      error: res,
    };
  }

  const { contentDetails, snippet, status } = (
    (await playlistRes.json()) as TYoutubePlaylistById
  ).items[0];

  const playlistItemsUrl = youtubePlaylistItemsUrl(id, 30, pageToken);

  const playlistItemsRes = await fetch(playlistItemsUrl, payload);

  if (!playlistItemsRes.ok) {
    console.log("error while getting playlistItems");
    const _res = await playlistItemsRes.json();
    return {
      success: false,
      error: _res,
    };
  }

  const playlistData = (await playlistItemsRes.json()) as TYoutubePlaylistItems; // items of a certain playlist
  // console.log(playlistData);

  const videoIds = playlistData.items.map((item) => {
    // console.log(item.contentDetails);
    return item.contentDetails.videoId;
  });

  const videoUrl = youtubeVideoUrl(videoIds);
  // console.log(videoUrl);
  const videosRes = await fetch(videoUrl, payload);

  if (!videosRes.ok) {
    const _res = await videosRes.json();
    return {
      success: false,
      error: _res,
    };
  }

  let videos = ((await videosRes.json()) as TYoutubeVideoRes).items.filter(
    (item) => item.snippet.categoryId === "10"
  );

  currentCount += videos.length;

  if (currentCount < 10 && playlistData.nextPageToken) {
    const newVideos = await getPlaylist(
      id,
      maxResults,
      playlistData.nextPageToken,
      currentCount
    );

    if (newVideos.success) {
      videos = [...videos, ...newVideos.data.items];
    }
  }

  return {
    success: true,
    data: {
      playlistId: id,
      nextPageToken: playlistData.nextPageToken || null,
      items: videos,
      pageInfo: playlistData.pageInfo,
      playlistTitle: snippet.title,
      publishedAt: snippet.publishedAt,
      channelTitle: snippet.channelTitle,
      itemCount: contentDetails.itemCount,
      privacyStatus: status.privacyStatus,
    },
  };
}
