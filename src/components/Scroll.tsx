"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type TScrollBorderContext = {
  isVisible: boolean;
  visible: (visible: boolean) => void;
};

export const ScrollBorderContext = React.createContext<TScrollBorderContext>({
  visible: () => null,
  isVisible: false,
});

export const ScrollBorderContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isBorderVisible, setIsBorderVisible] = React.useState<boolean>(false);

  const changeVisibility = React.useCallback((visible: boolean) => {
    setIsBorderVisible(visible);
  }, []);

  return (
    <ScrollBorderContext.Provider
      value={{
        isVisible: isBorderVisible,
        visible: changeVisibility,
      }}
    >
      {children}
    </ScrollBorderContext.Provider>
  );
};

interface ScrollProps {
  className?: ClassValue;
}

const Scroll = ({ className }: ScrollProps) => {
  const { isVisible, visible } = React.useContext(ScrollBorderContext);

  React.useEffect(() => {
    const handleScroll = (e: Event) => {
      if (window.scrollY > 20) {
        visible(true);
      } else {
        visible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
  }, [visible]);

  return (
    <div
      className={cn(
        `transition-[background-color]`,
        { "bg-neutral-800": isVisible },
        className,
      )}
      aria-disabled
    />
  );
};

export default Scroll;
