'use client'

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import React from "react";

interface FetchMoreButtonProps {
  fetchFunction: () => void;
  isLoading: boolean;
}

const FetchMoreButton = ({
  fetchFunction,
  isLoading,
}: FetchMoreButtonProps) => {
  return (
    <Button
      onClick={fetchFunction}
      variant={"outline"}
      className="w-fit p-4 px-10 flex items-center justify-center mt-10"
    >
      {isLoading ? (
        <Loader2 className="animate-spin repeat-infinite" />
      ) : (
        <span>Fetch More</span>
      )}
    </Button>
  );
};

export default FetchMoreButton;
