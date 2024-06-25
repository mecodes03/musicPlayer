import {
  RequestCookies,
  ResponseCookies,
} from "next/dist/compiled/@edge-runtime/cookies";
import { google, spotify } from "./lib/auth/oauth";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

function applySetCookie(req: NextRequest, res: NextResponse) {
  // 1. Parse Set-Cookie header from the response
  const setCookies = new ResponseCookies(res.headers);

  // 2. Construct updated Cookie header for the request
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie));

  // 3. Set up the “request header overrides” (see https://github.com/vercel/next.js/pull/41380)
  //    on a dummy response
  // NextResponse.next will set x-middleware-override-headers / x-middleware-request-* headers
  const dummyRes = NextResponse.next({ request: { headers: newReqHeaders } });

  // 4. Copy the “request header overrides” headers from our dummy response to the real response
  dummyRes.headers.forEach((value, key) => {
    if (
      key === "x-middleware-override-headers" ||
      key.startsWith("x-middleware-request-")
    ) {
      res.headers.set(key, value);
    }
  });
}

export async function middleware(req: NextRequest) {
  // console.log("middlware running...");
  const response = NextResponse.next();
  const url = new URL(req.nextUrl);

  const spotify_access_token = req.cookies.get("spotify_access_token")?.value;
  const spotify_refresh_token = req.cookies.get("spotify_refresh_token")?.value;

  const google_access_token = req.cookies.get("google_access_token")?.value;
  const google_refresh_token = req.cookies.get("google_refresh_token")?.value;

  if (!spotify_access_token && spotify_refresh_token) {
    console.log("refreshing the token");
    const { accessToken, accessTokenExpiresAt, refreshToken } =
      await spotify.refreshAccessToken(spotify_refresh_token);
    if (accessToken) {
      response.cookies.set("spotify_access_token", accessToken, {
        path: "/",
        httpOnly: true,
        expires: accessTokenExpiresAt,
      });
    }

    response.cookies.set(
      "spotify_refresh_token",
      refreshToken ?? spotify_refresh_token,
      {
        path: "/",
        httpOnly: true,
      },
    );
  }

  if (!google_access_token && google_refresh_token) {
    const { accessToken, accessTokenExpiresAt } =
      await google.refreshAccessToken(google_refresh_token);
    if (accessToken) {
      response.cookies.set("google_access_token", accessToken, {
        path: "/",
        httpOnly: true,
        expires: accessTokenExpiresAt,
      });
    }
  }

  applySetCookie(req, response);

  if (
    (req.cookies.get("spotify_access_token")?.value ||
      response.cookies.get("spotify_access_token")?.value) &&
    (req.cookies.get("google_access_token")?.value ||
      response.cookies.get("google_access_token")?.value) &&
    url.pathname === "/connect"
  ) {
    console.log("redirect");
    return NextResponse.redirect("http://localhost:3000/playlists", {
      ...response,
      status: 302,
    });
  }

  return response;
}

export const config = {
  // matcher: ["/playlists", "/playlists/:path*", "/home", "/connect"],
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
