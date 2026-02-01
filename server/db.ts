import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

// Export mutable bindings and assign below so exports remain at top-level.
export let pool: any;
export let db: any;

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.warn("DATABASE_URL not set — falling back to in-memory storage.");

  pool = undefined;
  db = {
    select: () => ({
      from: () => ({
        limit: async () => {
          throw new Error("No database configured");
        },
      }),
    }),
  };

} else {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
}
