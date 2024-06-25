"use client";

import {
  refreshSpotifyAccessToken,
  refreshYoutubeAccessToken,
} from "@/actions/auth.action";
import {
  serverRevalidatePath,
  serverRevalidateTag,
} from "@/actions/revalidate.actions";
import AddSpotifyButton from "@/components/AddSpotifyButton";
import { AddYoutubeButton } from "@/components/AddYoutubeButton";
import { Provider } from "@/types/provider";
import { useEffect, useState } from "react";

interface RefreshAccessTokenProps {
  revalidatingTag?: string;
  revalidatingPath?: string;
  provider: Provider;
}

const RefreshAccessToken = ({
  provider,
  revalidatingPath,
  revalidatingTag,
}: RefreshAccessTokenProps) => {
  const [success, setSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      console.log("refreshingToken...");

      const { success: _success } =
        provider == Provider.SPOTIFY
          ? await refreshSpotifyAccessToken()
          : await refreshYoutubeAccessToken();

      setSuccess(_success);

      if (_success && revalidatingTag) {
        console.log(_success);
        console.log("revalidating the tag", revalidatingTag);
        serverRevalidateTag(revalidatingTag);
      }

      if (_success && revalidatingPath) {
        serverRevalidatePath(revalidatingPath);
      }

      if (!_success) {
        console.log("failed in refreshing the token");
      }
    })();
  }, [provider, revalidatingTag, revalidatingPath]);

  if (success) {
    return null;
  }

  console.log(provider, revalidatingTag, success);

  return provider === Provider.SPOTIFY ? (
    <AddSpotifyButton />
  ) : (
    <AddYoutubeButton />
  );
};

export default RefreshAccessToken;
