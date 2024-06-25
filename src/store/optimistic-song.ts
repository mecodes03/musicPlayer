"use client";

import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Song } from "@/types/song";

type PlayerStore = {
  spotifyOptimisticSong: Song | null;
  setSpotifyOptimisticSong: (song: Song | null) => void;
};

export const useSpotifyOptimisticSong = create<PlayerStore>()(
  persist<PlayerStore>(
    (set) => ({
      spotifyOptimisticSong: null,
      setSpotifyOptimisticSong: (spotifyOptimisticSong) =>
        set(() => ({ spotifyOptimisticSong: spotifyOptimisticSong })),
    }),
    {
      name: "spotify-optimistic-song",
      storage: createJSONStorage<PlayerStore>(() => localStorage),
    },
  ),
);
