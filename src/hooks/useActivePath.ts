"use client";

import { usePathname } from "next/navigation";

export function useActiveRoutePath(): (path: string) => boolean {
  const pathname = usePathname();

  /**
   * Supported Patterns
   *
   * isActivePath('/foo')
   * isActivePath('foo')
   * isActivePath('foo/*')
   * isActivePath('foo/**')
   * isActivePath('foo/bar')
   * isActivePath('foo/bar/*')
   */
  const isPathActive = (path: string) => {
    if (!path.startsWith("/")) {
      path = "/" + path;
    }

    if (path.endsWith("/*")) return matchForSingleSegmentWildcard(path);

    if (path.endsWith("/**")) return matchForMultiSegmentWildcard(path);

    return path == pathname;
  };

  /**
   * isActivePath('foo/*')
   * isActivePath('foo/bar/*')
   */
  const matchForSingleSegmentWildcard = (path: string) => {
    const segment = path.slice(0, -2); // Remove '/*' from the end

    if (!pathname.startsWith(segment)) return false;

    const remainingPathSegment = pathname.slice(segment.length).slice(1); // Remove mentioned path and trim leading '/'

    return remainingPathSegment !== "" && !remainingPathSegment.includes("/");
  };

  /**
   * isActivePath('foo/**')
   * isActivePath('foo/bar/**')
   */
  const matchForMultiSegmentWildcard = (path: string) => {
    const segment = path.slice(0, -3); // Remove '/**' from the end
    console.log(segment);
    return pathname.startsWith(segment);
  };

  return isPathActive;
}
