import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

export interface TestsStatus {
    status: string;
    test: string;
    execution_time: number | null;
    memory_used: string;
    error: string | null;
    result: any;
    printed_output: string | null;
    expected_output: string | null;
    expected_result: string | null;
}

export interface SubmissionResponseFromExternalService {
    tests: TestsStatus[];
    summary: {
        total: number;
        score: number;
        error: string | null;
    };
    test_details: {
        test_number: number;
        status: string;
    }[];
}

export interface SubmissionMetadata {
    status: string;
    execution_time: number;
    memory_used: number;
    error: string | null;
    expected_result: string | null;
}


export interface SubmissionDto {
    id: number;
    user_id: number;
    exercise_id: number;
    code: string;
    grade: number;
    language: string;
    execution_time: number;
    memory_used: string;
    testcases: SubmissionMetadata[];
}

export interface CreateSubmissionDto extends Omit<SubmissionDto, "id"> { }

export interface UpdateSubmissionDto extends Partial<SubmissionDto> { }

export interface SubmissionResponse extends Omit<DataResponse, "result"> {
    result?: SubmissionDto[] | SubmissionDto;
    pagination?: Paginated;
}

export interface CreateSubmissionRequest {
    code: string;
    language: string;
    exercise_slug: string;
}

export interface RunTestCodeRequest {
    code: string;
    input: string;
}