"use client";

import PlaylistCard from "./PlaylistCard";
import React, { useState } from "react";
import PlaylistsGrid from "./PlaylistsGrid";
import FetchMoreButton from "./FetchMoreButton";
import { Provider } from "@/types/provider";
import { Playlist } from "@/types/playlist";

interface YoutubePlaylistsProps {
  initialPlaylists: Playlist[];
  nextPageToken: string | null;
}

const YoutubePlaylists = ({
  initialPlaylists,
  nextPageToken: _nextPageToken,
}: YoutubePlaylistsProps) => {
  const [playlists, setPlaylists] = useState<Playlist[]>(initialPlaylists);
  const [nextPageToken, setNextPageToken] = useState<string | null>(
    _nextPageToken,
  );

  // const fetch = useMutation({
  //   mutationFn: async (nextPageToken: string) =>
  //     await moreCurretUserYoutubePlaylists(nextPageToken),
  //   onSuccess: (data) => {
  //     if (!data.success) {
  //       return;
  //     }
  //     console.log(data);
  //     setPlaylists((prev) => [...prev, ...data.playlists]);
  //     setNextPageToken(data.nextPageToken);
  //   },
  // });

  const fetchMore = () => {
    if (!nextPageToken) {
      return;
    }
    // fetch.mutate(nextPageToken);
  };

  return (
    <div className="grid w-full place-items-center space-y-10">
      <PlaylistsGrid>
        {playlists.flatMap((playlist) => {
          return (
            <PlaylistCard
              provider={Provider["YOUTUBE"]}
              playlist={playlist}
              key={playlist.playlistId}
            />
          );
        })}
      </PlaylistsGrid>
      {nextPageToken ? (
        <FetchMoreButton
          isLoading={false}
          // isLoading={fetch.isPending}
          fetchFunction={fetchMore}
        />
      ) : null}
    </div>
  );
};

export default YoutubePlaylists;
