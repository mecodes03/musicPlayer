export class SpotifyError extends Error {
  constructor(message = "some error occured") {
    super(message);
    this.message = message;
    this.name = "SpotifyError";
  }
}

export class GoogleError extends Error {
  constructor(message = "some error occured") {
    super(message);
    this.message = message;
    this.name = "GoogleError";
  }
}

export class GoogleAccessTokenExpiredError extends Error {
  constructor(message = "google_expired") {
    super(message, { cause: "google_expired" });
    this.message = message;
    this.name = "GoogleAccessTokenExpiredError";
  }
}

export class GoogleRefreshTokenExpiredError extends Error {
  constructor(message = "google_refresh_token_not_valid") {
    super(message);
    this.message = message;
    this.name = "GoogleRefreshTokenExpired";
  }
}

export class SpotifyRefreshTokenExpiredError extends Error {
  constructor(message = "spotify_refresh_token_not_valid") {
    super(message);
    this.message = message;
    this.name = "SpotifyRefreshTokenExpired";
  }
}

export class SpotifyAccessTokenExpiredError extends Error {
  constructor(message = "spotify_expired") {
    super(message, { cause: "spotifyExpired" });
    this.message = message;
    this.name = "SpotifyAccessTokenExpiredError";
  }
}
