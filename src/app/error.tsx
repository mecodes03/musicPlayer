"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="w-full flex flex-col h-full py-20 px-5 rounded-lg bg-neutral-800">
      <h2 className="text-3xl ">Something went wrongy!</h2>
      <p className="text-lg">{error.message}</p>
      <Button variant={"outline"} size={"lg"} onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
