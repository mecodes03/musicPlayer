"use client";

import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import React, { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import AddSpotifyButton from "@/components/AddSpotifyButton";
import { AddYoutubeButton } from "@/components/AddYoutubeButton";
import { Provider } from "@/types/provider";
import { Button } from "@/components/ui/button";

const ErrorPlaylists = ({
  children,
  provider,
}: {
  children: ReactNode;
  provider: Provider;
}) => {
  return (
    <ErrorBoundary
      errorComponent={({
        error,
        reset,
      }: {
        error: Error;
        reset: () => void;
      }) => (
        <CustomErrorBoundary provider={provider} error={error} reset={reset} />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export { ErrorPlaylists };

interface CustomErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
  provider: Provider;
}

function CustomErrorBoundary({
  error,
  reset,
  provider,
}: CustomErrorBoundaryProps) {
  const [isUserNotFoundError, setIsUserNotFoundError] = React.useState<
    boolean | null
  >(true);

  // useEffect(() => {
  //   (async () => {
  //     const result =
  //       provider == Provider.YOUTUBE
  //         ? await refreshYoutubeAccessToken()
  //         : await refreshSpotifyAccessToken();

  //     if (result.success) return reset();
  //     if (result.error === "refresh_token_not_found")
  //       return setIsUserNotFoundError(true);
  //     error.message = result.error;
  //     setIsUserNotFoundError(false);
  //   })();
  // }, [error, reset, provider]);

  // console.log(isUserNotFoundError);

  if (isUserNotFoundError === null)
    return (
      <div className="grid w-full place-items-center">
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400 repeat-infinite" />
      </div>
    );

  return (
    <>
      {isUserNotFoundError ? (
        provider === Provider.SPOTIFY ? (
          <AddSpotifyButton className="w-full" variant={"default"} />
        ) : (
          <AddYoutubeButton className="w-full" variant={"default"} />
        )
      ) : (
        <div className="grid rounded-sm bg-neutral-900 p-5">
          <div className="grid gap-y-5">
            <p>{error.message}</p>
            <div className="flex items-center gap-x-5">
              <Button variant={"outline"} onClick={() => reset()}>
                try again
              </Button>
              <Button variant={"secondary"}>back to homepage</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
