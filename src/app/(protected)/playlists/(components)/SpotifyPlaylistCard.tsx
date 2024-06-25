import React, { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Provider } from "@/types/provider";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import { TSpotifyPlaylistsItem } from "@/types/spotify";

interface SpotifyPlaylistCardProps {
  playlist: TSpotifyPlaylistsItem;
}

const SpotifyPlaylistCard = ({ playlist }: SpotifyPlaylistCardProps) => {
  const { id, images, name, owner, tracks } = playlist;
  const { height, url, width } = images[0];

  return (
    <div className="aspect-square max-w-40 grid space-y-3 active:scale-95 transition-all duration-500">
      <Link
        href={`${process.env.NEXT_PUBLIC_BASE_URL}/playlists/${id}?provider=${Provider.SPOTIFY}`}
      >
        <MagicCardGradient>
          <div className="rounded-sm overflow-hidden grid aspect-square">
            <Image
              className="h-full w-full"
              src={images[0].url}
              alt={name}
              height={height}
              width={height}
            />
          </div>
        </MagicCardGradient>
      </Link>
      <div className="grid">
        <span>{name}</span>
        <span className="text-sm">{owner.display_name}</span>
      </div>
    </div>
  );
};

export default SpotifyPlaylistCard;

export function MagicCardGradient({ children }: { children: ReactNode }) {
  return (
    <MagicContainer className="rounded-sm overflow-hidden w-fit h-fit">
      <MagicCard
        borderwidth={2}
        className="rounded-sm flex w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-[radial-gradient(var(--mask-size)_circle_at_var(--mouse-x)_var(--mouse-y),#ffaa40_0,rgba(156,64,255,0.2)_50%,transparent_100%)] p-[1px] shadow-md"
      >
        {children}
        <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.05),rgba(255,255,255,0))]" />
      </MagicCard>
    </MagicContainer>
  );
}
