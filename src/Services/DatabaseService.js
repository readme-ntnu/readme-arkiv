import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export function query(text, params, callback) {
  return pool.query(text, params, callback);
}
export function createTables() {
  const queryText = `CREATE TABLE IF NOT EXISTS
            articles(
                id UUID PRIMARY KEY,
                author VARCHAR(40) NOT NULL,
                content TEXT NOT NULL,
                edition VARCHAR(7) NOT NULL,
                layout VARCHAR(40),
                
            )
        `;
}
