"use client"; // Error components must be Client Components

import { refreshSpotifyAccessToken } from "@/actions/auth.action";
import { serverRevalidateTag } from "@/actions/revalidate.actions";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      if (error.message == "TOKEN_EXPIRED") {
        console.log("unauthorized");
        if ((await refreshSpotifyAccessToken()).success) {
          console.log("youtubeTokenSuccess");
          revalidatePath("/playists", "page");
          serverRevalidateTag("spotify-user-info");
        } else {
          router.push("/login");
        }
      }
    })();
  }, [error, router]);

  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
