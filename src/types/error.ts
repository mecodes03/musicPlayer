export type TSpotifyError = {
  error: { status: 401 | 403 | 429; message: string };
};

export type GoogleError = {
  error: {
    code: number;
    message: string;
    status: string;
  };
};
