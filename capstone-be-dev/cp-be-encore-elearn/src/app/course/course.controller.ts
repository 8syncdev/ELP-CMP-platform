import { api, APIError } from "encore.dev/api";
import { CourseService } from "./course.service";
import {
    CourseDto,
    CourseResponse,
    CreateCourseDto,
    UpdateCourseDto
} from "./course.dto";
import { DataResponse } from "../../utils";

export const countCourses = api(
    { expose: true, method: "GET", path: "/courses/count" },
    async (): Promise<DataResponse> => {
        return await CourseService.count();
    }
)

export const getCourses = api(
    { expose: true, method: "GET", path: "/courses" },
    async ({ page, size, search = "" }: { page: number, size: number, search: string }): Promise<CourseResponse> => {
        return await CourseService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getCourse = api(
    { expose: true, method: "GET", path: "/courses/:id" },
    async ({ id }: { id: number }): Promise<CourseResponse> => {
        return await CourseService.findOne(id);
    }
)

export const createCourse = api(
    { expose: true, method: "POST", path: "/courses" },
    async (body: CreateCourseDto): Promise<CourseResponse> => {
        return await CourseService.create(body);
    }
)

export const updateCourse = api(
    { expose: true, method: "PUT", path: "/courses/:id" },
    async (body: UpdateCourseDto): Promise<CourseResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await CourseService.update(body.id, body);
    }
)

export const deleteCourse = api(
    { expose: true, method: "DELETE", path: "/courses/:id" },
    async ({ id }: { id: number }): Promise<CourseResponse> => {
        return await CourseService.delete(id);
    }
)


export const getCourseBySlug = api(
    { expose: true, method: "GET", path: "/courses/slug/:slug" },
    async ({ slug }: { slug: string }): Promise<CourseResponse> => {
        return await CourseService.findCourseBySlug(slug);
    }
)

export const getCoursesByType = api(
    { expose: true, method: "GET", path: "/courses/type/:type" },
    async ({ type, page, size, search = "" }: { type: string, page: number, size: number, search: string }): Promise<CourseResponse> => {
        return await CourseService.findCoursesByType(type, page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)
