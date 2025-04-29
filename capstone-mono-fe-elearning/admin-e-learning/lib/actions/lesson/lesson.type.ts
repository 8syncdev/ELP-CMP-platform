import {
    DataResponse,
    Paginated,
    Min,
} from "../base.dto";


export interface LessonDto {
    id: number & (Min<1>);
    slug: string;
    content: string;
    metadata: LessonMetadataDto;
}

export interface CreateLessonDto extends Omit<LessonDto, "id"> { }

export interface UpdateLessonDto extends Partial<LessonDto> { }

export interface LessonResponse extends Omit<DataResponse, "result"> {
    result?: LessonDto[] | LessonDto;
    pagination?: Paginated;
}

export interface ChapterDto {
    chapter_name: string;
    chapter_slug: string;
}

export interface ChaptersByCourseSlugResponse extends Omit<DataResponse, "result"> {
    result?: ChapterDto[];
    pagination?: Paginated;
}

export interface LessonMetadataDto {
    title: string;
    description: string;
    chapter_name: string;
    chapter_slug: string;
    author: string;
    publishedTime: string;
    lastModifiedTime: string;
    tags: string[];
    category: string;
    difficulty: string;
    language: string[];
    privilege: string;
    isPublished: boolean;
    imageAuthor: string;
    thumbnail: string;
}


export interface LessonCourseDto {
    lesson_id: number;
    course_id: number;
}


export interface CreateLessonCourseDto extends Omit<LessonCourseDto, "id"> { }

export interface UpdateLessonCourseDto extends Partial<LessonCourseDto> { }

export interface LessonCourseResponse extends Omit<DataResponse, "result"> {
    result?: LessonCourseDto[] | LessonCourseDto;
    pagination?: Paginated;
}
