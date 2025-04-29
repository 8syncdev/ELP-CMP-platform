import { api, APIError } from "encore.dev/api";
import { SubmissionService } from "./submission.service";
import {
    SubmissionDto,
    SubmissionResponse,
    CreateSubmissionDto,
    UpdateSubmissionDto,
    CreateSubmissionRequest,
    RunTestCodeRequest
} from "./submission.dto";
import { DataResponse } from "../../utils";

export const countSubmissions = api(
    { expose: true, method: "GET", path: "/submissions/count" },
    async (): Promise<DataResponse> => {
        return await SubmissionService.count();
    }
)

export const getSubmissions = api(
    { expose: true, method: "GET", path: "/submissions" },
    async (): Promise<SubmissionResponse> => {
        return await SubmissionService.findAll();
    }
)

export const getSubmission = api(
    { expose: true, method: "GET", path: "/submissions/:id" },
    async ({ id }: { id: number }): Promise<SubmissionResponse> => {
        return await SubmissionService.findOne(id);
    }
)

export const createSubmission = api(
    { expose: true, method: "POST", path: "/submissions" },
    async (body: CreateSubmissionDto): Promise<SubmissionResponse> => {
        return await SubmissionService.create(body);
    }
)

export const updateSubmission = api(
    { expose: true, method: "PUT", path: "/submissions/:id" },
    async (body: UpdateSubmissionDto): Promise<SubmissionResponse> => {
        if (!body.id) {
            return {
                success: false,
                message: "Id is required"
            };
        }
        return await SubmissionService.update(body.id, body);
    }
)

export const deleteSubmission = api(
    { expose: true, method: "DELETE", path: "/submissions/:id" },
    async ({ id }: { id: number }): Promise<SubmissionResponse> => {
        return await SubmissionService.delete(id);
    }
)

export const createSubmissionExternalService = api(
    { expose: true, method: "POST", path: "/submissions/external" },
    async (body: CreateSubmissionRequest): Promise<SubmissionResponse> => {
        return await SubmissionService.createSubmission(body);
    }
)

export const runTestCode = api(
    { expose: true, method: "POST", path: "/submissions/run-test-code" },
    async (body: RunTestCodeRequest): Promise<DataResponse> => {
        return await SubmissionService.runTestCode(body);
    }
)
