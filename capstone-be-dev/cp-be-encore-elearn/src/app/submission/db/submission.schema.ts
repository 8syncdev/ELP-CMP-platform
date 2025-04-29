import * as p from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { SubmissionMetadata } from "../submission.dto";

export const submissionTable = p.pgTable("submissions", {
    id: p.serial().primaryKey(),
    user_id: p.integer(),
    exercise_id: p.integer(),
    code: p.text("code").notNull(),
    grade: p.integer("grade").notNull(),
    language: p.text("language").notNull(),
    execution_time: p.integer("execution_time").notNull(),
    memory_used: p.decimal("memory_used", { precision: 10, scale: 2 }).notNull(),
    testcases: p.jsonb("tests").$type<SubmissionMetadata[]>().notNull().default(sql`'[]'`)
});
