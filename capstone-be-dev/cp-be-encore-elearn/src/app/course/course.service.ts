import { db } from "./db/course.db";
import { courseTable } from "./db/course.schema";
import {
    CourseDto,
    CourseResponse,
    CreateCourseDto,
    UpdateCourseDto
} from "./course.dto";
import { count, sql, eq, asc, and, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";

export const CourseService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(courseTable)) as number
        };
    },

    findOne: async (id: number): Promise<CourseResponse> => {
        const [course] = await db.select()
            .from(courseTable)
            .where(eq(courseTable.id, id))
            .limit(1);

        if (!course) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        return {
            success: true,
            result: course as CourseDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<CourseResponse> => {
        const offset = getOffset(page, size);
        const total = (await CourseService.count()).result as number;

        const whereCondition = search
            ? or(
                sql`${courseTable.metadata}->>'name' ILIKE ${`%${search}%`}`,
                sql`${courseTable.metadata}->>'description' ILIKE ${`%${search}%`}`,
            )
            : undefined;
        const results = await db.select()
            .from(courseTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(courseTable.id));

        return {
            success: true,
            result: results as CourseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateCourseDto): Promise<CourseResponse> => {
        const [course] = await db.insert(courseTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: course as CourseDto
        };
    },

    update: async (id: number, data: UpdateCourseDto): Promise<CourseResponse> => {
        const [course] = await db.update(courseTable)
            .set(data)
            .where(eq(courseTable.id, id))
            .returning();

        if (!course) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        return {
            success: true,
            result: course as CourseDto
        };
    },

    delete: async (id: number): Promise<CourseResponse> => {
        const [course] = await db.delete(courseTable)
            .where(eq(courseTable.id, id))
            .returning();

        if (!course) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        return {
            success: true,
            message: "Course deleted successfully"
        };
    },

    findCourseBySlug: async (slug: string): Promise<CourseResponse> => {
        const [course] = await db.select()
            .from(courseTable)
            .where(eq(courseTable.slug, slug))
            .limit(1);

        if (!course) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        return {
            success: true,
            result: course as CourseDto
        };
    },

    findCourseIdBySlug: async (slug: string): Promise<DataResponse> => {
        const course = await CourseService.findCourseBySlug(slug);

        if (!course.success) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        if (!course.result || Array.isArray(course.result)) {
            return {
                success: false,
                message: Array.isArray(course.result)
                    ? course.result.length === 0 ? "Course not found" : "Multiple courses found"
                    : "Course not found"
            };
        }

        const courseId = course.result.id;

        return {
            success: true,
            result: courseId,
            message: "Course found"
        };
    },

    findCoursesByType: async (type: string, page: number = 1, size: number = 10, search: string = ""): Promise<CourseResponse> => {
        const offset = getOffset(page, size);

        // Tạo điều kiện where cơ bản cho type
        let whereCondition = and(sql`${courseTable.metadata}->>'type' = ${type}`);

        // Thêm điều kiện search nếu có
        if (search) {
            whereCondition = and(
                sql`${courseTable.metadata}->>'type' = ${type}`,
                or(
                    sql`${courseTable.metadata}->>'name' ILIKE ${`%${search}%`}`,
                    sql`${courseTable.content} ILIKE ${`%${search}%`}`
                )
            );
        }

        const results = await db.select()
            .from(courseTable)
            .where(whereCondition);

        const total = results.length;

        const paginatedResults = await db.select()
            .from(courseTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(courseTable.id));

        return {
            success: true,
            result: paginatedResults as CourseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    }
};

export default CourseService;
