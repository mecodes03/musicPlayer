enum SpotifyUserAccountTier {
  FREE = "free",
  PREMIUM = "premium",
}

export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name?: string;
  picture: string;
  locale: string;
}

export type User = {
  spotify: SpotifyUser | null;
  google: GoogleUser | null;
};

export type SpotifyUser = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: { filter_enabled: false; filter_locked: false };
  external_urls: { spotify: string };
  followers: { href: string; total: number };
  href: string;
  id: string;
  images: {
    url: string;
    height: number;
    width: number;
  }[];
  product: string;
  type: string;
  uri: string;
};
