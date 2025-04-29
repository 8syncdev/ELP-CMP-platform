import { db } from "./db/exercise.db";
import { courseExercisesTable, exerciseTable } from "./db/exercise.schema";
import {
    ExerciseDto,
    ExerciseResponse,
    CreateExerciseDto,
    UpdateExerciseDto,
    ExerciseFilterTime,
    ExerciseDifficulty
} from "./exercise.dto";
import { count, sql, eq, asc, and, desc, inArray, or } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";
import { CourseDto, CourseService } from "../course";

export const ExerciseService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(exerciseTable)) as number
        };
    },

    findOne: async (id: number): Promise<ExerciseResponse> => {
        const [exercise] = await db.select()
            .from(exerciseTable)
            .where(eq(exerciseTable.id, id))
            .limit(1);

        if (!exercise) {
            return {
                success: false,
                message: "Exercise not found"
            };
        }

        return {
            success: true,
            result: exercise as ExerciseDto
        };
    },

    findAll: async (page: number = 1, size: number = 10, search: string = ""): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);
        const total = (await ExerciseService.count()).result as number;

        const parsedSearch = Number(search);

        const whereCondition = search
            ? or(
                sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${search}%`}`,
                sql`${exerciseTable.metadata}->>'description' ILIKE ${`%${search}%`}`,
                sql`${exerciseTable.metadata}->>'difficulty' ILIKE ${`%${search}%`}`,
                sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(search)}`
            )
            : undefined;

        const results = await db.select()
            .from(exerciseTable)
            .where(whereCondition)
            .limit(size)
            .offset(offset)
            .orderBy(asc(exerciseTable.id));

        return {
            success: true,
            result: results as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateExerciseDto): Promise<ExerciseResponse> => {
        const [exercise] = await db.insert(exerciseTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: exercise as ExerciseDto
        };
    },

    update: async (id: number, data: UpdateExerciseDto): Promise<ExerciseResponse> => {
        // Kiểm tra exercise tồn tại
        const [existingExercise] = await db.select()
            .from(exerciseTable)
            .where(eq(exerciseTable.id, id))
            .limit(1);

        if (!existingExercise) {
            return {
                success: false,
                message: "Exercise not found"
            };
        }

        // Lọc bỏ các giá trị falsy và giống với dữ liệu hiện tại
        const updateData: Partial<UpdateExerciseDto> = {};

        if (data.slug && data.slug !== "" && data.slug !== existingExercise.slug) {
            updateData.slug = data.slug;
        }

        if (data.content && data.content !== "" && data.content !== existingExercise.content) {
            updateData.content = data.content;
        }

        if (data.testcases && data.testcases != existingExercise.testcases) {
            updateData.testcases = data.testcases;
        }

        if (data.metadata && data.metadata != existingExercise.metadata) {
            updateData.metadata = data.metadata;
        }

        // Nếu không có dữ liệu cần update
        if (Object.keys(updateData).length === 0) {
            return {
                success: true,
                result: existingExercise as ExerciseDto
            };
        }

        // Thực hiện update
        const [exercise] = await db.update(exerciseTable)
            .set(updateData)
            .where(eq(exerciseTable.id, id))
            .returning();

        return {
            success: true,
            result: exercise as ExerciseDto
        };
    },

    delete: async (id: number): Promise<ExerciseResponse> => {
        const [exercise] = await db.delete(exerciseTable)
            .where(eq(exerciseTable.id, id))
            .returning();

        if (!exercise) {
            return {
                success: false,
                message: "Exercise not found"
            };
        }

        return {
            success: true,
            message: "Exercise deleted successfully"
        };
    },

    // Extend service
    findAllExercisesByTitle: async (page: number = 1, size: number = 10, title: string, filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);
        const total = (await db.select().from(exerciseTable).where(
            sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${title}%`}`
        )).length;

        const results = await db.select()
            .from(exerciseTable)
            .where(
                sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${title}%`}`
            )
            .limit(size)
            .offset(offset)
            .orderBy(
                filterTime === "newest" ? desc(exerciseTable.id) :
                    filterTime === "oldest" ? asc(exerciseTable.id) :
                        asc(exerciseTable.id)
            );

        if (!results) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })

        };
    },

    findExercisesByTags: async (page: number = 1, size: number = 10, tags: string[], filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);
        const total = (await db.select().from(exerciseTable).where(
            sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(tags)}`
        )).length;

        const results = await db.select()
            .from(exerciseTable)
            .where(
                sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(tags)}`
            )
            .limit(size)
            .offset(offset)
            .orderBy(
                filterTime === "newest" ? desc(exerciseTable.id) :
                    filterTime === "oldest" ? asc(exerciseTable.id) :
                        asc(exerciseTable.id)
            );

        if (!results) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })

        };
    },

    findExercisesByTitleAndTags: async (page: number = 1, size: number = 10, title: string, tags: string[], filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);
        const total = (await db.select().from(exerciseTable).where(
            and(
                sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${title}%`}`,
                sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(tags)}`
            )
        )).length;

        const results = await db.select()
            .from(exerciseTable)
            .where(
                and(
                    sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${title}%`}`,
                    sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(tags)}`
                )
            )
            .limit(size)
            .offset(offset)
            .orderBy(
                filterTime === "newest" ? desc(exerciseTable.id) :
                    filterTime === "oldest" ? asc(exerciseTable.id) :
                        asc(exerciseTable.id)
            );

        if (!results) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })

        };
    },

    findExercisesByCourseSlug: async (page: number = 1, size: number = 10, courseSlug: string, filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);
        const total = (await ExerciseService.count()).result as number;

        const course = await CourseService.findCourseBySlug(courseSlug);
        if (!course) {
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

        const courseId = (course.result as CourseDto).id;

        const getExercisesByCourseId = await db.select()
            .from(courseExercisesTable)
            .where(eq(courseExercisesTable.courseId, courseId));

        const exerciseIds = getExercisesByCourseId.map((value) => value.exerciseId);

        const results = await db.select()
            .from(exerciseTable)
            .where(inArray(exerciseTable.id, exerciseIds))
            .limit(size)
            .offset(offset)
            .orderBy(asc(exerciseTable.id));

        if (!results) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: exerciseIds.length })

        };
    },

    findExerciseBySlug: async (slug: string, showSolution: boolean = false): Promise<ExerciseResponse> => {
        const [exercise] = await db.select()
            .from(exerciseTable)
            .where(eq(exerciseTable.slug, slug))
            .limit(1);

        if (!exercise) {
            return {
                success: false,
                message: "Exercise not found"
            };
        }

        return {
            success: true,
            result: {
                ...exercise,
                solution: showSolution || exercise.metadata.privilege === "free" ? exercise.solution : exercise.solution.slice(0, exercise.solution.length / 2)
            } as ExerciseDto
        };
    },


    findExercisesByDifficulty: async (page: number = 1, size: number = 10, difficulty: string, filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const difficultyMap = ["Easy", "Medium Easy", "Medium", "Medium Hard", "Hard", "Super Hard"];

        if (!difficultyMap.includes(difficulty)) {
            return {
                success: false,
                message: "Difficulty not found"
            };
        }

        const offset = getOffset(page, size);
        const total = (await db.select().from(exerciseTable).where(sql`${exerciseTable.metadata}->>'difficulty' = ${difficulty}`)).length;

        const results = await db.select()
            .from(exerciseTable)
            .where(sql`${exerciseTable.metadata}->>'difficulty' = ${difficulty}`)
            .limit(size)
            .offset(offset)
            .orderBy(
                filterTime === "newest" ? desc(exerciseTable.id) :
                    filterTime === "oldest" ? asc(exerciseTable.id) :
                        asc(exerciseTable.id)
            );

        if (!results) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })

        };
    },

    createExerciseByCrawSQL: async (sql_content: string): Promise<ExerciseResponse> => {
        try {
            // Kiểm tra SQL content
            if (!sql_content || sql_content.trim() === '') {
                return {
                    success: false,
                    message: "SQL content is empty"
                };
            }

            // Thực thi SQL an toàn hơn bằng cách sử dụng parameter binding
            const result = await db.execute(
                sql`${sql.raw(sql_content)}`
            );

            if (!result || result.length === 0) {
                return {
                    success: false,
                    message: "No data returned from SQL execution"
                };
            }
            if (Array.isArray(result)) {
                return {
                    success: false,
                    message: "Multiple data returned from SQL execution",
                    result: result.slice(0, 10) as ExerciseDto[]
                };
            }

            return {
                success: true,
                result: result as ExerciseDto
            };
        } catch (error) {
            console.error("SQL execution error:", error);
            return {
                success: false,
                message: `Failed to execute SQL: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    },

    findExercisesByCombinedTitleTagsDifficulty: async (page: number = 1, size: number = 10, title?: string, tags?: string[], difficulty?: string, filterTime: ExerciseFilterTime = "all"): Promise<ExerciseResponse> => {
        const offset = getOffset(page, size);

        // Xây dựng mảng các điều kiện tìm kiếm
        const conditions = [];

        // Thêm điều kiện tìm theo title nếu có
        if (title && title.trim() !== "") {
            conditions.push(sql`${exerciseTable.metadata}->>'title' ILIKE ${`%${title.trim()}%`}`);
        }

        // Thêm điều kiện tìm theo tags nếu có
        if (tags && tags.length > 0 && tags[0] !== "") {
            conditions.push(sql`${exerciseTable.metadata}->'tags' @> ${JSON.stringify(tags)}`);
        }

        // Thêm điều kiện tìm theo difficulty nếu có
        if (difficulty) {
            conditions.push(sql`${exerciseTable.metadata}->>'difficulty' = ${difficulty}`);
        }

        // Kết hợp các điều kiện tìm kiếm
        const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

        // Thực hiện truy vấn đếm tổng số kết quả
        const total = whereClause
            ? (await db.select().from(exerciseTable).where(whereClause)).length
            : (await ExerciseService.count()).result as number;

        // Thực hiện truy vấn lấy kết quả với phân trang
        const query = db.select().from(exerciseTable);

        if (whereClause) {
            query.where(whereClause);
        }

        const results = await query
            .limit(size)
            .offset(offset)
            .orderBy(
                filterTime === "newest" ? desc(exerciseTable.id) :
                    filterTime === "oldest" ? asc(exerciseTable.id) :
                        asc(exerciseTable.id)
            );

        if (!results || results.length === 0) {
            return {
                success: false,
                message: "Exercises not found"
            };
        }

        return {
            success: true,
            result: results.map((value) => ({
                ...value,
                solution: ""
            })) as ExerciseDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    }
};

export default ExerciseService;
