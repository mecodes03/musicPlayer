DO $$ BEGIN
 CREATE TYPE "public"."provider" AS ENUM('spotify', 'youtube');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "api_key" (
	"spotify_user_id" text PRIMARY KEY NOT NULL,
	"youtube_user_id" text NOT NULL,
	"keys" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "oauth_account" (
	"provider_user_id" text PRIMARY KEY NOT NULL,
	"access_token_expires_at" timestamp NOT NULL,
	"provider" "provider" NOT NULL,
	"added_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spotify_credits" (
	"spotify_user_id" text PRIMARY KEY NOT NULL,
	"credits_alloted_per_day" smallint DEFAULT 600
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "spotify_to_youtube" (
	"spotify_song_id" text NOT NULL,
	"youtube_song_id" text NOT NULL,
	CONSTRAINT "id" PRIMARY KEY("spotify_song_id","youtube_song_id"),
	CONSTRAINT "spotify_to_youtube_spotify_song_id_unique" UNIQUE("spotify_song_id"),
	CONSTRAINT "spotify_to_youtube_youtube_song_id_unique" UNIQUE("youtube_song_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "youtube_song" (
	"youtube_song_id" text PRIMARY KEY NOT NULL,
	"song" json NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "youtube_song" ADD CONSTRAINT "youtube_song_youtube_song_id_spotify_to_youtube_youtube_song_id_fk" FOREIGN KEY ("youtube_song_id") REFERENCES "public"."spotify_to_youtube"("youtube_song_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
