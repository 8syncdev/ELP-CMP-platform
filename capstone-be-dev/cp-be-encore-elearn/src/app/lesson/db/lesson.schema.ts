import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { LessonMetadataDto } from "../lesson.dto";

export const lessonTable = p.pgTable("lessons", {
    id: p.serial().primaryKey(),
    slug: p.varchar("slug", { length: 500 }).notNull().unique(),
    content: p.text().notNull(),
    metadata: p.jsonb("metadata").$type<LessonMetadataDto>().notNull().default({
        title: "",
        description: "",
        chapter_name: "",
        chapter_slug: "",
        author: "",
        publishedTime: "",
        lastModifiedTime: "",
        tags: [],
        category: "",
        difficulty: "",
        language: [],
        privilege: "",
        isPublished: false,
        imageAuthor: "",
        thumbnail: "",
    }),
});

export const lessonCourseTable = p.pgTable("lesson_courses", {
    lesson_id: p.integer("lesson_id").notNull(),
    course_id: p.integer("course_id").notNull(),
});
