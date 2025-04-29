import { db } from "./db/submission.db";
import { submissionTable } from "./db/submission.schema";
import {
    SubmissionDto,
    SubmissionResponse,
    CreateSubmissionDto,
    UpdateSubmissionDto,
    CreateSubmissionRequest,
    SubmissionResponseFromExternalService,
    RunTestCodeRequest
} from "./submission.dto";
import { count, sql, eq, asc } from 'drizzle-orm';
import { DataResponse, getOffset, paginatedData } from "../../utils";
import { ExerciseDto, ExerciseService } from "../exercise";

export const SubmissionService = {
    count: async (): Promise<DataResponse> => {
        return {
            success: true,
            result: (await db.$count(submissionTable)) as number
        };
    },

    findOne: async (id: number): Promise<SubmissionResponse> => {
        const [submission] = await db.select()
            .from(submissionTable)
            .where(eq(submissionTable.id, id))
            .limit(1);

        if (!submission) {
            return {
                success: false,
                message: "Submission not found"
            };
        }

        return {
            success: true,
            result: submission as SubmissionDto
        };
    },

    findAll: async (page: number = 1, size: number = 10): Promise<SubmissionResponse> => {
        const offset = getOffset(page, size);
        const total = (await SubmissionService.count()).result as number;

        const results = await db.select()
            .from(submissionTable)
            .limit(size)
            .offset(offset)
            .orderBy(asc(submissionTable.id));

        return {
            success: true,
            result: results as SubmissionDto[],
            pagination: paginatedData({ page, size, count: total })
        };
    },

    create: async (data: CreateSubmissionDto): Promise<SubmissionResponse> => {
        const [submission] = await db.insert(submissionTable)
            .values(data)
            .returning();

        return {
            success: true,
            result: submission as SubmissionDto
        };
    },

    update: async (id: number, data: UpdateSubmissionDto): Promise<SubmissionResponse> => {
        const [submission] = await db.update(submissionTable)
            .set(data)
            .where(eq(submissionTable.id, id))
            .returning();

        if (!submission) {
            return {
                success: false,
                message: "Submission not found"
            };
        }

        return {
            success: true,
            result: submission as SubmissionDto
        };
    },

    delete: async (id: number): Promise<SubmissionResponse> => {
        const [submission] = await db.delete(submissionTable)
            .where(eq(submissionTable.id, id))
            .returning();

        if (!submission) {
            return {
                success: false,
                message: "Submission not found"
            };
        }

        return {
            success: true,
            message: "Submission deleted successfully"
        };
    },

    // External service
    createSubmission: async (data: CreateSubmissionRequest, userId?: number): Promise<DataResponse> => {
        // TODO: Lấy bài tập dựa vào slug
        const exercise = await ExerciseService.findExerciseBySlug(data.exercise_slug);

        if (!exercise.success) {
            return {
                success: false,
                message: "Exercise not found"
            };
        }

        if (!exercise.result || Array.isArray(exercise.result)) {
            return {
                success: false,
                message: Array.isArray(exercise.result)
                    ? exercise.result.length === 0 ? "Exercise not found" : "Multiple exercises found"
                    : "Exercise not found"
            };
        }
        // TODO: Lấy id của bài tập
        const exerciseId = (exercise.result as ExerciseDto).id;

        // TODO: Gửi code đến server để đánh giá
        const externalUrlSubmissionCodeUrl = "https://evaluation-code-via-syntax-python.vercel.app";

        const test_cases = (exercise.result as ExerciseDto).testcases;

        const response = await fetch(`${externalUrlSubmissionCodeUrl}/grader/eval?eval_type=func`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: data.code,
                test_cases: test_cases
            })
        });

        // TODO: Lấy kết quả từ server
        const resultFetchFromExternalService = await response.json() as SubmissionResponseFromExternalService;
        console.log(resultFetchFromExternalService);
        if (!resultFetchFromExternalService) {
            return {
                success: false,
                message: "Failed to evaluate submission"
            };
        }
        // TODO: Nếu là user không đăng nhập, trả về kết quả để không lưu submission
        if (!userId) {
            return {
                success: true,
                result: resultFetchFromExternalService,
                message: "Submission evaluated successfully for anonymous user"
            };
        }

        // TODO: Tính toán thời gian chạy và bộ nhớ sử dụng
        const calculateTotalTimeExecution = resultFetchFromExternalService.tests
            .map((test) => test.execution_time || 0)
            .reduce((a: number, b: number) => a + b, 0);

        const calculateTotalMemoryUsed = resultFetchFromExternalService.tests
            .map((test) => Number(test.memory_used.replace("MB", "")))
            .reduce((a: number, b: number) => a + b, 0);

        // TODO: Lấy submission đã tồn tại của user
        const getSubmissionByUserId = await SubmissionService.findSubmissionByUserId(userId);

        if (!getSubmissionByUserId.result || !Array.isArray(getSubmissionByUserId.result)) {
            return {
                success: false,
                message: "User not found"
            };
        }
        const getExistingSubmission = getSubmissionByUserId.result[0];
        const submissionId = getExistingSubmission.id;

        if (getSubmissionByUserId.success) {
            const updateSubmission = await SubmissionService.update(submissionId, {
                ...getExistingSubmission,
                grade: resultFetchFromExternalService.summary.total,
                execution_time: calculateTotalTimeExecution,
                memory_used: calculateTotalMemoryUsed.toString() + 'MB',
                testcases: resultFetchFromExternalService.tests.map((test) => ({
                    status: test.status,
                    execution_time: test.execution_time || 0,
                    memory_used: Number(test.memory_used?.replace('MB', '')) || 0,
                    error: test.error || null,
                    expected_result: test.expected_result || null
                }))
            });

            if (!updateSubmission.success) {
                return {
                    success: false,
                    message: "Failed to update submission"
                };
            }

            return {
                success: true,
                result: resultFetchFromExternalService,
                message: "Submission updated successfully for registered user"
            };
        }

        // TODO: Tạo submission mới vì user không có submission
        const createSubmission = await SubmissionService.create({
            user_id: Number(userId),
            language: data.language,
            code: data.code,
            exercise_id: exerciseId,
            grade: resultFetchFromExternalService.summary.total,
            execution_time: calculateTotalTimeExecution,
            memory_used: calculateTotalMemoryUsed.toString() + 'MB',
            testcases: resultFetchFromExternalService.tests.map((test) => ({
                status: test.status,
                execution_time: test.execution_time || 0,
                memory_used: Number(test.memory_used?.replace('MB', '')) || 0,
                error: test.error || null,
                expected_result: test.expected_result || null
            }))
        });

        if (!createSubmission.success) {
            return {
                success: false,
                message: "Failed to create submission"
            };
        }

        // TODO: Trả về kết quả
        return {
            success: true,
            result: resultFetchFromExternalService,
            message: "Submission created successfully for registered user"
        };
    },

    findSubmissionByUserId: async (userId: number): Promise<SubmissionResponse> => {
        const submissions = await db.select()
            .from(submissionTable)
            .where(eq(submissionTable.user_id, userId));

        return {
            success: true,
            result: submissions as SubmissionDto[]
        };
    },

    runTestCode: async (data: RunTestCodeRequest): Promise<DataResponse> => {
        const externalUrlSubmissionCodeUrl = "https://evaluation-code-via-syntax-python.vercel.app";

        const response = await fetch(`${externalUrlSubmissionCodeUrl}/grader/eval/test-code`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const resultFetchFromExternalService = await response.json() as SubmissionResponseFromExternalService;

        if (!resultFetchFromExternalService) {
            return {
                success: false,
                message: "Failed to evaluate submission"
            };
        }


        return {
            success: true,
            result: {
                ...resultFetchFromExternalService.tests[0],
                error: resultFetchFromExternalService.summary.error ? resultFetchFromExternalService.summary.error : resultFetchFromExternalService.tests[0].error
            }
        };
    }
};

export default SubmissionService;
