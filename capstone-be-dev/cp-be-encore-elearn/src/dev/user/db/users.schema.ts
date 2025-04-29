import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const usersTable = p.pgTable("users", {
    id: p.serial().primaryKey(),
    username: p.text().unique().notNull(),
    password: p.text().notNull(),
    phone: p.text().unique().notNull().default(''),
    email: p.text().unique().notNull().default(''),
    full_name: p.text().notNull().default(''),
    avatar: p.text().notNull().default(''),
    created_at: p.timestamp().notNull().defaultNow(),
    updated_at: p.timestamp().notNull().defaultNow(),
    is_active: p.boolean().notNull().default(false),
    is_deleted: p.boolean().notNull().default(false),
    is_blocked: p.boolean().notNull().default(false),
    is_suspended: p.boolean().notNull().default(false),
});
