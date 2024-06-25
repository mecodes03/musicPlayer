"use client";

import { TSpotifyPlaylists } from "@/types/spotify";
import React from "react";
import PlaylistsGrid from "./PlaylistsGrid";
import SpotifyPlaylistCard from "./SpotifyPlaylistCard";
import FetchMoreButton from "./FetchMoreButton";

interface SpotifyPlaylistsProps {
  initialPlaylists: TSpotifyPlaylists;
}

const SpotifyPlaylists = ({ initialPlaylists }: SpotifyPlaylistsProps) => {
  const [playlists, setPlaylists] =
    React.useState<TSpotifyPlaylists>(initialPlaylists);

  const fetchMore = () => {
    console.log("more..");
  };

  return (
    <div className="w-full grid space-y-10 place-items-center">
      <PlaylistsGrid>
        {playlists?.items.flatMap((playlist) => {
          return <SpotifyPlaylistCard playlist={playlist} key={playlist.id} />;
        })}
      </PlaylistsGrid>
      {playlists.next ? (
        <FetchMoreButton isLoading={false} fetchFunction={fetchMore} />
      ) : null}
    </div>
  );
};

export default SpotifyPlaylists;
