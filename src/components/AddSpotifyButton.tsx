"use client";

import { Button, ButtonProps } from "./ui/button";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

const AddSpotifyButton = ({
  variant,
  className,
  size,
}: {
  variant?: ButtonProps["variant"];
  className?: ClassValue;
  size?: ButtonProps["size"];
}) => {
  return (
    <Button size={size} className={cn(className)} variant={variant}>
      Connect Spotify
    </Button>
  );
};

export default AddSpotifyButton;
