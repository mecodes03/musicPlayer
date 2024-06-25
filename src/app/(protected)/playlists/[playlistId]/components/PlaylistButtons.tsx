"use client";

import { Button } from "@/components/ui/button";
import { formatSong } from "@/helper/song";
import { usePlayerStore } from "@/store/player";
import { Provider } from "@/types/provider";
import { Song } from "@/types/song";
import { SpotifyPlaylistSong } from "@/types/spotify";
import { TYoutubeVideo } from "@/types/youtube";
import { Play, Shuffle } from "lucide-react";
import React, { useEffect } from "react";

interface PlaylistButtonsProps {
  playlistId: string;
  songs: TYoutubeVideo[] | SpotifySong[];
}

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

enum PlaybackType {
  SHUFFLE = "shuffle",
  SEQUENCE = "sequence",
}

type shuffle<T> = (array: T[]) => T[];

const shuffleArray: shuffle<Song> = (array) => {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
};

const PlaylistButtons = ({ songs, playlistId }: PlaylistButtonsProps) => {
  const {
    currentPagePlaylist,
    setCurrentPagePlaylist,
    playingPlaylist,
    setPlayingPlaylist,
    setCurrentSong,
    playeBackType,
    setPlayBackType,
  } = usePlayerStore();

  const handlePlay = React.useCallback(
    (buttonPlabackType: PlaybackType) => {
      if (
        !currentPagePlaylist ||
        (currentPagePlaylist.id === playingPlaylist?.id &&
          playeBackType === buttonPlabackType)
      )
        // return if we don't have a current-playlist or if (we are already playing it + the playback type is also same)
        return;

      const _songs =
        buttonPlabackType === PlaybackType.SHUFFLE
          ? shuffleArray(currentPagePlaylist.items)
          : currentPagePlaylist.items;

      setPlayingPlaylist(currentPagePlaylist.id, _songs);
      setCurrentSong(_songs[0]);
      setPlayBackType(buttonPlabackType);
    },
    [
      setPlayBackType,
      playeBackType,
      setPlayingPlaylist,
      currentPagePlaylist,
      playingPlaylist,
      setCurrentSong,
    ],
  );

  useEffect(() => {
    const _songs = songs.reduce((accumulator, current_song) => {
      const song = formatSong(current_song);
      if (song.provider === Provider.YOUTUBE) accumulator.push(song);
      return accumulator;
    }, [] as Song[]);
    if (songs as TYoutubeVideo[]) setCurrentPagePlaylist(playlistId, _songs);
  }, [setCurrentPagePlaylist, songs, playlistId]);

  return (
    <>
      <Button
        className="flex items-center justify-center gap-x-2 rounded-full"
        size="lg"
        onClick={() => handlePlay(PlaybackType.SEQUENCE)}
      >
        <Play className="h-4 w-4" fill="white" />
        <span>Play</span>
      </Button>
      <Button
        className="flex items-center justify-center gap-x-2 rounded-full"
        size="lg"
        variant={"secondary"}
        onClick={() => handlePlay(PlaybackType.SHUFFLE)}
      >
        <Shuffle className="h-4 w-4" fill="white" />
        <span>Shuffle</span>
      </Button>
    </>
  );
};

export default PlaylistButtons;
