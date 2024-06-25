import AddSpotifyButton from "@/components/AddSpotifyButton";
import { getCurrentUserSpotifyPlaylists } from "@/data/spotify-data";
import SpotifyPlaylists from "./SpotifyPlaylists";
import { getCurrentSpotifyAccount } from "@/lib/auth/utils";

const SpotifyPlaylistsWrapper = async () => {
  const { user } = await getCurrentSpotifyAccount();
  if (!user) {
    return <AddSpotifyButton />;
  }
  
  const playlists = await getCurrentUserSpotifyPlaylists();
  // console.log(playlists);
  if (!playlists || !playlists.data) {
    return <div>Some error occured.</div>;
  }
  return <SpotifyPlaylists initialPlaylists={playlists.data} />;
};

export { SpotifyPlaylistsWrapper };
