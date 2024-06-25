"use client";

import { Provider } from "@/types/provider";
import { Song } from "@/types/song";
import { TYoutubeVideo } from "@/types/youtube";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

enum PlaybackType {
  SHUFFLE = "shuffle",
  SEQUENCE = "sequence",
}

type PlayerStore = {
  playingPlaylist: { id: string; songs: Song[] } | null;
  setPlayingPlaylist: (id: string, items: Song[]) => void;
  currentPagePlaylist: { id: string; items: Song[] } | null;
  setCurrentPagePlaylist: (id: string, items: Song[]) => void;
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  queue: Song[]; // the playing queue
  setQueue: (items: Song[]) => void;
  remove: (song: Song) => void;
  enque: (song: Song) => void;
  deque: () => Song | undefined;
  playNext: () => boolean;
  playPrevious: () => void;
  playeBackType: PlaybackType;
  setPlayBackType: (PlaybackType: PlaybackType) => void;
};

export const usePlayerStore = create<PlayerStore>()(
  persist<PlayerStore>(
    (set, get) => ({
      playingPlaylist: null,
      setPlayingPlaylist: (id: string, songs: Song[]) =>
        set(() => ({ playingPlaylist: { id, songs } })),
      currentPagePlaylist: null,
      setCurrentPagePlaylist(id, items) {
        set({ currentPagePlaylist: { id, items } });
      },
      currentSong: null,
      setCurrentSong: (song) => set(() => ({ currentSong: song })),
      queue: [],
      setQueue: (items) => set(() => ({ queue: items })),
      remove: (song) =>
        set(({ queue }) => ({
          queue: queue.filter((_song) => _song.id !== song.id),
        })),
      enque: (song) => set(({ queue }) => ({ queue: [...queue, song] })),
      deque: () => {
        const tempQueue = get().queue;
        const item = tempQueue.shift();
        set(() => ({ queue: tempQueue }));
        return item;
      },
      playPrevious: () => {
        const currentSong = get().currentSong;
        const queue = get().queue;
        if (!currentSong || queue.length < 2) return false;
        const previousSongIndex =
          queue.findIndex((song) => song.id === currentSong.id) - 1;
        if (previousSongIndex < 0) return false;
        set({ currentSong: queue[previousSongIndex] });
        return true;
      },
      playNext: () => {
        const currentSong = get().currentSong;
        const queue = get().queue;
        if (!currentSong || queue.length < 2) return false;
        const nextSongIndex =
          queue.findIndex((song) => song.id === currentSong.id) + 1;
        if (nextSongIndex >= queue.length) return false;
        set({ currentSong: queue[nextSongIndex] });
        return true;
      },
      playeBackType: PlaybackType.SEQUENCE,
      setPlayBackType: (playbackType: PlaybackType) =>
        set({ playeBackType: playbackType }),
    }),
    {
      name: "player-store", // name of the item in the storage (must be unique)
      storage: createJSONStorage<PlayerStore>(() => localStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
