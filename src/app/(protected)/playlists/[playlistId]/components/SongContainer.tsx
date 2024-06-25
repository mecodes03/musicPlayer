"use client";

import React, { useEffect, useRef, useState } from "react";
import { TYoutubeVideo } from "@/types/youtube";
import { cn } from "@/lib/utils";
import { SpotifyPlaylistSong } from "@/types/spotify";
import { Provider } from "@/types/provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import FetchMorePlaylistItemsButton from "./FetchMorePlaylistItemsButton";
import {
  getMoreSpotifyPlaylistItems,
  getMoreYoutubePlaylistItems,
} from "@/actions/playlist.actions";
import { existingSpotifyToYoutube } from "@/actions/spotifyToYoutube.actions";
import SongCardWrapper from "./SongCardWrapper";
import { Clock3 } from "lucide-react";
import { Song } from "@/types/song";

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

type SongContainerProps =
  | {
      provider: Provider.SPOTIFY;
      songs: SpotifySong[];
      nextPageUrl: string;
    }
  | {
      provider: Provider.YOUTUBE;
      songs: TYoutubeVideo[];
      nextPageToken?: string;
    };

const SongContainer = (props: SongContainerProps) => {
  const [songs, setSongs] = useState(props.songs);

  const { data } = useQuery({
    queryKey: ["existing-spotify-2-youtube"],
    queryFn: async () => {
      if (props.provider === Provider.YOUTUBE) return null;
      const songIds = (songs as SpotifyPlaylistSong[]).map(
        (song) => song.track.id,
      );
      return await existingSpotifyToYoutube({ ids: songIds });
    },
    enabled: false,
  });

  useEffect(() => {
    console.log("songs:", songs);
  }, [songs]);

  const fieldsRef = useRef<HTMLDivElement | null>(null);

  const [shouldHaveBackground, setShouldHaveBackground] =
    useState<boolean>(false);

  useEffect(() => {
    if (!fieldsRef.current) return;
    (() => {
      const top = fieldsRef.current.getBoundingClientRect().top;
      if (top <= 64) {
        setShouldHaveBackground(true);
      } else {
        setShouldHaveBackground(false);
      }
    })();

    const handleScroll = (e: Event) => {
      if (!fieldsRef.current) return;
      const top = fieldsRef.current.getBoundingClientRect().top;
      if (top <= 64) {
        setShouldHaveBackground(true);
      } else {
        setShouldHaveBackground(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fieldsRef]);

  const { isPending, mutateAsync } = useMutation({
    mutationFn: async () => {
      const data =
        props.provider == Provider.SPOTIFY
          ? await getMoreSpotifyPlaylistItems({
              nextPageUrl: props.nextPageUrl,
            })
          : getMoreYoutubePlaylistItems();
      console.log(data);
      return data;
    },

    onSuccess: (data, contexts) => {
      console.log(data);
    },
  });

  if (!songs.length) {
    return (
      <h1 className="text-2xl font-semibold tracking-wide">
        No Songs Whatsoever
      </h1>
    );
  }

  async function fetchMore() {
    await mutateAsync();
  }

  return (
    <div className="relative flex flex-col gap-2">
      <div className="sticky top-16 z-[2]" ref={fieldsRef}>
        <div
          className={cn(
            "relative flex items-center gap-x-3 px-2 py-3 text-muted-foreground",
            {
              "mt-[1px] rounded-md bg-neutral-800 transition-[background-color] duration-300 after:absolute after:inset-0":
                shouldHaveBackground,
            },
          )}
        >
          <div className="flex w-10 items-center justify-center">
            <span className="w-10 text-center">#</span>
          </div>
          <div className="flex flex-1 gap-x-4">
            <span className="flex-[0.6]">
              song /{" "}
              {props.provider === Provider.SPOTIFY ? "artist" : "channel"}
            </span>
            <div className="flex flex-[0.4] items-center justify-end md:justify-between">
              <span className="hidden text-center md:flex">
                {props.provider === Provider.SPOTIFY ? "popularity" : "plays"}
              </span>
              <span className="mr-6 flex justify-center">
                <Clock3 className="h-4 w-4" />
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-4 flex flex-col last:after:border-0">
        {songs.map((song, i) => (
          <SongCardWrapper key={i} song={song} index={i + 1} />
        ))}
      </div>
      {props.provider === Provider.SPOTIFY && props.nextPageUrl ? (
        <FetchMorePlaylistItemsButton fn={() => "void"} isPending={false} />
      ) : props.provider === Provider.YOUTUBE && props.nextPageToken ? (
        <FetchMorePlaylistItemsButton fn={fetchMore} isPending={isPending} />
      ) : null}
    </div>
  );
};

export default SongContainer;
