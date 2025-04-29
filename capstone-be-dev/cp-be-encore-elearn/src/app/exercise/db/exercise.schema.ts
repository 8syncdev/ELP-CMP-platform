import * as p from "drizzle-orm/pg-core";
import { ExerciseMetadataDto, ExerciseTestcaseDto } from "../exercise.dto";

export const exerciseTable = p.pgTable("exercises", {
    id: p.serial('id').primaryKey(),
    slug: p.text('slug').unique().notNull(),
    content: p.text('content').notNull(),
    solution: p.text('solution').notNull().default(""),
    testcases: p.jsonb('testcases').$type<ExerciseTestcaseDto[]>().notNull().default([]),
    metadata: p.jsonb('metadata').$type<ExerciseMetadataDto>().notNull().default({
        title: "",
        keywords: [],
        metaTitle: "",
        metaDescription: "",
        author: "",
        publishedTime: "",
        lastModifiedTime: "",
        tags: [],
        difficulty: "",
        language: [],
        privilege: "",
        isPublished: false,
        imageAuthor: "",
        thumbnail: "",
    }),
});

export const courseExercisesTable = p.pgTable("course_exercises", {
    courseId: p.integer('course_id').notNull(),
    exerciseId: p.integer('exercise_id').notNull(),
});
