"use client";

import React, { useOptimistic } from "react";
import { usePlayerState } from "@/components/contexts/PlayerStateContext";
import {
  cn,
  formatNumber,
  millisecondsToTime,
  parseISODuration,
} from "@/lib/utils";
import { TYoutubeVideo } from "@/types/youtube";
import { Ellipsis, Loader2, Pause, Play } from "lucide-react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { ClassValue } from "clsx";
import Image from "next/image";
import { Provider } from "@/types/provider";
import { usePlayerStore } from "@/store/player";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSpotifyOptimisticSong } from "@/store/optimistic-song";
import { Song } from "@/types/song";

type ReturnType =
  | {
      success: true;
      song: TYoutubeVideo;
    }
  | {
      success: false;
      error: string;
    };

type TYoutubeSong = {
  atChannel: string;
  provider: Provider.YOUTUBE;
  duration: string;
  song: Song;
  playsCount: string;
};

type TSpotifySong = {
  artists: string[];
  duration: number;
  provider: Provider.SPOTIFY;
  popularity: number;
  youtubeSong: TYoutubeVideo | null;
};

type PlaylistSongCardProps = {
  songId: string;
  index: number;
  className: ClassValue;
  image: string;
  name: string;
} & (TSpotifySong | TYoutubeSong);

const PlaylistSongCard = (props: PlaylistSongCardProps) => {
  const { playerState, setPlayerState } = usePlayerState();

  const song = React.useMemo(() => {
    return {
      songTitle: props.name,
      artistOrChannel:
        props.provider === Provider.SPOTIFY
          ? props.artists.reduce(
              (p_artists_str, curr_artist) =>
                p_artists_str.concat(" ", curr_artist),
              "",
            )
          : props.atChannel,
      imageUrl: props.image,
      songStats:
        props.provider === Provider.SPOTIFY
          ? `${props.popularity} / 100`
          : formatNumber(props.playsCount),
      songDuration:
        props.provider === Provider.SPOTIFY
          ? millisecondsToTime(props.duration)
          : parseISODuration(props.duration),
      onHoverTitle: `Play ${props.name} by ${
        props.provider == Provider.SPOTIFY
          ? props.artists.map((artists) => artists)
          : props.atChannel
      }`,
      song:
        props.provider === Provider.YOUTUBE ? props.song : props.youtubeSong,
      provider: props.provider,
    };
  }, [props]);

  const {
    currentSong,
    setCurrentSong,
    setPlayingPlaylist,
    currentPagePlaylist,
    playingPlaylist,
  } = usePlayerStore();

  const isCurrentSong = React.useMemo(
    () => (currentSong && currentSong.id === props.songId) ?? false,
    [currentSong, props.songId],
  );

  const { mutate: getSong } = useMutation({
    mutationKey: ["spotify-to-youtube", "get-song"],
    mutationFn: async () => {
      if (props.provider === Provider.YOUTUBE) return null;
      const body = {
        artists: props.artists,
        title: props.name,
        songId: props.songId,
      };
      const res = await fetch("http://localhost:3000/api/youtube/search", {
        method: "POST",
        body: JSON.stringify(body),
      }).then(async (res) => await res.json());
      console.log(res);
      if (!res.success) if (res.error === "fetch failed") throw new Error();
      return res;
    },

    onSuccess: (data) => {
      if (!data) return;
      if (!data.success) return;
      if (data.song === null)
        return toast.info("cound not found the requested song");
      setCurrentSong(data.song);
    },
    retry: 2,
  });

  const handlePlayPauseClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!currentPagePlaylist) return;

      if (isCurrentSong && playingPlaylist?.id === currentPagePlaylist?.id) {
        setPlayerState(
          playerState === PlayerStates.PLAYING
            ? PlayerStates.PAUSED
            : PlayerStates.PLAYING,
        );
        return;
      }

      if (!song) {
        getSong();
        return;
      }
      // if we are playing the current playlist and if the click one ain't current-playing song
      if (
        currentPagePlaylist &&
        playingPlaylist?.id !== currentPagePlaylist.id &&
        song.provider === Provider.YOUTUBE
      ) {
        setPlayingPlaylist(currentPagePlaylist.id, currentPagePlaylist.items);
      }
      // setCurrentSong(song);
    },
    [
      currentPagePlaylist,
      isCurrentSong,
      playerState,
      playingPlaylist,
      song,
      // setCurrentSong,
      setPlayerState,
      setPlayingPlaylist,
      getSong,
    ],
  );

  const screenSize = useScreenSize();

  const handleSongPlay = React.useCallback(() => {
    if (props.provider == Provider.SPOTIFY) {
      // if (props.youtubeSong) setCurrentSong(props.youtubeSong);
      return;
    }
    screenSize === "sm" && setCurrentSong(props.song);
  }, [screenSize, setCurrentSong, props]);

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center gap-x-3 rounded-md px-2 py-3 transition-all duration-200 ease-in-out after:absolute after:left-3 after:right-3 after:top-full after:border-b after:border-neutral-800 hover:bg-neutral-800 sm:cursor-default",
        props.className,
        {
          "bg-neutral-800": isCurrentSong,
        },
      )}
      onClick={handleSongPlay}
    >
      <div className="group relative flex w-10 items-center justify-center">
        <Image
          src={song.imageUrl}
          alt="song image"
          height={40}
          width={40}
          className="h-10 w-10 transition-all duration-200 group-hover:opacity-35"
        />
        <div className="absolute inset-0 z-[1] flex items-center justify-center">
          <div
            className={cn(
              "duration-400 flex items-center justify-center opacity-0 transition-all ease-out group-hover:h-10 group-hover:w-10 group-hover:opacity-100",
              {
                "opacity-100": isCurrentSong,
              },
            )}
          >
            <span
              className={cn("text-muted-foreground group-hover:hidden", {
                hidden: isCurrentSong,
              })}
            >
              {props.index + 1}
            </span>
            <button
              className={cn("hidden group-hover:flex", {
                flex: isCurrentSong,
              })}
              onClick={handlePlayPauseClick}
              title={song.onHoverTitle}
            >
              {isCurrentSong && playerState === PlayerStates.BUFFERING ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isCurrentSong && playerState === PlayerStates.PLAYING ? (
                <Pause className="h-5 w-5" fill="white" />
              ) : (
                <Play className="h-5 w-5" fill="white" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-between gap-x-4 overflow-hidden">
        <div className="flex-[0.7] truncate md:flex-[0.6]">
          <p className="truncate">{song.songTitle}</p>
          <p className="truncate text-sm text-muted-foreground">
            {song.artistOrChannel}
          </p>
        </div>
        <div className="flex flex-[0.3] items-start justify-end pt-1 md:flex-[0.4] md:justify-between">
          <span className="hidden items-center whitespace-nowrap text-sm text-neutral-300 md:flex">
            {song.songStats}
          </span>

          <div className="flex items-center text-sm text-muted-foreground">
            {song.songDuration}
            <span className="ml-2 h-4 w-4">
              <Ellipsis className="hidden h-4 w-4 group-hover:flex" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistSongCard;
