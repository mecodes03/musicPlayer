import {
  GOOGLE_ACCESS_TOKEN_COOKIE_KEY,
  GOOGLE_AUTH_STATE_COOKIE_KEY,
  GOOGLE_CODE_VERIFIER_COOKIE_KEY,
  GOOGLE_REFRESH_TOKEN_COOKIE_KEY,
} from "@/constants";
import { getGoogleAccount } from "@/helper/get-user";
import { db } from "@/lib/db";
import { oauthAccount } from "@/lib/db/schema";

import { google } from "@/lib/auth/oauth";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { NextRequest, NextResponse } from "next/server";

interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name?: string;
  picture: string;
  locale: string;
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return Response.json(
      { error: "Invalid request" },
      {
        status: 400,
      }
    );
  }

  const codeVerifier = cookies().get(GOOGLE_CODE_VERIFIER_COOKIE_KEY)?.value;
  const savedState = cookies().get(GOOGLE_AUTH_STATE_COOKIE_KEY)?.value;

  // console.log({ codeVerifier, savedState, state });

  if (!codeVerifier || !savedState) {
    return Response.json(
      { error: "Code verifier or saved state is not exists" },
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

  // deleating unwanted cookies
  cookies().delete(GOOGLE_CODE_VERIFIER_COOKIE_KEY);
  cookies().delete(GOOGLE_AUTH_STATE_COOKIE_KEY);

  try {
    const { accessToken, idToken, accessTokenExpiresAt, refreshToken } =
      await google.validateAuthorizationCode(code, codeVerifier);

    const { user: youtube_account } = await getGoogleAccount(accessToken);
    if (!youtube_account) {
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
          eq(table.providerUserId, youtube_account.id),
          eq(table.provider, "youtube")
        )
      );

    console.log(oauth);

    if (oauth.length > 0) {
      await db
        .update(oauthAccount)
        .set({ accessTokenExpiresAt: accessTokenExpiresAt })
        .where(eq(oauthAccount.providerUserId, youtube_account.id));
    } else {
      await db.insert(oauthAccount).values({
        accessTokenExpiresAt: accessTokenExpiresAt,
        provider: "youtube",
        providerUserId: youtube_account.id,
      });
    }

    cookies().set(GOOGLE_ACCESS_TOKEN_COOKIE_KEY, accessToken, {
      httpOnly: true,
      expires: accessTokenExpiresAt,
      sameSite: true,
    });

    if (refreshToken) {
      cookies().set(GOOGLE_REFRESH_TOKEN_COOKIE_KEY, refreshToken, {
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
    }

    return NextResponse.redirect(
      new URL("/playlists", `${process.env.NEXT_PUBLIC_BASE_URL}`),
      {
        status: 302,
      }
    );
  } catch (error) {
    console.log("some error accured.");
    console.log(error);

    return NextResponse.redirect(
      new URL("/login", `${process.env.NEXT_PUBLIC_BASE_URL}`),
      {
        status: 302,
      }
    );
  }
}
