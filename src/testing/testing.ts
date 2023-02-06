import postgres from "postgresjs"

const sql = postgres("postgresql://Falentio:v2_3ygut_8GDn3zLsjw3rfUp9bvub7dH@db.bit.io:5432/Falentio/k", {
	ssl: { rejectUnauthorized: false },
})

await sql`delete from app_user`
await sql`delete from shortener`
await sql`delete from shortener_click`

export { sql }