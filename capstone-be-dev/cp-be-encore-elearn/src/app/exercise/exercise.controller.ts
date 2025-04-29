import { api, APIError } from "encore.dev/api";
import { ExerciseService } from "./exercise.service";
import {
    ExerciseDto,
    ExerciseResponse,
    CreateExerciseDto,
    UpdateExerciseDto,
    ExerciseFilterTime,
    ExerciseDifficulty
} from "./exercise.dto";
import { DataResponse } from "../../utils";
import { getMyAuthData } from "../../dev/auth";

export const countExercises = api(
    { expose: true, method: "GET", path: "/exercises/count" },
    async (): Promise<DataResponse> => {
        return await ExerciseService.count();
    }
)

export const getExercises = api(
    { expose: true, method: "GET", path: "/exercises" },
    async ({ page = 1, size = 10, search = "" }: { page?: number, size?: number, search?: string }): Promise<ExerciseResponse> => {
        return await ExerciseService.findAll(page > 0 ? page : 1, size > 0 ? size : 10, search);
    }
)

export const getExercise = api(
    { expose: true, method: "GET", path: "/exercises/:id" },
    async ({ id }: { id: number }): Promise<ExerciseResponse> => {
        return await ExerciseService.findOne(id);
    }
)


export const createExercise = api(
    { expose: true, method: "POST", path: "/exercises" },
    async (body: CreateExerciseDto): Promise<ExerciseResponse> => {
        return await ExerciseService.create(body);
    }
)

export const updateExercise = api(
    { expose: true, method: "PUT", path: "/exercises/:id" },
    async (body: UpdateExerciseDto): Promise<ExerciseResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await ExerciseService.update(body.id, body);
    }
)

export const deleteExercise = api(
    { expose: true, method: "DELETE", path: "/exercises/:id" },
    async ({ id }: { id: number }): Promise<ExerciseResponse> => {
        return await ExerciseService.delete(id);
    }
)



// Extend service
export const getExercisesByTitle = api(
    { expose: true, method: "GET", path: "/exercises/title" },
    async ({ page = 1, size = 10, title, filterTime = "all" }: { page?: number, size?: number, title: string, filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findAllExercisesByTitle(page > 0 ? page : 1, size > 0 ? size : 10, title, filterTime);
    }
)

export const getExercisesByTags = api(
    { expose: true, method: "POST", path: "/exercises/tags" },
    async ({ page = 1, size = 10, tags, filterTime = "all" }: { page?: number, size?: number, tags: string[], filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findExercisesByTags(page > 0 ? page : 1, size > 0 ? size : 10, tags, filterTime);
    }
)

export const getExercisesByTitleAndTags = api(
    { expose: true, method: "POST", path: "/exercises/title/tags" },
    async ({ page = 1, size = 10, title, tags, filterTime = "all" }: { page?: number, size?: number, title: string, tags: string[], filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findExercisesByTitleAndTags(page > 0 ? page : 1, size > 0 ? size : 10, title, tags, filterTime);
    }
)

export const getExercisesByCourseSlug = api(
    { expose: true, method: "GET", path: "/exercises/course/:slug" },
    async ({ page = 1, size = 10, slug, filterTime = "all" }: { page?: number, size?: number, slug: string, filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findExercisesByCourseSlug(page > 0 ? page : 1, size > 0 ? size : 10, slug, filterTime);
    }
)

export const getExerciseBySlug = api(
    { expose: true, method: "GET", path: "/exercises/slug/:slug" },
    async ({ slug }: { slug: string }): Promise<ExerciseResponse> => {
        const myAuth = getMyAuthData();
        console.log(myAuth);
        if (myAuth) {
            return await ExerciseService.findExerciseBySlug(slug, true);
        }
        return await ExerciseService.findExerciseBySlug(slug);

    }
)

export const getExercisesByDifficulty = api(
    { expose: true, method: "GET", path: "/exercises/difficulty/:difficulty" },
    async ({ page = 1, size = 10, difficulty, filterTime = "all" }: { page?: number, size?: number, difficulty: string, filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findExercisesByDifficulty(page > 0 ? page : 1, size > 0 ? size : 10, difficulty, filterTime);
    }
)

export const getExercisesByCombinedTitleTagsDifficulty = api(
    { expose: true, method: "POST", path: "/exercises/combined" },
    async ({ page = 1, size = 10, title, tags, difficulty, filterTime = "all" }: { page?: number, size?: number, title: string, tags: string[], difficulty: string, filterTime: ExerciseFilterTime }): Promise<ExerciseResponse> => {
        return await ExerciseService.findExercisesByCombinedTitleTagsDifficulty(page > 0 ? page : 1, size > 0 ? size : 10, title, tags, difficulty, filterTime);
    }
)

