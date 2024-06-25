import { Provider } from "./provider";

export type Song = {
  id: string;
  songTitle: string;
  artistOrChannel: string;
  imageUrl: string;
  songDuration: string;
  onHoverTitle: string;
} & (
  | {
      provider: Provider.SPOTIFY;
      popularity: number;
    }
  | {
      provider: Provider.YOUTUBE;
      likesCount: string;
      viewsCount: string;
    }
);
