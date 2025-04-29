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
