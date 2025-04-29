import {
    Min,
    Paginated,
    DataResponse
} from "../base.dto";


export type EnrollmentStatus = "pending" | "active" | "expired" | "cancelled";

export interface EnrollmentDto {
    id: number & (Min<1>);
    user_id: number & (Min<1>);
    course_id: number & (Min<1>);
    status: EnrollmentStatus;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}

export interface CreateEnrollmentDto extends Omit<EnrollmentDto, "id"> { }

export interface UpdateEnrollmentDto extends Partial<EnrollmentDto> { }

export interface EnrollmentResponse extends Omit<DataResponse, "result"> {
    result?: EnrollmentDto[] | EnrollmentDto;
    pagination?: Paginated;
}
