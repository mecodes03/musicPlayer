"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import PlaylistSongCard from "@/app/(protected)/playlists/[playlistId]/components/PlaylistSongCard";
import { Provider } from "@/types/provider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { TYoutubeVideo } from "@/types/youtube";
import { ScrollBorderContext } from "./Scroll";
import { Song } from "@/types/song";
import SongCard from "@/app/(protected)/playlists/(components)/SongCard";

interface PlayerDrawerProps {
  isOpen: boolean;
  currentSong: Song;
  queue: Song[] | null;
  closePlayerDrawer: () => void;
}

const PlayerDrawer = ({ currentSong, isOpen, queue }: PlayerDrawerProps) => {
  const { visible } = React.useContext(ScrollBorderContext);

  React.useEffect(() => {
    if (!isOpen) return;

    if (isOpen) {
      visible(true);
      console.log("opening...", isOpen);
    }

    return () => {
      console.log("closing...", isOpen);
      if (window.scrollY < 20) visible(false);
    };
  }, [visible, isOpen]);

  if (!currentSong || !queue) return null;

  return (
    <div className="flex">
      <div
        className={cn(
          "fixed bottom-20 left-0 right-0 top-16 -z-10 h-[calc(100%-9rem)] bg-neutral-950 transition-[top] duration-300 ease-in-out sm:left-[4.5rem]",
          {
            "top-full": !isOpen,
          },
        )}
      >
        <div className="h-full px-2 pb-1 pt-5 md:px-10">
          <div className="flex h-full flex-col items-center gap-y-10 md:flex-row md:gap-x-10">
            <div className="max-h-[50%] md:max-h-[unset] md:flex-[0.8] md:p-5">
              <Image
                height={800}
                width={800}
                src={currentSong.imageUrl}
                alt="song Image"
                className="mx-auto h-full w-auto"
              />
            </div>
            <div className="h-full w-full overflow-auto md:flex-1">
              <Tabs defaultValue="queue" className="flex h-full flex-col">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="queue">Queue</TabsTrigger>
                  <TabsTrigger value="lyrics">Lyrics</TabsTrigger>
                  <TabsTrigger value="similar">Similar</TabsTrigger>
                </TabsList>
                <TabsContent
                  value="queue"
                  className="overflow-auto rounded-xl bg-neutral-900 p-3"
                >
                  <div className="custom-scrollbar flex h-full flex-col overflow-y-scroll scroll-smooth">
                    {queue.map((song, i) => (
                      <SongCard song={song} index={i} key={song.id} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PlayerDrawer };
