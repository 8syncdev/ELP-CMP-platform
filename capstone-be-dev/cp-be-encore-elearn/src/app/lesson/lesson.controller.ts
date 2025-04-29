import { api, APIError } from "encore.dev/api";
import { LessonService, LessonCourseService } from "./lesson.service";
import {
    LessonDto,
    LessonResponse,
    CreateLessonDto,
    UpdateLessonDto,
    ChaptersByCourseSlugResponse,
    LessonCourseResponse,
    CreateLessonCourseDto
} from "./lesson.dto";
import { DataResponse } from "../../utils";

export const countLessons = api(
    { expose: true, method: "GET", path: "/lessons/count" },
    async (): Promise<DataResponse> => {
        return await LessonService.count();
    }
)

export const getLessons = api(
    { expose: true, method: "GET", path: "/lessons" },
    async ({ page, size, search = "" }: { page: number, size: number, search: string }): Promise<LessonResponse> => {
        return await LessonService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getLesson = api(
    { expose: true, method: "GET", path: "/lessons/:id" },
    async ({ id }: { id: number }): Promise<LessonResponse> => {
        return await LessonService.findOne(id);
    }
)

export const createLesson = api(
    { expose: true, method: "POST", path: "/lessons" },
    async (body: CreateLessonDto): Promise<LessonResponse> => {
        return await LessonService.create(body);
    }
)

export const updateLesson = api(
    { expose: true, method: "PUT", path: "/lessons/:id" },
    async (body: UpdateLessonDto): Promise<LessonResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await LessonService.update(body.id, body);
    }
)

export const deleteLesson = api(
    { expose: true, method: "DELETE", path: "/lessons/:id" },
    async ({ id }: { id: number }): Promise<LessonResponse> => {
        return await LessonService.delete(id);
    }
)

export const getChaptersByCoursesSlug = api(
    { expose: true, method: "GET", path: "/lessons/chapters/:courseSlug" },
    async ({ courseSlug, page, size }: { courseSlug: string, page: number, size: number }): Promise<ChaptersByCourseSlugResponse> => {
        return await LessonService.getChaptersByCoursesSlug(courseSlug, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

export const getLessonsByChapterSlug = api(
    { expose: true, method: "GET", path: "/lessons/chapter/:chapterSlug" },
    async ({ chapterSlug, page, size }: { chapterSlug: string, page: number, size: number }): Promise<LessonResponse> => {
        return await LessonService.getLessonsByChapterSlug(chapterSlug, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

export const getLessonBySlug = api(
    { expose: true, method: "GET", path: "/lessons/slug/:slug" },
    async ({ slug }: { slug: string }): Promise<LessonResponse> => {
        return await LessonService.getLessonBySlug(slug);
    }
)

// LessonCourse Controllers
export const createLessonCourse = api(
    { expose: true, method: "POST", path: "/lesson-courses" },
    async (body: CreateLessonCourseDto): Promise<LessonCourseResponse> => {
        return await LessonCourseService.create(body);
    }
)

export const getLessonCourses = api(
    { expose: true, method: "GET", path: "/lesson-courses" },
    async ({ page, size, search = "" }: { page: number, size: number, search: string }): Promise<LessonCourseResponse> => {
        return await LessonCourseService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getLessonCourse = api(
    { expose: true, method: "GET", path: "/lesson-courses/:lessonId/:courseId" },
    async ({ lessonId, courseId }: { lessonId: number, courseId: number }): Promise<LessonCourseResponse> => {
        return await LessonCourseService.findOne(lessonId, courseId);
    }
)

export const updateLessonCourse = api(
    { expose: true, method: "PUT", path: "/lesson-courses/:lessonId/:courseId" },
    async ({ lessonId, courseId, ...body }: { lessonId: number, courseId: number } & CreateLessonCourseDto): Promise<LessonCourseResponse> => {
        return await LessonCourseService.update(lessonId, courseId, body);
    }
)

export const deleteLessonCourse = api(
    { expose: true, method: "DELETE", path: "/lesson-courses/:lessonId/:courseId" },
    async ({ lessonId, courseId }: { lessonId: number, courseId: number }): Promise<LessonCourseResponse> => {
        return await LessonCourseService.delete(lessonId, courseId);
    }
)

export const getLessonCoursesByCourseId = api(
    { expose: true, method: "GET", path: "/lesson-courses/course/:courseId" },
    async ({ courseId, page, size }: { courseId: number, page: number, size: number }): Promise<LessonCourseResponse> => {
        return await LessonCourseService.findByCourseId(courseId, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

export const getLessonCoursesByLessonId = api(
    { expose: true, method: "GET", path: "/lesson-courses/lesson/:lessonId" },
    async ({ lessonId, page, size }: { lessonId: number, page: number, size: number }): Promise<LessonCourseResponse> => {
        return await LessonCourseService.findByLessonId(lessonId, page > 0 ? page : 1, size > 0 ? size : 10);
    }
)

