"use client";

import React from "react";
import { usePlayerState } from "@/components/contexts/PlayerStateContext";
import { cn, formatNumber } from "@/lib/utils";
import { Ellipsis, Loader2, Pause, Play } from "lucide-react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import Image from "next/image";
import { Provider } from "@/types/provider";
import { usePlayerStore } from "@/store/player";
import { useScreenSize } from "@/hooks/useScreenSize";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Song } from "@/types/song";

type ReturnType =
  | {
      success: true;
      song: Song;
    }
  | {
      success: false;
      error: string;
    };

interface SongCardProps {
  index: number;
  song: Song;
}

const SongCard = ({ song, index }: SongCardProps) => {
  const { playerState, setPlayerState } = usePlayerState();

  const {
    currentSong,
    setCurrentSong,
    setPlayingPlaylist,
    currentPagePlaylist,
    playingPlaylist,
  } = usePlayerStore();

  const isCurrentSong = React.useMemo(
    () => (currentSong && currentSong.id === song.id) ?? false,
    [currentSong, song],
  );

  const queryClient = new QueryClient();

  const [retryCount, setRetryCount] = React.useState<number>(0);

  const { mutate: getSong } = useMutation({
    mutationKey: ["spotify-to-youtube", "get-song"],
    mutationFn: async () => {
      if (song.provider === Provider.YOUTUBE) return null;

      const prevSong = localStorage.getItem("prev_song");
      localStorage.setItem(
        "prev_song",
        JSON.stringify(prevSong ?? currentSong),
      );

      console.log(currentSong);

      setCurrentSong(song);
      setPlayerState(PlayerStates.BUFFERING);

      const body = {
        artists: song.artistOrChannel,
        title: song.songTitle,
        songId: song.id,
      };

      const res = await fetch("http://localhost:3000/api/youtube/search", {
        method: "POST",
        body: JSON.stringify(body),
      }).then(async (res) => await res.json());

      console.log(res);
      if (!res.success) throw new Error(res.error);
      return res;
    },

    onSuccess: (data) => {
      setRetryCount(0);
      if (!data) return;
      if (!data.success) return;
      if (data.song === null)
        return toast.info("cound not found the requested song");
      setCurrentSong(data.song);
      localStorage.removeItem("prev_song");
    },

    onError: (err) => {
      setRetryCount((prev) => prev + 1);
      if (err.message == "fetch failed") {
        if (retryCount >= 2) {
          const prevSong = JSON.parse(
            localStorage.getItem("prev_song") ?? "",
          ) as Song | null | string;
          if (typeof prevSong === "string" || typeof prevSong === null) return;
          console.log(prevSong);
          setCurrentSong(prevSong);
          toast.error("error accured while fetching the song.");
        }
      }
    },
  });

  const handlePlayPauseClick = React.useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!currentPagePlaylist) return;
      console.log("clicked");

      if (isCurrentSong && playingPlaylist?.id === currentPagePlaylist?.id)
        return setPlayerState(
          playerState === PlayerStates.PLAYING
            ? PlayerStates.PAUSED
            : PlayerStates.PLAYING,
        );

      if (song.provider === Provider.SPOTIFY) return getSong();

      // if we are playing the current playlist and if the click one ain't current-playing song
      if (
        currentPagePlaylist &&
        playingPlaylist?.id !== currentPagePlaylist.id &&
        song.provider === Provider.YOUTUBE
      ) {
        setPlayingPlaylist(currentPagePlaylist.id, currentPagePlaylist.items);
      }
      setCurrentSong(song);
    },
    [
      setCurrentSong,
      currentPagePlaylist,
      isCurrentSong,
      playerState,
      playingPlaylist,
      song,
      setPlayerState,
      setPlayingPlaylist,
      getSong,
    ],
  );

  const screenSize = useScreenSize();

  const songStats = React.useMemo(() => {
    return song.provider === Provider.SPOTIFY
      ? `${song.popularity} / 100`
      : formatNumber(song.viewsCount);
  }, [song]);

  const handleSongPlay = React.useCallback(() => {
    console.log("set song...");
    setCurrentSong(song);
    screenSize === "sm" && setCurrentSong(song);
    if (song.provider === Provider.YOUTUBE) setCurrentSong(song);
  }, [screenSize, setCurrentSong, song]);

  return (
    <div
      className={cn(
        "group relative flex cursor-pointer items-center gap-x-3 rounded-md px-2 py-3 transition-all duration-200 ease-in-out after:absolute after:left-3 after:right-3 after:top-full after:border-b after:border-neutral-800 hover:bg-neutral-800 sm:cursor-default",
        "[&:not(:last-child)]:after:border",
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
              {index + 1}
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
            {songStats}
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

export default SongCard;
