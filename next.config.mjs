/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        port: "",
        pathname: "/vi/**",
      },
      {
        protocol: "https",
        hostname: "mosaic.scdn.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.scdn.co",
        port: "",
        pathname: "/**",
      },
        ],
    },
    env: {
        POSTGRES_DATABASE_CONNECTION_STRING: process.env.DATABASE_URL,
	    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
        DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN,
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
        SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
        SPOTIFY_REDIRECT_URL: process.env.SPOTIFY_REDIRECT_URL,
        BASE_URL: process.env.BASE_URL,
		UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_BASE_URL,
    }
};
export default nextConfig;
