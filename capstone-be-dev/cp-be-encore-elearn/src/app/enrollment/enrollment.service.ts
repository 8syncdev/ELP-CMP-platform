import { db } from "./db/enrollment.db";
import { enrollmentTable } from "./db/enrollment.schema";
import {
    EnrollmentDto,
    EnrollmentResponse,
    CreateEnrollmentDto,
    UpdateEnrollmentDto
} from "./enrollment.dto";
import { count, sql, eq, asc, and, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";
import { CourseService } from "../course";

export const EnrollmentService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(enrollmentTable)) as number
        };
    },

    findOne: async (id: number): Promise<EnrollmentResponse> => {
        const [enrollment] = await db.select()
            .from(enrollmentTable)
            .where(eq(enrollmentTable.id, id))
            .limit(1);

        if (!enrollment) {
            return {
                success: false,
                message: "Enrollment not found"
            };
        }

        return {
            success: true,
            result: enrollment as EnrollmentDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<EnrollmentResponse> => {
        const offset = getOffset(page, size);
        const total = (await EnrollmentService.count()).result as number;

        const parsedSearch = Number(search);

        const whereCondition = search
            ? or(
                eq(enrollmentTable.id, parsedSearch),
                eq(enrollmentTable.user_id, parsedSearch),
                eq(enrollmentTable.course_id, parsedSearch)
            )
            : undefined;

        const results = await db.select()
            .from(enrollmentTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(enrollmentTable.id));

        return {
            success: true,
            result: results as EnrollmentDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateEnrollmentDto): Promise<EnrollmentResponse> => {
        const [enrollment] = await db.insert(enrollmentTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: enrollment as EnrollmentDto
        };
    },

    update: async (id: number, data: UpdateEnrollmentDto): Promise<EnrollmentResponse> => {
        const [enrollment] = await db.update(enrollmentTable)
            .set(data)
            .where(eq(enrollmentTable.id, id))
            .returning();

        if (!enrollment) {
            return {
                success: false,
                message: "Enrollment not found"
            };
        }

        return {
            success: true,
            result: enrollment as EnrollmentDto
        };
    },

    delete: async (id: number): Promise<EnrollmentResponse> => {
        const [enrollment] = await db.delete(enrollmentTable)
            .where(eq(enrollmentTable.id, id))
            .returning();

        if (!enrollment) {
            return {
                success: false,
                message: "Enrollment not found"
            };
        }

        return {
            success: true,
            message: "Enrollment deleted successfully"
        };
    },

    checkEnrollment: async (userId: number, courseId: number): Promise<EnrollmentResponse> => {
        const [enrollment] = await db.select()
            .from(enrollmentTable)
            .where(and(eq(enrollmentTable.user_id, userId), eq(enrollmentTable.course_id, courseId)))
            .limit(1);

        if (!enrollment) {
            return {
                success: false,
                message: "Enrollment not found"
            };
        }

        if (enrollment.status === "pending") {
            return {
                success: false,
                message: "Enrollment pending"
            };
        }

        if (enrollment.status === "cancelled") {
            return {
                success: false,
                message: "Enrollment cancelled"
            };
        }

        if (enrollment.status === "expired") {
            return {
                success: false,
                message: "Enrollment expired"
            };
        }

        if (enrollment.expires_at && enrollment.expires_at < new Date()) {
            await db.update(enrollmentTable)
                .set({ status: "expired" })
                .where(eq(enrollmentTable.id, enrollment.id));
            return {
                success: false,
                message: "Enrollment expired"
            };
        }

        return {
            success: true,
            result: enrollment as EnrollmentDto,
            message: "Enrollment found"
        };
    },

    checkEnrollmentByCourseSlug: async (userId: number, courseSlug: string): Promise<EnrollmentResponse> => {
        const findCourseId = await CourseService.findCourseIdBySlug(courseSlug);
        if (!findCourseId) {
            return {
                success: false,
                message: "Course not found"
            };
        }

        const courseId = findCourseId.result as number;

        return await EnrollmentService.checkEnrollment(userId, courseId);
    }

};

export default EnrollmentService;
