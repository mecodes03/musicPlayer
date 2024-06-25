export type TSpotifyPlaylists = {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: TSpotifyPlaylistsItem[];
};

export interface TSpotifyPlaylistsItem {
  collaborative: boolean;
  description: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  id: string;
  images: [{ url: string; height: number; width: number }];
  name: string;
  owner: {
    display_name: string;
  };
  public: boolean;
  tracks: {
    href: string;
    total: number;
  };
  type: string;
  uri: string;
}

export interface TSpotifyPlaylist {
  description: string;
  images: { url: string; height: number; width: number }[];
  name: string;
  href: string;
  owner: { href: string; display_name: string };
  tracks: {
    next: string;
    total: number;
    items: SpotifyPlaylistSong[];
  };
}

export interface SpotifyPlaylistSong {
  added_at: string;
  track: {
    album: {
      total_tracks: number;
      href: string;
      id: string;
      images: {
        url: string;
        height: number;
        width: number;
      }[];
      name: string;
      release_date: string;
      artists: {
        href: string;
        id: string;
        name: string;
      }[];
    };
    artists: {
      href: string;
      id: string;
      images: [
        {
          url: string;
          height: number;
          width: number;
        },
      ];
      name: string;
    }[];
    duration_ms: 0;
    href: string;
    id: string;
    name: string;
    popularity: number;
    preview_url: string;
  };
}
