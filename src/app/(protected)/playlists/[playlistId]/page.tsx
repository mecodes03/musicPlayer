import { Provider } from "@/types/provider";
import { redirect } from "next/navigation";
import RefreshAccessToken from "../../(components)/RefreshAccessToken";
import { getPlaylist } from "@/helper/youtube";
import Image from "next/image";
import SongContainer from "./components/SongContainer";
import {
  isGoogleAuthenticated,
  isSpotifyAuthenticated,
} from "@/lib/auth/utils";
import { getSpotifyPlaylist } from "@/data/spotify-data";
import { MagicCardGradient } from "../(components)/SpotifyPlaylistCard";
import AddSpotifyButton from "@/components/AddSpotifyButton";
import Link from "next/link";
import { ReactNode } from "react";
import { TYoutubeVideo } from "@/types/youtube";
import { SpotifyPlaylistSong } from "@/types/spotify";
import PlaylistButtons from "./components/PlaylistButtons";
import { Song } from "@/types/song";

interface PageProps {
  params: {
    playlistId: string;
  };
  searchParams: {
    provider: Provider | undefined;
  };
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { playlistId } = params,
    { provider } = searchParams;

  if (!playlistId || !provider) {
    redirect("/playlists");
  }

  if (provider === Provider.SPOTIFY) {
    const isAuth = await isSpotifyAuthenticated();
    if (!isAuth) {
      return <AddSpotifyButton />;
    }

    const response = await getSpotifyPlaylist({ id: playlistId });
    console.log(response);

    if (!response.success) {
      return <div>Some Error Occured</div>;
    }

    const { tracks, images, name, description, href, owner } = response.data;

    return (
      <PlaylistWrapper>
        <PlaylistTopSection
          images={images[1]}
          title={name}
          url={href}
          description={description}
          owner={owner.display_name}
          itemCount={tracks.total}
          publishedAt={""}
          privacy="string"
          playlistItems={tracks.items}
          playlistId={playlistId}
        />
        <div className="w-full">
          <SongContainer
            nextPageUrl={tracks.next}
            provider={Provider.SPOTIFY}
            songs={tracks.items}
          />
        </div>
      </PlaylistWrapper>
    );
  } else {
    if (!(await isGoogleAuthenticated()))
      return (
        <RefreshAccessToken
          provider={Provider["YOUTUBE"]}
          revalidatingTag="youtube-user-info"
        />
      );

    const response = await getPlaylist(playlistId, 20);

    if (!response.success) {
      return <div>{response.error}</div>;
    }

    const {
      items,
      nextPageToken,
      channelTitle,
      playlistTitle,
      publishedAt,
      itemCount,
      privacyStatus,
    } = response.data;

    const images = items.slice(0, 4).map((item) => {
      return item.snippet.thumbnails.medium;
    });

    const removedDuplicates = (items: TYoutubeVideo[]) => {
      const songsIdHashMap = new Map<string, boolean>();
      const songs: TYoutubeVideo[] = [];
      for (const item of items) {
        if (songsIdHashMap.has(item.id)) continue;
        songsIdHashMap.set(item.id, true);
        songs.push(item);
      }
      return songs;
    };

    const songs = removedDuplicates(items);

    return (
      <PlaylistWrapper>
        <PlaylistTopSection
          images={images}
          title={playlistTitle}
          url={`https://music.youtube.com/playlist?list=${playlistId}`}
          description={""}
          owner={channelTitle}
          itemCount={itemCount}
          publishedAt={publishedAt}
          privacy={privacyStatus}
          playlistItems={songs}
          playlistId={playlistId}
        />
        <SongContainer
          provider={Provider.YOUTUBE}
          nextPageToken={nextPageToken ?? undefined}
          songs={songs}
        />
      </PlaylistWrapper>
    );
  }
};

export default Page;

const PlaylistWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-3 px-3 py-8 md:space-y-6">
      {children}
    </div>
  );
};

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

const PlaylistTopSection = ({
  images,
  title,
  url,
  owner,
  itemCount,
  privacy,
  playlistItems,
  playlistId,
}: {
  title: string;
  url: string;
  images:
    | { url: string; height: number; width: number }
    | { url: string; height: number; width: number }[];
  description: string;
  owner: string;
  itemCount: number;
  publishedAt: string;
  privacy: string;
  playlistItems: TYoutubeVideo[] | SpotifySong[];
  playlistId: string;
}) => {
  const imgCount = Array.isArray(images) && images.length >= 4 ? 4 : 1;

  return (
    <div className="grid w-fit grid-cols-[auto_auto] gap-x-5 gap-y-4 md:gap-x-10 md:gap-y-0">
      <div className="row-span-2 w-min overflow-hidden">
        <MagicCardGradient>
          {Array.isArray(images) ? (
            <div className="grid aspect-square h-32 grid-cols-2 grid-rows-2 overflow-hidden rounded-sm sm:h-40 md:h-60">
              {images.slice(0, imgCount).map((image) => (
                <div key={image.url}>
                  <Image
                    className="h-full w-full"
                    src={image.url}
                    alt={""}
                    height={200}
                    width={200}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid aspect-square h-32 overflow-hidden sm:h-40 md:h-60">
              <Image
                className="h-full w-full"
                src={images.url}
                alt={"playlist-image"}
                height={200}
                width={200}
              />
            </div>
          )}
        </MagicCardGradient>
      </div>
      <div className="row-span-2 flex h-fit w-fit flex-col space-y-2 md:row-span-1 md:items-start">
        <h1 className="text-wrap text-2xl font-bold sm:text-4xl md:text-6xl">
          {title}
        </h1>
        <div className="flex flex-col truncate text-muted-foreground">
          <h2 className="gap-x-3 text-muted-foreground md:text-lg">
            <span>{privacy}</span>
            <span className="mx-2 mb-0.5 inline-block h-1.5 w-1.5 rounded-full bg-neutral-400" />
            <span>{owner}</span>
          </h2>
          <span className="text-muted-foreground">{itemCount} tracks</span>
          <Link
            href={url}
            className="text-sm tracking-wider underline underline-offset-1"
          >
            play on youtube
          </Link>
        </div>
      </div>
      <div className="col-span-2 mt-2 flex h-fit w-fit items-center gap-x-2 md:col-span-1">
        <PlaylistButtons playlistId={playlistId} songs={playlistItems} />
      </div>
    </div>
  );
};
