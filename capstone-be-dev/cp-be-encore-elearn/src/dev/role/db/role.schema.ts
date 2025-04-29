import * as p from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const roleTable = p.pgTable("roles", {
    id: p.serial().primaryKey(),
    name: p.text("name").notNull().unique(),
    description: p.text("description").notNull(),
});

export const userRolesTable = p.pgTable("user_roles", {
    userId: p.integer("user_id").notNull(),
    roleId: p.integer("role_id").notNull(),
});