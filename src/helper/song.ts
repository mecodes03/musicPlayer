import { millisecondsToTime, parseISODuration } from "@/lib/utils";
import { Provider } from "@/types/provider";
import { Song } from "@/types/song";
import { SpotifyPlaylistSong } from "@/types/spotify";
import { TYoutubeVideo } from "@/types/youtube";

type SpotifySong = SpotifyPlaylistSong & { youtubeSong: null | Song };

export function isYoutubeSong(
  song: TYoutubeVideo | SpotifySong,
): song is TYoutubeVideo {
  return (song as TYoutubeVideo).id !== undefined;
}

export const formatSong: (song: TYoutubeVideo | SpotifySong) => Song = (
  song,
) => {
  const _isYoutubeSong = isYoutubeSong(song);

  if (!_isYoutubeSong && song.youtubeSong) {
    return song.youtubeSong;
  }

  return {
    id: _isYoutubeSong ? song.id : song.track.id,
    songTitle: _isYoutubeSong ? song.snippet.title : song.track.name,
    artistOrChannel: _isYoutubeSong
      ? song.snippet.channelTitle
      : song.track.artists.reduce(
          (p_artists_str, { name: artist_name }) =>
            p_artists_str.concat(" ", artist_name),
          "",
        ),

    imageUrl: _isYoutubeSong
      ? song.snippet.thumbnails.default.url
      : song.track.album.images[1].url,

    songDuration: _isYoutubeSong
      ? parseISODuration(song.contentDetails.duration)
      : millisecondsToTime(song.track.duration_ms),
    onHoverTitle: `Play ${_isYoutubeSong ? song.snippet.title : song.track.name} by ${
      _isYoutubeSong
        ? song.snippet.channelTitle
        : song.track.artists.map((artists) => artists)
    }`,

    ...(_isYoutubeSong
      ? {
          provider: Provider.YOUTUBE,
          viewsCount: song.statistics.viewCount,
          likesCount: song.statistics.likeCount,
        }
      : {
          provider: Provider.SPOTIFY,
          popularity: song.track.popularity,
        }),
  };
};
