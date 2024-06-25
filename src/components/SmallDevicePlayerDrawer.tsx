"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PlaylistSongCard from "@/app/(protected)/playlists/[playlistId]/components/PlaylistSongCard";
import { Provider } from "@/types/provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TYoutubeVideo } from "@/types/youtube";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";
import { Slider } from "./ui/slider";
import {
  ChevronDown,
  CirclePause,
  CirclePlay,
  EllipsisVertical,
  Loader2,
  Repeat1Icon,
  Shuffle,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { usePlayerState } from "./contexts/PlayerStateContext";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Song } from "@/types/song";
import SongCard from "@/app/(protected)/playlists/(components)/SongCard";

interface SmallDevicePlayerDrawerProps {
  isOpen: boolean;
  currentSong: Song;
  queue: Song[] | null;
  closePlayerDrawer: () => void;
  disabled: boolean;
  musicDuration: number;
  currentTime: number;
  onValueChange: ([]: number[]) => void;
  onValueCommit: ([]: number[]) => void;
  playSong: () => void;
  pauseSong: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const SmallDevicePlayerDrawer = ({
  currentSong,
  isOpen,
  queue,
  closePlayerDrawer,
  disabled,
  musicDuration,
  onValueChange,
  onValueCommit,
  currentTime,
  pauseSong,
  playSong,
  playNext,
  playPrevious,
}: SmallDevicePlayerDrawerProps) => {
  const { playerState } = usePlayerState();

  React.useEffect(() => {
    console.log(currentSong);
  }, [currentSong]);

  if (!currentSong || !queue) return null;

  return (
    <Drawer onClose={closePlayerDrawer} open={isOpen}>
      <DrawerContent className="flex h-full min-h-[100vh] flex-col bg-black sm:hidden">
        <div className="mx-2 flex h-10 items-center justify-between">
          <DrawerTrigger asChild onClick={closePlayerDrawer}>
            <button>
              <ChevronDown />
            </button>
          </DrawerTrigger>
          <Button
            variant={"ghost"}
            className="h-auto overflow-hidden rounded-full p-2"
          >
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </div>
        <Tabs
          defaultValue="player"
          className="flex h-[calc(100%-4rem)] flex-col-reverse gap-y-3 p-2"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="player" className="active:bg-neutral-600">
              Player
            </TabsTrigger>
            <TabsTrigger value="more">Options</TabsTrigger>
          </TabsList>
          <TabsContent className="h-full w-full py-8" value="player">
            <div className="flex h-full w-full flex-col">
              <div className="flex flex-1 justify-center">
                <Image
                  src={currentSong.imageUrl}
                  width={640}
                  height={480}
                  alt="Song Image"
                  className="my-auto h-auto w-full max-w-[25rem]"
                />
              </div>
              <div className="w-full p-5">
                <h1 className="mb-2 truncate text-2xl font-semibold">
                  {currentSong.songTitle}
                </h1>

                <span className="truncate text-muted-foreground">
                  {currentSong.artistOrChannel}
                </span>

                <div className="my-4 w-full">
                  <Slider
                    disabled={disabled}
                    min={0}
                    max={musicDuration}
                    value={[currentTime]}
                    onValueChange={onValueChange}
                    onValueCommit={onValueCommit}
                    className="h-min w-full py-1"
                  />
                  <div className="mt-2 flex w-full justify-between text-xs text-muted-foreground">
                    <span>
                      {Math.floor(currentTime / 60)}:
                      {Math.floor(currentTime % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                    <span>
                      {Math.floor(musicDuration / 60)}:
                      {Math.floor(musicDuration % 60)
                        .toString()
                        .padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full px-12">
                <div className="flex items-center justify-between transition-all duration-150">
                  <button className="h-4 w-4 rounded-full active:bg-neutral-600">
                    <Shuffle className="h-full w-full fill-white" />
                  </button>

                  <button className="h-5 w-5" onClick={playPrevious}>
                    <SkipBackIcon className="h-full w-full fill-white" />
                  </button>

                  <div className="flex h-16 w-16 items-center justify-center">
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
                        <CirclePause
                          size={20}
                          className="h-16 w-16 fill-white text-black"
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
                        <CirclePlay
                          fill="white"
                          size={20}
                          strokeWidth={1}
                          className="h-16 w-16 fill-white text-black md:h-10 md:w-10"
                        />
                      </button>
                    )}
                  </div>

                  <button className="h-5 w-5" onClick={playNext}>
                    <SkipForwardIcon className="h-full w-full fill-white" />
                  </button>

                  <button className="h-4 w-4">
                    <Repeat1Icon className="h-full w-full" />
                    {/* <RepeatIcon /> */}
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="more" className="overflow-hidden">
            <Tabs
              defaultValue="queue"
              className="flex h-full flex-col-reverse gap-y-2"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="queue">Queue</TabsTrigger>
                <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                <TabsTrigger value="similar">Similar</TabsTrigger>
              </TabsList>
              <TabsContent value="queue" className="overflow-auto">
                <div className="custom-scrollbar flex h-full w-full scroll-m-1 flex-col overflow-y-scroll scroll-smooth">
                  {queue.map((song, i) => (
                    <SongCard song={song} index={i} key={song.id} />
                    //   <PlaylistSongCard
                    //     index={i}
                    //     key={song.id}
                    //     provider={Provider.YOUTUBE}
                    //     className={cn({
                    //       "after:border-0": i + 1 === queue.length,
                    //     })}
                    //     atChannel={song.snippet.channelTitle}
                    //     duration={song.contentDetails.duration}
                    //     image={song.snippet.thumbnails.default.url}
                    //     name={song.snippet.title}
                    //     playsCount={song.statistics.viewCount}
                    //     song={song}
                    //     songId={song.id}
                    //   />
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="lyrics" className="overflow-auto">
                Lyrics
              </TabsContent>
              <TabsContent value="similar" className="overflow-auto">
                Similar
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
};

export { SmallDevicePlayerDrawer };
