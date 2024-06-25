import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  SPOTIFY_ACCESS_TOKEN_COOKIE_KEY,
  SPOTIFY_AUTH_STATE_COOKIE_KEY,
  SPOTIFY_REFRESH_TOKEN_COOKIE_KEY,
} from "@/constants";
import { spotify } from "@/lib/auth/oauth";
import { db } from "@/lib/db";
import { oauthAccount } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getSpotifyAccount } from "@/helper/get-user";
import { OAuth2RequestError } from "oslo/oauth2";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const codeVerifier = searchParams.get("code") || null;
  const state = searchParams.get("state") || null;

  if (!codeVerifier || !state) {
    console.log("something is missing.");
    return Response.json(
      { error: "Invalid request" },
      {
        status: 400,
      }
    );
  }

  const savedState = cookies().get(SPOTIFY_AUTH_STATE_COOKIE_KEY)?.value;

  if (!savedState || !codeVerifier) {
    return Response.json(
      { error: "CodeVerifier or saved state does not exists" },
      {
        status: 400,
      }
    );
  }

  if (savedState !== state) {
    return Response.json(
      {
        error: "State does not match",
      },
      {
        status: 400,
      }
    );
  }

  cookies().delete(SPOTIFY_AUTH_STATE_COOKIE_KEY);

  try {
    const { accessToken, accessTokenExpiresAt, refreshToken } =
      await spotify.validateAuthorizationCode(codeVerifier);

    const { user: spotify_account } = await getSpotifyAccount(accessToken);
    if (!spotify_account) {
      return NextResponse.redirect(
        new URL("/login", `${process.env.NEXT_PUBLIC_BASE_URL}`),
        {
          status: 302,
        }
      );
    }

    const oauth = await db
      .select()
      .from(oauthAccount)
      .where((table) =>
        and(
          eq(table.providerUserId, spotify_account.id),
          eq(table.provider, "spotify")
        )
      );

    if (oauth.length > 0) {
      db.update(oauthAccount)
        .set({ accessTokenExpiresAt: accessTokenExpiresAt })
        .where(eq(oauthAccount.providerUserId, spotify_account.id));
    } else {
      db.insert(oauthAccount).values({
        accessTokenExpiresAt: accessTokenExpiresAt,
        provider: "spotify",
        providerUserId: spotify_account.id,
      });
    }

    cookies().set(SPOTIFY_ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      httpOnly: true,
      expires: accessTokenExpiresAt,
    });

    cookies().set(SPOTIFY_REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });

    return NextResponse.redirect(
      new URL("/playlists", `${process.env.NEXT_PUBLIC_BASE_URL}`),
      {
        status: 302,
      }
    );
  } catch (error: any) {
    console.log("some error accured.");
    console.log(error);

    if (error instanceof OAuth2RequestError) {
      console.log("oauth related error");
      return NextResponse.redirect(
        new URL("/login", `${process.env.NEXT_PUBLIC_BASE_URL}`),
        {
          status: 302,
        }
      );
    }

    return NextResponse.redirect(
      new URL("/login", `${process.env.NEXT_PUBLIC_BASE_URL}`),
      {
        status: 302,
      }
    );
  }
}
