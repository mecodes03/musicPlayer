"use server";

import {
  GOOGLE_ACCESS_TOKEN_COOKIE_KEY,
  GOOGLE_AUTH_STATE_COOKIE_KEY,
  GOOGLE_CODE_VERIFIER_COOKIE_KEY,
  GOOGLE_REFRESH_TOKEN_COOKIE_KEY,
  SPOTIFY_ACCESS_TOKEN_COOKIE_KEY,
  SPOTIFY_AUTH_STATE_COOKIE_KEY,
  SPOTIFY_REFRESH_TOKEN_COOKIE_KEY,
  SPOTIFY_SCOPES,
  YOUTUBE_SCOPES,
} from "@/constants";
import { getGoogleAccount, getSpotifyAccount } from "@/helper/get-user";
import { db } from "@/lib/db";
import { google, spotify } from "@/lib/auth/oauth";
import { generateCodeVerifier, generateState } from "arctic";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { oauthAccount } from "@/lib/db/schema";
import { getSpotifyRefreshToken } from "@/lib/auth/utils";

type ReturnType =
  | { success: true; data: URL }
  | { success: false; error: string };

export async function createYoutubeOauthAuthorizationUrl(): Promise<ReturnType> {
  try {
    const state = generateState();
    const codeVerifier = generateCodeVerifier();

    cookies().set(GOOGLE_CODE_VERIFIER_COOKIE_KEY, codeVerifier, {
      httpOnly: true,
    });

    cookies().set(GOOGLE_AUTH_STATE_COOKIE_KEY, state, {
      httpOnly: true,
    });

    const authorizationURL = await google.createAuthorizationURL(
      state,
      codeVerifier,
      {
        scopes: YOUTUBE_SCOPES,
      }
    );

    authorizationURL.searchParams.set("access_type", "offline");

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error?.message,
    };
  }
}

export async function createSpotifyOauthAuthorizationUrl(): Promise<ReturnType> {
  try {
    const state = generateState();

    cookies().set(SPOTIFY_AUTH_STATE_COOKIE_KEY, state, {
      httpOnly: true,
    });

    const authorizationURL = await spotify.createAuthorizationURL(state, {
      scopes: SPOTIFY_SCOPES,
    });

    return {
      success: true,
      data: authorizationURL,
    };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: error.message,
    };
  }
}

export async function refreshSpotifyAccessToken(): Promise<
  | {
      success: false;
      error: string | "refresh_token_not_found";
    }
  | { success: true; accessTokenExpiresAt: Date }
> {
  try {
    const refreshToken = getSpotifyRefreshToken();

    if (!refreshToken) {
      console.log("refresh_token_not_found");
      return { success: false, error: "refresh_token_not_found" };
    }

    console.log("refreshing spotify access token");

    const {
      accessToken: newAT,
      refreshToken: newRT,
      accessTokenExpiresAt,
    } = await spotify.refreshAccessToken(refreshToken);

    console.log(refreshToken);

    const { user } = await getSpotifyAccount(newAT);
    if (!user) {
      return {
        success: false,
        error: "spotify user not found",
      };
    }

    console.log("");

    const expires_at = new Date(accessTokenExpiresAt);

    await db
      .update(oauthAccount)
      .set({ accessTokenExpiresAt: expires_at }) // TODO: to make it logical ( expires_in ).
      .where(
        and(
          eq(oauthAccount.providerUserId, user.id),
          eq(oauthAccount.provider, "youtube")
        )
      );

    cookies().set(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY, newAT, {
      httpOnly: true,
      expires: accessTokenExpiresAt,
    });

    cookies().set(SPOTIFY_REFRESH_TOKEN_COOKIE_KEY, newRT ?? refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return { success: true, accessTokenExpiresAt: expires_at };
  } catch (error: any) {
    console.log("error_while_refreshing_spotify", error.message);
    console.log(error);
    return { success: false, error: error.message };
  }
}

export async function refreshYoutubeAccessToken(): Promise<
  | {
      success: false;
      error: string | "refresh_token_not_found";
    }
  | { success: true; accessTokenExpiresAt: Date }
> {
  const refreshToken = cookies().get(GOOGLE_REFRESH_TOKEN_COOKIE_KEY)?.value;
  console.log(refreshToken);

  if (!refreshToken) {
    console.log("no refresh token provided.");
    return { success: false, error: "refresh_token_not_found" };
  }

  try {
    const { accessToken, accessTokenExpiresAt } =
      await google.refreshAccessToken(refreshToken);
    const { user } = await getGoogleAccount(accessToken);
    if (!user) {
      return {
        success: false,
        error: "user_not_found",
      };
    }

    await db
      .update(oauthAccount)
      .set({ accessTokenExpiresAt })
      .where(
        and(
          eq(oauthAccount.providerUserId, user.id),
          eq(oauthAccount.provider, "youtube")
        )
      );

    cookies().set(GOOGLE_ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      expires: accessTokenExpiresAt,
      httpOnly: true,
    });

    return { success: true, accessTokenExpiresAt: accessTokenExpiresAt };
  } catch (error: any) {
    console.log("error_while_refreshing", error.message);
    return { success: false, error: error.message };
  }
}

export async function getTokens() {
  console.log(cookies().get(GOOGLE_ACCESS_TOKEN_COOKIE_KEY));
  return {
    youtubeAccessToken: cookies().get(GOOGLE_ACCESS_TOKEN_COOKIE_KEY)?.value,
    spotifyAccessToken: cookies().get(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY)?.value,
  };
}
