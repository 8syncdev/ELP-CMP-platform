import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { CourseMetadataDto } from "../course.dto";

export const courseTable = p.pgTable("courses", {
    id: p.serial().primaryKey(),
    slug: p.varchar("slug", { length: 500 }).notNull().unique(),
    content: p.text("content"),
    metadata: p.jsonb("metadata").$type<CourseMetadataDto>().default({
        name: "",
        description: "",
        instructor_name: "",
        instructor_contact: "",
        instructor_email: "",
        instructor_avatar: "",
        duration: "",
        level: "",
        type: "",
        original_price: 0,
        discounted_price: 0,
        thumbnail: "",
        published_at: "",
        is_published: false
    }),
});
