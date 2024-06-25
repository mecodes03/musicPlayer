import { Song } from "@/types/song";
import { TYoutubeVideo } from "@/types/youtube";
import { relations } from "drizzle-orm";
import {
  json,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const provider = pgEnum("provider", ["spotify", "youtube"]);

export const oauthAccount = pgTable("oauth_account", {
  providerUserId: text("provider_user_id").primaryKey(),
  accessTokenExpiresAt: timestamp("access_token_expires_at").notNull(),
  provider: provider("provider").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const spotifyToYoutube = pgTable(
  "spotify_to_youtube",
  {
    spotifySongId: text("spotify_song_id").notNull().unique(),
    youtubeSongId: text("youtube_song_id").notNull().unique(),
  },
  (table) => ({
    id: primaryKey({
      name: "id",
      columns: [table.spotifySongId, table.youtubeSongId],
    }),
  }),
);

export const youtubeSong = pgTable("youtube_song", {
  youtubeSongId: text("youtube_song_id")
    .primaryKey()
    .references(() => spotifyToYoutube.youtubeSongId),
  song: json("song").$type<Song>().notNull(),
});

export const spotifyToYoutubeRelations = relations(
  spotifyToYoutube,
  ({ one }) => ({
    youtubeSong: one(youtubeSong, {
      fields: [spotifyToYoutube.youtubeSongId],
      references: [youtubeSong.youtubeSongId],
    }),
  }),
);

export const spotifyCredits = pgTable("spotify_credits", {
  spoityUserId: text("spotify_user_id").primaryKey(),
  creditsAllotedPerDay: smallint("credits_alloted_per_day").default(600),
});

export const apiKeys = pgTable("api_key", {
  spotify_user_id: text("spotify_user_id").primaryKey(),
  youtube_user_id: text("youtube_user_id").notNull(),
  keys: text("keys").array().notNull(),
});
