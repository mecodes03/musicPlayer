import { Provider } from "./provider";
import { TYoutubeVideo } from "./youtube";

export type Playlist = {
  playlistTitle: string;
  ownedBy: string;
  playlistId: string;
  nextPageToken: string | null;
  videos: TYoutubeVideo[];
};

export type TPlaylist = {
  id: string;
  name: string;
  owner: string;
  link: string;
  total: number;
  description: string;
  provider: Provider;
  items: TPlaylistItem[];
};

type TPlaylistItem = {
  id: string;
  name: string;
  duration: number;
  images: {
    high: {
      url: string;
      height: number;
      width: number;
    };
    medium: { url: string; height: number; width: number };
    small: { url: string; height: number; width: number };
  };
  artists: [{ name: string; id: string }];
  popularity: number;
  added_at: string;
  release_date: string;
};
