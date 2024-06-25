// spotify urls
export const spotifyPlaylistsUrl = () => {
  return "https://api.spotify.com/v1/me/playlists";
};

export const spotifyPlaylistUrl = (id: string) => {
  return `https://api.spotify.com/v1/playlists/${id}?limit=3`;
};

//youtube urls
export const youtubePlaylistUrl = (id: string) => {
  return `https://youtube.googleapis.com/youtube/v3/playlists?part=snippet&part=contentDetails&part=status&id=${id}&key=${process.env.GOOGLE_API_KEY}`;
};

export const youtubePlaylistItemsUrl = (
  id: string,
  maxResults: number = 20,
  pageToken: string = "",
) => {
  const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : "";
  return `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&playlistId=${id}&maxResults=${maxResults}${pageTokenParam}&key=${process.env.GOOGLE_API_KEY}`;
};

export const youtubeVideoUrl = (ids: string[]) => {
  console.log(ids);
  const videoIdString = ids.reduce((prev, crr) => {
    prev += `&id=${crr}`;
    return prev;
  }, "");
  console.log(videoIdString);

  return `https://www.googleapis.com/youtube/v3/videos?part=snippet&part=statistics&part=contentDetails&mine=true&key=${process.env.GOOGLE_API_KEY}${videoIdString}`;
};

export const youtubeSearchVideoUrl = (query_string: string) => {
  // https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=krsna&type=video&videoCategoryId=10&access_token=adfdf&key=[YOUR_API_KEY]
  return `${process.env.PUBLIC_YOUTUBE_API_KEY}?part=snippet&type=video&videoCategoryId=10&q=${query_string}`;
};
