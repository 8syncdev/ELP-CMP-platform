import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const enrollmentTable = p.pgTable("enrollments", {
    id: p.serial().primaryKey(),
    user_id: p.integer().notNull(),
    course_id: p.integer().notNull(),
    status: p.varchar("status", { length: 255 }).notNull().default("pending"),
    expires_at: p.timestamp().notNull().default(sql`CURRENT_TIMESTAMP + INTERVAL '1 month'`),
    created_at: p.timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
    updated_at: p.timestamp().notNull().default(sql`CURRENT_TIMESTAMP`),
});
