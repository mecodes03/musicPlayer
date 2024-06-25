import { Google, Spotify } from "arctic";

const google = new Google(
  process.env.GOOGLE_CLIENT_ID as string,
  process.env.GOOGLE_CLIENT_SECRET as string,
  process.env.GOOGLE_REDIRECT_URI as string
);

const spotify = new Spotify(
  process.env.SPOTIFY_CLIENT_ID as string,
  process.env.SPOTIFY_CLIENT_SECRET as string,
  process.env.SPOTIFY_REDIRECT_URI as string
);

export { google,spotify };
