"use client";

import React from "react";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = React.useState<number>(0);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setScreenSize(window.innerWidth);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize < 640
    ? "sm"
    : screenSize < 768
      ? "md"
      : screenSize < 1024
        ? "lg"
        : screenSize < 1280
          ? "xl"
          : null;
};

export { useScreenSize };
