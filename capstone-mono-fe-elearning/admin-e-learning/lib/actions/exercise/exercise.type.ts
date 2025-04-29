import { DataResponse, Paginated, Min, } from "../base.dto";


export interface ExerciseMetadataDto {
    title: string;
    keywords: string[];
    metaTitle: string;
    metaDescription: string;
    author: string;
    publishedTime: string;
    lastModifiedTime: string;
    tags: string[];
    difficulty: ExerciseDifficulty;
    language: string[];
    privilege: ExercisePrivilege;
    isPublished: boolean;
    imageAuthor: string;
    thumbnail: string;
}

export interface ExerciseTestcaseDto {
    input: string;
    expected: string;
}

export type ExerciseFilterTime = "all" | "newest" | "oldest"

export interface ExerciseDto {
    id: number & (Min<1>);
    slug: string;
    content: string;
    solution?: string;
    testcases: ExerciseTestcaseDto[];
    metadata: ExerciseMetadataDto;
}

export interface CreateExerciseDto extends Omit<ExerciseDto, "id"> { }

export interface UpdateExerciseDto extends Partial<ExerciseDto> { }

export interface ExerciseResponse extends Omit<DataResponse, "result"> {
    result?: ExerciseDto[] | ExerciseDto;
    pagination?: Paginated;
}

export type ExerciseDifficulty = "Easy" | "Medium Easy" | "Medium" | "Medium Hard" | "Hard" | "Super Hard";

export type ExercisePrivilege = "free" | "registered" | "pricing-1" | "pricing-2" | "pricing-3";

