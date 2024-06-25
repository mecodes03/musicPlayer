import React from "react";
import SongCard from "../../(components)/SongCard";
import { useSongData } from "../../(components)/SongCardHooks";
import { TYoutubeVideo } from "@/types/youtube";
import { SpotifyPlaylistSong } from "@/types/spotify";
import { Song } from "@/types/song";

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

const SongCardWrapper = ({
  song,
  index,
}: {
  song: TYoutubeVideo | SpotifySong;
  index: number;
}) => {
  const songData = useSongData({ song });
  return <SongCard song={songData} index={index} />;
};

export default SongCardWrapper;
