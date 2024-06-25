"use client";

import debounce from "lodash.debounce";
import React from "react";

export const useDebounce = (callback: () => void, t: number) => {
  const ref = React.useRef<() => void>();

  React.useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = React.useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return debounce(func, t);
  }, [t]);

  return debouncedCallback;
};
