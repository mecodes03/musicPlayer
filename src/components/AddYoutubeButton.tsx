"use client";

import { ClassValue } from "clsx";
import { Button, ButtonProps } from "./ui/button";
import { cn } from "@/lib/utils";

const AddYoutubeButton = ({
  className,
  variant = "secondary",
  size,
}: {
  variant?: ButtonProps["variant"];
  className?: ClassValue;
  size?: ButtonProps["size"];
}) => {
  return (
    <Button variant={variant} size={size} className={cn(className)}>
      connect youtube
    </Button>
  );
};

export { AddYoutubeButton };
