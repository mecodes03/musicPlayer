"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface FetchMorePlaylistItemsButtonProps {
  isPending: boolean;
  fn: () => void;
}

const FetchMorePlaylistItemsButton = ({
  isPending,
  fn,
}: FetchMorePlaylistItemsButtonProps) => {
  return (
    <Button disabled={isPending} onClick={fn}>
      fetch more
    </Button>
  );
};

export default FetchMorePlaylistItemsButton;
