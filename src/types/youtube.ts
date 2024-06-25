export interface TYoutubePlaylistById {
  nextPageToken: string | null;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: TYoutubePlaylist[];
}

export interface TYoutubePlaylist {
  id: string;
  snippet: { publishedAt: string; title: string; channelTitle: string };
  contentDetails: { itemCount: number };
  status: {
    privacyStatus: string;
  };
}

export interface TYoutubePlaylistItems {
  nextPageToken: string | null;
  prevPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: TYoutubePlaylistSingleItem[];
}

interface TYoutubePlaylistSingleItem {
  contentDetails: {
    videoId: string;
    videoPublishedAt: string;
  };
}

export interface TYoutubeVideo {
  id: string;
  snippet: {
    publishedAt: Date;
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
        height: number;
        width: number;
      };
      standard: {
        url: string;
        height: number;
        width: number;
      };
      default: {
        url: string;
        height: number;
        width: number;
      };
    };
    channelTitle: string;
    categoryId: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
    dislikeCount: string;
    favoriteCount: string;
    commentCount: string;
  };
  contentDetails: {
    duration: string;
  };
}
