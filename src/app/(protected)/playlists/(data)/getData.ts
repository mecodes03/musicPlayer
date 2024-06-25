import { cookies } from "next/headers";
import { GOOGLE_ACCESS_TOKEN_COOKIE_KEY } from "@/constants";
import {
  GoogleAccessTokenExpiredError,
} from "@/lib/error";

import {
  TYoutubePlaylistById,
  TYoutubePlaylistItems,
  TYoutubeVideo,
} from "@/types/youtube";

type TYoutubeVideosRes = { items: TYoutubeVideo[] };

async function getPlaylistItems(
  id: string,
  maxResults: number = 8, // how many items do we wanna get for a certain playlist
  pageToken?: string,
  currentCount: number = 0
): Promise<{
  playlistId: string;
  nextPageToken: string | null;
  videos: TYoutubeVideo[];
}> {
  const access_token = cookies().get(GOOGLE_ACCESS_TOKEN_COOKIE_KEY)?.value;

  if (!access_token) {
    throw new GoogleAccessTokenExpiredError();
  }
  const playlistUrl = "https://www.googleapis.com/youtube/v3/playlistItems";

  const res = await fetch(
    `${playlistUrl}?part=contentDetails&playlistId=${id}&maxResults=${maxResults}${
      pageToken ? `&pageToken=${pageToken}` : ""
    }&key=${process.env.GOOGLE_API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "force-cache",
    }
  );

  if (!res.ok) {
    console.log(await res.json());
    console.log(`single-playlist-status-${res.status}`);
    return {
      nextPageToken: null,
      playlistId: id,
      videos: [],
    };
  }

  const playlistData = (await res.json()) as TYoutubePlaylistItems; // items of a certain playlist
  // console.log(playlistData.items[0]);

  const videoIds = playlistData.items.map(
    (item) => item.contentDetails.videoId
  );
  // console.log(videoIds);

  let idString = "";

  videoIds.forEach((__id) => (idString += `&id=${__id}`));

  const videoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&mine=true&key=AIzaSyDBierHfl-e9UoCZEUYJp2CaGACEF8ddrY${idString}`;
  // maxResults won't work in fetching multiple videoids

  const videosRes = await fetch(videoUrl, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!videosRes.ok) {
    console.log(videosRes.status);

    return {
      playlistId: id,
      nextPageToken: playlistData.nextPageToken ?? null,
      videos: [],
    };
  }

  let videos = ((await videosRes.json()) as TYoutubeVideosRes).items.filter(
    (video) => video.snippet.categoryId === "10"
  ); // only getting the music videos

  currentCount += videos.length;

  if (currentCount < 4 && playlistData.nextPageToken) {
    // console.log("there is nextpage", playlistData.nextPageToken);
    videos = [
      ...videos,
      ...(
        await getPlaylistItems(
          id,
          maxResults,
          playlistData.nextPageToken,
          currentCount
        )
      ).videos,
    ];
  }

  return {
    playlistId: id,
    nextPageToken: playlistData.nextPageToken || null,
    videos: videos,
  };
}

import { userYoutubePlaylistsUrl } from "@/lib/utils";
import { Playlist } from "@/types/playlist";
import { getGoogleAccessToken, getSpotifyAccessToken } from "@/lib/auth/utils";

type PlaylistsResponse =
  | {
      success: false;
      error: string;
    }
  | {
      success: true;
      playlists: Playlist[];
      nextPageToken: string | null;
    };

export async function currentUserYoutubePlaylists(
  maxResults: number
): Promise<PlaylistsResponse> {
  if (maxResults > 10) {
    maxResults = 10;
  }

  const token = getGoogleAccessToken();

  if (!token) {
    throw new GoogleAccessTokenExpiredError();
  }

  const url = userYoutubePlaylistsUrl(maxResults, token);

  const youtubeRes = await fetch(url);

  if (!youtubeRes.ok || youtubeRes.status !== 200 || !youtubeRes) {
    console.log(await youtubeRes.json());

    return { success: false, error: youtubeRes.statusText };
  }

  const youtubePlaylists = (await youtubeRes.json()) as TYoutubePlaylistById;
  // console.log("youtubePlaylists");
  // console.log(youtubePlaylists);

  let ids = youtubePlaylists.items.map((playlist) => playlist.id);

  // TODO: doing this a little more eligencelly
  const metadataForPlaylist = youtubePlaylists.items.map(({ id, snippet }) => ({
    ...snippet,
    id,
  }));

  if (!ids.length) return { success: true, nextPageToken: null, playlists: [] };

  const promises: Promise<{
    playlistId: string;
    nextPageToken: string | null;
    videos: TYoutubeVideo[];
  }>[] = [];

  for (const id of ids) {
    const promise = getPlaylistItems(id);
    promises.push(promise);
  }

  const _playlists = await Promise.all(promises);

  const __playlists: Playlist[] = _playlists.map((playlist, i) => {
    const metadata = metadataForPlaylist.find(
      ({ id }) => id == playlist.playlistId
    )!;
    return {
      ...playlist,
      ownedBy: metadata.channelTitle,
      playlistTitle: metadata.title,
    };
  });

  return {
    success: true,
    nextPageToken: youtubePlaylists.nextPageToken ?? null,
    playlists: __playlists,
  };
}
