"use client";

import Image from "next/image";
import React from "react";
import Youtube, {
  YouTubeProps,
  YouTubePlayer,
  YouTubeEvent,
} from "react-youtube";

import {
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  RefreshCcw,
  Shuffle,
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  EllipsisVertical,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { Slider } from "./ui/slider";

import { usePlayerState } from "./contexts/PlayerStateContext";
import { cn, formatNumber } from "@/lib/utils";
import { usePlayerStore } from "@/store/player";
import { useDebounce } from "@/hooks/useDebounce";
import { PlayerDrawer } from "./PlayerDrawer";
import { useScreenSize } from "@/hooks/useScreenSize";
import { SmallDevicePlayerDrawer } from "./SmallDevicePlayerDrawer";
import { Provider } from "@/types/provider";

const AudioPlayer = () => {
  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 1,
      origin: "https://www.youtube.com",
    },
  };

  const playerRef = React.useRef<YouTubePlayer | null>(null);

  const [youtubePlayer, setYoutubePlayer] =
    React.useState<YouTubePlayer | null>(null); // had to use it for the setInterval thing, for changing current time.

  const {
    currentSong,
    playingPlaylist,
    queue,
    setQueue,
    playNext,
    playPrevious,
  } = usePlayerStore();

  const changeSong = useDebounce(() => {
    _setCurrentSong(currentSong);
  }, 500);

  const [_currentSong, _setCurrentSong] =
    React.useState<typeof currentSong>(currentSong);

  const { playerState, setPlayerState } = usePlayerState();
  const [musicDuration, setMusicDuration] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [volume, setVolume] = React.useState<number>(75);
  const [isSeeking, setIsSeeking] = React.useState<boolean>(false);

  React.useEffect(() => {
    setCurrentTime(0);
    setYoutubePlayer(null);
    changeSong();
  }, [currentSong, setYoutubePlayer, setCurrentTime, changeSong]);

  React.useEffect(() => {
    if (!playingPlaylist) return;
    setQueue(playingPlaylist.songs);
  }, [playingPlaylist, setQueue]);

  const onPlayerReady: YouTubeProps["onReady"] = async (
    event: YouTubeEvent<YouTubeProps["onReady"]>,
  ) => {
    try {
      await event.target.setVolume(volume);
      playerRef.current = event.target;
      setYoutubePlayer(event.target);
      (async () => {
        const dur = await event.target.getDuration();
        setMusicDuration(Math.ceil(dur));
      })();
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!youtubePlayer || isSeeking) return;
    const interval = setInterval(async () => {
      const time = await youtubePlayer.getCurrentTime();
      setCurrentTime(Math.ceil(time));
    }, 1000);

    return () => clearInterval(interval);
  }, [isSeeking, youtubePlayer]);

  React.useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    try {
      if (playerState === PlayerStates.PAUSED) {
        player.pauseVideo();
      } else if (playerState === PlayerStates.PLAYING) {
        player.playVideo();
      }
    } catch (error) {
      console.log(error);
    }
  }, [playerState, setPlayerState]);

  const StateChange = React.useCallback(
    (event: YouTubeEvent<number>) => {
      setPlayerState(event.data);
    },
    [setPlayerState],
  );

  const playSong = React.useCallback(() => {
    const player = playerRef.current;
    if (player) {
      setPlayerState(PlayerStates.PLAYING);
    }
  }, [setPlayerState]);

  const pauseSong = React.useCallback(() => {
    const player = playerRef.current;
    if (player) {
      setPlayerState(PlayerStates.PAUSED);
    }
  }, [setPlayerState]);

  const handleSeekChange = React.useCallback((value: number[]) => {
    setIsSeeking(true);
    setCurrentTime(value[0]);
  }, []);

  const handleSeekCommit = React.useCallback(([value]: number[]) => {
    const player = playerRef.current;
    if (!player) return;
    (async () => {
      await player.seekTo(value, true);
      setIsSeeking(false);
    })();
  }, []);

  const handleVolumeChange = React.useCallback((value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    const player = playerRef.current;
    if (player) {
      player.setVolume(newVolume);
    }
  }, []);

  const callbackFunctionOnVideoEnd = React.useCallback(() => {
    const isPlayingNext = playNext();
    if (!isPlayingNext) setPlayerState(undefined);
  }, [setPlayerState, playNext]);

  const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
  const screenSize = useScreenSize();

  const playerDrawerOpenFunction = React.useCallback(() => {
    if (screenSize === "sm") setIsDrawerOpen(true);
  }, [screenSize]);

  if (!currentSong || !_currentSong) return null;

  return (
    <div className="relative flex h-20 overflow-hidden bg-neutral-800 px-2 sm:px-5">
      {screenSize === "sm" ? (
        <SmallDevicePlayerDrawer
          closePlayerDrawer={() => {
            setIsDrawerOpen(false);
          }}
          currentSong={currentSong}
          isOpen={isDrawerOpen}
          queue={queue}
          disabled={!playerState}
          musicDuration={musicDuration ?? 1000}
          currentTime={currentTime}
          playSong={playSong}
          pauseSong={pauseSong}
          onValueChange={handleSeekChange}
          onValueCommit={handleSeekCommit}
          playNext={playNext}
          playPrevious={playPrevious}
        />
      ) : (
        <PlayerDrawer
          closePlayerDrawer={() => setIsDrawerOpen(false)}
          currentSong={currentSong}
          isOpen={isDrawerOpen}
          queue={queue}
        />
      )}

      <div className="absolute left-0 right-0 top-[-3px]">
        <Slider
          disabled={!playerState}
          min={0}
          max={musicDuration ?? 1000}
          value={[currentTime]}
          onValueChange={handleSeekChange}
          onValueCommit={handleSeekCommit}
          className="h-min w-full py-1"
        />
      </div>

      {_currentSong.provider === Provider.YOUTUBE ? (
        <Youtube
          videoId={_currentSong.id}
          opts={opts}
          onReady={onPlayerReady}
          onStateChange={StateChange}
          className="hidden h-full"
          onEnd={callbackFunctionOnVideoEnd}
        />
      ) : null}

      <div
        onClick={playerDrawerOpenFunction}
        className={cn(
          "flex w-full flex-row-reverse gap-2 sm:flex-row sm:gap-8 sm:content-none",
        )}
      >
        <div className="flex flex-[0] items-center justify-end gap-x-2 sm:justify-start md:gap-x-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              playPrevious();
            }}
            className="hidden focus:outline-none sm:block"
          >
            <SkipBack
              fill="white"
              strokeWidth={1}
              className="h-4 w-4 text-white md:h-5 md:w-5"
            />
          </button>
          <div className="flex h-10 w-10 items-center justify-center">
            {playerState === PlayerStates.BUFFERING ? (
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground repeat-infinite md:h-10 md:w-10" />
            ) : playerState === PlayerStates.PLAYING ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  pauseSong();
                }}
                className="focus:outline-none"
              >
                <Pause
                  size={20}
                  fill="white"
                  className="h-8 w-8 text-white md:h-10 md:w-10"
                  strokeWidth={0.5}
                />
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playSong();
                }}
                className="focus:outline-none"
              >
                <Play
                  fill="white"
                  size={20}
                  strokeWidth={1}
                  className="h-8 w-8 text-white md:h-10 md:w-10"
                />
              </button>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              playNext();
            }}
            className="hidden focus:outline-none sm:block"
          >
            <SkipForward
              fill="white"
              strokeWidth={2}
              className="h-4 w-4 text-white md:h-5 md:w-5"
            />
          </button>
          <div className="hidden w-[4.3rem] text-sm text-muted-foreground sm:flex">
            <span className="w-1/2">
              {Math.floor(currentTime / 60)}:
              {Math.floor(currentTime % 60)
                .toString()
                .padStart(2, "0")}
            </span>
            {"  "}/{"   "}
            <span className="w-1/2">
              {Math.floor(musicDuration / 60)}:
              {Math.floor(musicDuration % 60)
                .toString()
                .padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="flex w-[1px] flex-1 items-center justify-start sm:justify-center">
          <div className="flex items-center gap-x-4 overflow-hidden">
            <Image
              src={currentSong.imageUrl}
              height={40}
              width={64}
              className="h-10 w-16"
              alt="song image"
            />
            <div className="flex max-w-[unset] flex-col sm:max-w-64">
              <p className="truncate">{currentSong.songTitle}</p>
              <p className="flex items-center truncate text-sm text-muted-foreground text-neutral-400">
                <span>{currentSong.artistOrChannel}</span>
                {currentSong.provider === Provider.SPOTIFY ? (
                  <span className="hiddden lg:inline">
                    <span
                      className="mx-1 h-1 w-1 rounded-full bg-neutral-300"
                      aria-hidden
                    />
                    {`${currentSong.popularity} / 100`}/ 100 Popularity
                  </span>
                ) : (
                  <>
                    <span className="hiddden lg:inline">
                      <span
                        className="mx-1 h-1 w-1 rounded-full bg-neutral-300"
                        aria-hidden
                      />
                      {formatNumber(currentSong.viewsCount)} Views
                    </span>
                    <span className="hiddden lg:inline">
                      <span
                        className="mx-1 h-1 w-1 rounded-full bg-neutral-300"
                        aria-hidden
                      />
                      {formatNumber(currentSong.likesCount)} Likes
                    </span>
                  </>
                )}
              </p>
            </div>
            <div className="hidden items-center space-x-3 opacity-65 lg:flex">
              <ThumbsUp className="h-4 w-4" />
              <ThumbsDown className="h-4 w-4" />
              <EllipsisVertical className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="hidden flex-[0] items-center justify-end gap-x-4 sm:flex">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="group relative flex items-center"
          >
            <div className="group mr-2 w-16 peer-focus:text-nowrap">
              <Slider
                title={`${volume}`}
                min={0}
                max={100}
                value={[volume]}
                onValueChange={handleVolumeChange}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="flex w-full py-2 opacity-55 group-hover:flex group-focus:flex sm:hidden"
              />
            </div>

            <button className="focus:outline-none">
              {volume > 0 ? (
                <Volume2 className="h-5 w-5 text-muted-foreground duration-300 ease-in hover:text-neutral-300" />
              ) : (
                <VolumeX className="h-5 w-5 text-muted-foreground duration-300 ease-in hover:text-neutral-300" />
              )}
            </button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="hidden h-4 w-4 focus:outline-none md:flex"
          >
            <RefreshCcw className="h-full w-full text-muted-foreground duration-300 ease-in hover:text-neutral-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Shuffle");
            }}
            className="hidden h-4 w-4 focus:outline-none md:flex"
          >
            <Shuffle className="h-full w-full text-muted-foreground duration-300 ease-in hover:text-neutral-300" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsDrawerOpen((prev) => !prev);
            }}
            className={cn(
              "flex h-6 w-6 text-neutral-300 hover:text-neutral-50 focus:outline-none",
              {
                "text-white": isDrawerOpen,
              },
            )}
          >
            {isDrawerOpen ? (
              <ChevronDown
                strokeWidth={2}
                className="h-full w-full duration-300 ease-in"
              />
            ) : (
              <ChevronUp className="h-full w-full duration-300 ease-in" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { AudioPlayer };
