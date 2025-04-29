import { SQLDatabase } from "encore.dev/storage/sqldb";
import { drizzle } from 'drizzle-orm/node-postgres';

const DB = new SQLDatabase('blog_db', {
    migrations: './migrations',
});

const db = drizzle(DB.connectionString)

export { db };
