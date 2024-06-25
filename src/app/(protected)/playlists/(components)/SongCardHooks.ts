"use client";

import React from "react";
import { TYoutubeVideo } from "@/types/youtube";
import { SpotifyPlaylistSong } from "@/types/spotify";

import { formatSong, isYoutubeSong } from "@/helper/song";
import { Song } from "@/types/song";

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

export const useSongType = () => {
  return React.useCallback(isYoutubeSong, []);
};

export const useSongData = ({
  song,
}: {
  song: TYoutubeVideo | SpotifySong;
}) => {
  return React.useMemo(() => {
    return formatSong(song);
  }, [song]);
};
