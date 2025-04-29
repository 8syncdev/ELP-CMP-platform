import { db } from "./db/lesson.db";
import { lessonCourseTable, lessonTable } from "./db/lesson.schema";
import {
    LessonDto,
    LessonResponse,
    CreateLessonDto,
    UpdateLessonDto,
    ChaptersByCourseSlugResponse,
    CreateLessonCourseDto,
    LessonCourseResponse,
    LessonCourseDto
} from "./lesson.dto";
import { count, sql, eq, asc, inArray, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";
import { CourseService } from "../course";
import { get } from "https";

export const LessonService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(lessonTable)) as number
        };
    },

    findOne: async (id: number): Promise<LessonResponse> => {
        const [lesson] = await db.select()
            .from(lessonTable)
            .where(eq(lessonTable.id, id))
            .limit(1);

        if (!lesson) {
            return {
                success: false,
                message: "Lesson not found"
            };
        }

        return {
            success: true,
            result: lesson as LessonDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<LessonResponse> => {
        const offset = getOffset(page, size);
        const total = (await LessonService.count()).result as number;

        const parsedSearch = Number(search);

        const whereCondition = search
            ? or(
                sql`${lessonTable.metadata}->>'title' ILIKE ${`%${search}%`}`,
                sql`${lessonTable.metadata}->>'description' ILIKE ${`%${search}%`}`,
            )
            : undefined;

        const results = await db.select()
            .from(lessonTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(lessonTable.id));

        return {
            success: true,
            result: results as LessonDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateLessonDto): Promise<LessonResponse> => {
        const [lesson] = await db.insert(lessonTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: lesson as LessonDto
        };
    },

    update: async (id: number, data: UpdateLessonDto): Promise<LessonResponse> => {
        const [lesson] = await db.update(lessonTable)
            .set(data)
            .where(eq(lessonTable.id, id))
            .returning();

        if (!lesson) {
            return {
                success: false,
                message: "Lesson not found"
            };
        }

        return {
            success: true,
            result: lesson as LessonDto
        };
    },

    delete: async (id: number): Promise<LessonResponse> => {
        const [lesson] = await db.delete(lessonTable)
            .where(eq(lessonTable.id, id))
            .returning();

        if (!lesson) {
            return {
                success: false,
                message: "Lesson not found"
            };
        }

        return {
            success: true,
            message: "Lesson deleted successfully"
        };
    },

    getChaptersByCoursesSlug: async (courseSlug: string, page: number = 1, size: number = 10): Promise<ChaptersByCourseSlugResponse> => {
        const courseId = await CourseService.findCourseIdBySlug(courseSlug);
        const courseIdResult = courseId.result as number;

        if (!courseId.success) {
            return {
                success: false,
                message: courseId.message
            };
        }

        const getLessonsAssignedToCourse = await db.select()
            .from(lessonCourseTable)
            .where(eq(lessonCourseTable.course_id, courseIdResult));

        // console.log(getLessonsAssignedToCourse);

        const getLessons = await db.select()
            .from(lessonTable)
            .where(inArray(lessonTable.id, getLessonsAssignedToCourse.map(lesson => lesson.lesson_id)));

        // if (!getLessons) {
        //     return {
        //         success: false,
        //         message: "Lessons not found"
        //     };
        // }

        const chapterMap = new Map();
        getLessons.forEach(lesson => {
            chapterMap.set(lesson.metadata.chapter_slug, lesson.metadata.chapter_name);
        });
        const getChapters = Array.from(chapterMap, ([chapter_slug, chapter_name]) => ({
            chapter_name,
            chapter_slug
        }));

        const total = getChapters.length;

        const responseChapters = getChapters.slice((page - 1) * size, page * size);

        console.log(responseChapters);
        return {
            success: true,
            result: responseChapters,
            pagination: paginatedData({ page, size, count: total })
        };
    },

    getLessonsByChapterSlug: async (chapterSlug: string, page: number = 1, size: number = 10): Promise<LessonResponse> => {
        const offset = getOffset(page, size);

        const lessons = await db.select()
            .from(lessonTable)
            .where(sql`${lessonTable.metadata}->>'chapter_slug' = ${chapterSlug}`)
            .limit(size)
            .offset(offset)
            .orderBy(asc(lessonTable.id));

        const total = await db.$count(lessonTable, sql`${lessonTable.metadata}->>'chapter_slug' = ${chapterSlug}`);
        return {
            success: true,
            result: lessons.map(lesson => ({
                ...lesson,
                content: ""
            }) as LessonDto),
            pagination: paginatedData({ page, size, count: total })
        };
    },

    getLessonBySlug: async (slug: string): Promise<LessonResponse> => {
        const lesson = await db.select()
            .from(lessonTable)
            .where(
                eq(
                    lessonTable.slug,
                    slug
                )
            );

        if (!lesson) {
            return {
                success: false,
                message: "Lesson not found"
            };
        }
        return {
            success: true,
            result: lesson[0] as LessonDto
        };
    }
};

export default LessonService;

export const LessonCourseService = {
    create: async (data: CreateLessonCourseDto): Promise<LessonCourseResponse> => {
        const [lessonCourse] = await db.insert(lessonCourseTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: lessonCourse as LessonCourseDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<LessonCourseResponse> => {
        const offset = getOffset(page, size);
        const total = await db.$count(lessonCourseTable);

        const parsedSearch = Number(search);

        const whereCondition = search
            ? or(
                eq(lessonCourseTable.lesson_id, parsedSearch),
                eq(lessonCourseTable.course_id, parsedSearch)
            )
            : undefined;

        const lessons = await db.select()
            .from(lessonCourseTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(lessonCourseTable.lesson_id));

        return {
            success: true,
            result: lessons as unknown as LessonCourseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    findOne: async (lessonId: number, courseId: number): Promise<LessonCourseResponse> => {
        const [lessonCourse] = await db.select()
            .from(lessonCourseTable)
            .where(
                eq(lessonCourseTable.lesson_id, lessonId) &&
                eq(lessonCourseTable.course_id, courseId)
            )
            .limit(1);

        if (!lessonCourse) {
            return {
                success: false,
                message: "Lesson course not found"
            };
        }

        return {
            success: true,
            result: lessonCourse as LessonCourseDto
        };
    },

    update: async (lessonId: number, courseId: number, data: CreateLessonCourseDto): Promise<LessonCourseResponse> => {
        const [lessonCourse] = await db.update(lessonCourseTable)
            .set(data)
            .where(
                eq(lessonCourseTable.lesson_id, lessonId) &&
                eq(lessonCourseTable.course_id, courseId)
            )
            .returning();

        if (!lessonCourse) {
            return {
                success: false,
                message: "Lesson course not found"
            };
        }

        return {
            success: true,
            result: lessonCourse as LessonCourseDto
        };
    },

    delete: async (lessonId: number, courseId: number): Promise<LessonCourseResponse> => {
        const [lessonCourse] = await db.delete(lessonCourseTable)
            .where(
                eq(lessonCourseTable.lesson_id, lessonId) &&
                eq(lessonCourseTable.course_id, courseId)
            )
            .returning();

        if (!lessonCourse) {
            return {
                success: false,
                message: "Lesson course not found"
            };
        }

        return {
            success: true,
            message: "Lesson course deleted successfully"
        };
    },

    findByCourseId: async (courseId: number, page: number = 1, size: number = 10): Promise<LessonCourseResponse> => {
        const offset = getOffset(page, size);

        const lessonCourses = await db.select()
            .from(lessonCourseTable)
            .where(eq(lessonCourseTable.course_id, courseId))
            .limit(size)
            .offset(offset)
            .orderBy(asc(lessonCourseTable.lesson_id));

        const total = await db.$count(lessonCourseTable, eq(lessonCourseTable.course_id, courseId));

        return {
            success: true,
            result: lessonCourses as unknown as LessonCourseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    findByLessonId: async (lessonId: number, page: number = 1, size: number = 10): Promise<LessonCourseResponse> => {
        const offset = getOffset(page, size);

        const lessonCourses = await db.select()
            .from(lessonCourseTable)
            .where(eq(lessonCourseTable.lesson_id, lessonId))
            .limit(size)
            .offset(offset)
            .orderBy(asc(lessonCourseTable.course_id));

        const total = await db.$count(lessonCourseTable, eq(lessonCourseTable.lesson_id, lessonId));

        return {
            success: true,
            result: lessonCourses as unknown as LessonCourseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    }
}
