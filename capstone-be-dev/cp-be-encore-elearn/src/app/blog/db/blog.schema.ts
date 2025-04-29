import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const blogTable = p.pgTable("blogs", {
    id: p.serial().primaryKey(),
    slug: p.text().unique().notNull(),
    content: p.text().notNull(),
    metadata: p.jsonb().notNull().default({
        title: "",
        description: "",
        author: "",
        publishedTime: "",
        updatedTime: "",
        tags: [],
        privilege: "free",
        isPublished: false,
        imageAuthor: "",
        thumbnail: "",
    }),
});
