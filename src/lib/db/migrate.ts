import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import "dotenv/config";

const main = async () => {
  if (!process.env.POSTGRES_DATABASE_CONNECTION_STRING) {
    console.log(process.env.POSTGRES_DATABASE_CONNECTION_STRING)
    throw new Error("POSTGRES_DATABASE_CONNECTION_STRING is not defined");
  }

  try {
    const connectionString = process.env
      .POSTGRES_DATABASE_CONNECTION_STRING as string;
    const connector = postgres(connectionString);

    const db = drizzle(connector);

    console.log("running migrations...");

    const start = Date.now();

    await migrate(db, {
      migrationsFolder: "src/lib/db/migrations",
    });

    const end = Date.now();

    console.log("Migrations completed in " + (end - start) + "ms");
    process.exit(0);
  } catch (error) {
    console.log("migration failed");
    console.log(error);
    process.exit(1);
  }
};

main();
