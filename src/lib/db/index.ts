import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_DATABASE_CONNECTION_STRING;

if (!connectionString) throw new Error("database url must be provided");

const client = postgres(connectionString);
export const db = drizzle(client, { schema });
