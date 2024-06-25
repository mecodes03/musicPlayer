import { isGoogleAuthenticated } from "@/lib/auth/utils";
import { currentUserYoutubePlaylists } from "../(data)/getData";
import YoutubePlaylists from "./YoutubePlaylists";
import { AddYoutubeButton } from "@/components/AddYoutubeButton";

const YoutubePlaylistsWrapper = async () => {
  if (!(await isGoogleAuthenticated())) return <AddYoutubeButton />;

  const playlistResponse = await currentUserYoutubePlaylists(50);
  // console.log(playlistResponse);

  if (!playlistResponse.success) {
    return <div>failed to get playlists</div>;
  }
  console.log(playlistResponse.nextPageToken);

  return (
    <YoutubePlaylists
      initialPlaylists={playlistResponse.playlists}
      nextPageToken={playlistResponse.nextPageToken}
    />
  );
};

export { YoutubePlaylistsWrapper };
