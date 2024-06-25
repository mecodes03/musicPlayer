import { getGoogleAccount, getSpotifyAccount } from "@/helper/get-user";
import { NextRequest, NextResponse } from "next/server";
import { getGoogleAccessToken, getSpotifyAccessToken } from "@/lib/auth/utils";
import { GoogleUser, SpotifyUser } from "@/types/user";

type User = {
  google: GoogleUser | null;
  spotify: SpotifyUser | null;
};

export const GET = async (req: NextRequest) => {
  const googleAccessToken = getGoogleAccessToken();
  const spotifyAccessToken = getSpotifyAccessToken();

  try {
    let user: User = {
      spotify: null,
      google: null,
    };

    if (spotifyAccessToken) {
      user.spotify = (await getSpotifyAccount(spotifyAccessToken)).user;
    }

    if (googleAccessToken) {
      user.google = (await getGoogleAccount(googleAccessToken)).user;
    }

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
};
