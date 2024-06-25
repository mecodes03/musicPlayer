import { Suspense } from "react";
import { SpotifyPlaylistsWrapper } from "./(components)/SpotifyPlaylistsWrapper";
import { YoutubePlaylistsWrapper } from "./(components)/YoutubePlaylistsWrapper";
import { ErrorPlaylists } from "./(components)/ErrorPlaylists";
import { Provider } from "@/types/provider";

interface PageProps {}

const Playlists = async ({}: PageProps) => {
  return (
    <div className="mx-auto max-w-7xl pt-6 px-4">
      <div className="grid space-y-8 mb-10">
        <h1 className="text-2xl font-bold tracking-wide">Spotify Playlists</h1>
        <ErrorPlaylists provider={Provider.SPOTIFY}>
          <Suspense fallback={<p>Fetching Spotify playlists</p>}>
            <SpotifyPlaylistsWrapper />
          </Suspense>
        </ErrorPlaylists>
      </div>

      <div className="grid space-y-8">
        <h1 className="text-2xl font-bold tracking-wide">Youtube Playlists</h1>
        <ErrorPlaylists provider={Provider.YOUTUBE}>
          <Suspense fallback={<p>Fetching Youtube playlists</p>}>
            <YoutubePlaylistsWrapper />
          </Suspense>
        </ErrorPlaylists>
      </div>
    </div>
  );
};

export default Playlists;
