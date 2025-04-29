import { DataResponse, Paginated } from "../../utils";
import {
    MinLen,
    MaxLen,
    Min,
} from "encore.dev/validate"

export interface CourseDto {
    id: number & (Min<1>);
    slug: string;
    content: string;
    metadata: CourseMetadataDto;
}

export interface CourseMetadataDto {
    // Thông tin cơ bản
    name: string;
    description: string;

    // Thông tin giảng viên
    instructor_name: string;
    instructor_contact: string;
    instructor_email: string;
    instructor_avatar: string;

    // Chi tiết khóa học
    duration: string;
    level: string;
    type: string;
    original_price: number;
    discounted_price: number;

    // Hình ảnh
    thumbnail: string;

    // Trạng thái
    published_at: string;
    is_published: boolean;
}

export interface CreateCourseDto extends Omit<CourseDto, "id"> { }

export interface UpdateCourseDto extends Partial<CourseDto> { }

export interface CourseResponse extends Omit<DataResponse, "result"> {
    result?: CourseDto[] | CourseDto;
    pagination?: Paginated;
}
