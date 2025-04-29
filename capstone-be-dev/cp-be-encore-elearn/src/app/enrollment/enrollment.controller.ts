import { api, APIError } from "encore.dev/api";
import { EnrollmentService } from "./enrollment.service";
import {
    EnrollmentDto,
    EnrollmentResponse,
    CreateEnrollmentDto,
    UpdateEnrollmentDto
} from "./enrollment.dto";
import { DataResponse } from "../../utils";
import { getMyAuthData } from "../../dev/auth";

export const countEnrollments = api(
    { expose: true, method: "GET", path: "/enrollments/count" },
    async (): Promise<DataResponse> => {
        return await EnrollmentService.count();
    }
)

export const getEnrollments = api(
    { expose: true, method: "GET", path: "/enrollments" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<EnrollmentResponse> => {
        return await EnrollmentService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getEnrollment = api(
    { expose: true, method: "GET", path: "/enrollments/:id" },
    async ({ id }: { id: number }): Promise<EnrollmentResponse> => {
        return await EnrollmentService.findOne(id);
    }
)

export const createEnrollment = api(
    { expose: true, method: "POST", path: "/enrollments" },
    async (body: CreateEnrollmentDto): Promise<EnrollmentResponse> => {
        return await EnrollmentService.create(body);
    }
)

export const updateEnrollment = api(
    { expose: true, method: "PUT", path: "/enrollments/:id" },
    async (body: UpdateEnrollmentDto): Promise<EnrollmentResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await EnrollmentService.update(body.id, body);
    }
)

export const deleteEnrollment = api(
    { expose: true, method: "DELETE", path: "/enrollments/:id" },
    async ({ id }: { id: number }): Promise<EnrollmentResponse> => {
        return await EnrollmentService.delete(id);
    }
)

export const checkEnrolledByCourseSlug = api(
    { expose: true, method: "GET", path: "/enrollments/check/:courseSlug" },
    async ({ courseSlug }: { courseSlug: string }): Promise<EnrollmentResponse> => {
        const authData = getMyAuthData();
        if (!authData?.userID) {
            return {
                success: false,
                message: "User not found"
            };
        }
        return await EnrollmentService.checkEnrollmentByCourseSlug(Number(authData?.userID), courseSlug);
    }
)