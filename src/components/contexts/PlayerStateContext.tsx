"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import PlayerStates from "youtube-player/dist/constants/PlayerStates";

interface PlayerStateType {
  playerState: PlayerStates | undefined;
  setPlayerState: (state: PlayerStates | undefined) => void;
}

const PlayerStateContext = createContext<PlayerStateType | undefined>(
  undefined,
);

export const PlayerStateProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playbackState, setPlaybackState] = useState<
    PlayerStates | undefined
  >();

  const _setPlaybackState = React.useCallback(
    (state: PlayerStates | undefined) => {
      setPlaybackState(state);
    },
    [],
  );

  return (
    <PlayerStateContext.Provider
      value={{
        playerState: playbackState,
        setPlayerState: _setPlaybackState,
      }}
    >
      {children}
    </PlayerStateContext.Provider>
  );
};

export const usePlayerState = (): PlayerStateType => {
  const context = useContext(PlayerStateContext);
  if (!context) {
    throw new Error("useSong must be used within a SongProvider");
  }
  return context;
};
