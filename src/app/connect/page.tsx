"use client";

import React from "react";
import {
  createSpotifyOauthAuthorizationUrl,
  createYoutubeOauthAuthorizationUrl,
} from "@/actions/auth.action";
import { Button } from "@/components/ui/button";

const page = () => {
  async function handleGoogleAuth() {
    console.log("handling redirection.");
    const result = await createYoutubeOauthAuthorizationUrl();
    if (!result.success) {
      console.log("oauth failed");
      console.log(result.error);
      return;
    }
    window.location.href = result.data.toString();
  }

  async function handleSpotifyOauth() {
    console.log("spofity handling");
    const result = await createSpotifyOauthAuthorizationUrl();

    if (!result.success) {
      console.log("oauth failed");
      console.log(result.error);
      return;
    }
    window.location.href = result.data.toString();
  }

  return (
    <div className="container">
      <Button onClick={handleGoogleAuth}>connect youtube</Button>
      <Button onClick={handleSpotifyOauth}>CONNECT SPOTIFY</Button>
    </div>
  );
};

export default page;
