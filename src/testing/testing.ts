import postgres from "postgresjs";

const sql = postgres(
  Deno.env.get("DATABASE_DSN"),
  {
    ssl: { rejectUnauthorized: false },
  },
);

await sql`delete from app_user`;
await sql`delete from shortener`;
await sql`delete from shortener_click`;

export { sql };
