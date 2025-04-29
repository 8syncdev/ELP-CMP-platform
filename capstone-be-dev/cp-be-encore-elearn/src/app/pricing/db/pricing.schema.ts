import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const pricingTable = p.pgTable("pricings", {
    id: p.serial().primaryKey(),
    name: p.varchar("name", { length: 255 }).notNull(),
    description: p.text("description").notNull(),
    price: p.decimal("price", { precision: 10, scale: 2 }).notNull(),
    created_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
    updated_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
    type_payment: p.varchar("type_payment", { length: 255 }).notNull().default('monthly'),
    sale: p.decimal("sale", { precision: 10, scale: 2 }).notNull().default('0'),
});

export const pricingUserTable = p.pgTable("pricing_users", {
    pricing_id: p.integer("pricing_id").notNull(),
    user_id: p.integer("user_id").notNull(),
    expires_at: p.timestamp("expires_at").default(sql`CURRENT_TIMESTAMP + INTERVAL '1 year'`),
    status: p.varchar("status", { length: 255 }).notNull().default('pending'),
    created_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
    updated_at: p.timestamp().default(sql`CURRENT_TIMESTAMP`),
});
