import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Provider } from "@/types/provider";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import { Playlist } from "@/types/playlist";

interface YoutubePlaylistCardProps {
  playlist: Playlist;
}

const YoutubePlaylistCard = ({ playlist }: YoutubePlaylistCardProps) => {
  const { videos, playlistId, ownedBy, playlistTitle } = playlist;
  const imgCount = videos.length > 4 ? 4 : videos.length;

  if (!videos.length) return null;

  return (
    <div className="grid aspect-square max-w-40 space-y-3 transition-all duration-500 active:scale-95">
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/playlists/${playlist.playlistId}?provider=${Provider.YOUTUBE}`}
      >
        <MagicCardGradient>
          <div className="grid aspect-square grid-cols-2 grid-rows-2 overflow-hidden rounded-sm">
            {videos.slice(0, imgCount).map((video) => (
              <div key={video.id}>
                <Image
                  className="h-full w-full"
                  src={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                  height={Number(video.snippet.thumbnails.medium.height)}
                  width={Number(video.snippet.thumbnails.medium.height)}
                />
              </div>
            ))}
          </div>
        </MagicCardGradient>
      </Link>
      <div>
        <span>{playlistTitle}</span>
        <span className="text-sm">{ownedBy}</span>
      </div>
    </div>
  );
};

export default YoutubePlaylistCard;

export function MagicCardGradient({ children }: { children: ReactNode }) {
  return (
    <MagicContainer className="rounded-sm">
      <MagicCard
        borderwidth={2}
        className="flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),#ffaa40_0,rgba(156,64,255,0.2)_50%,transparent_100%)] p-[1px] shadow-md"
      >
        {children}
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      </MagicCard>
    </MagicContainer>
  );
}
