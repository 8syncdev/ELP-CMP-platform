import { StorageReference, UploadResult } from "firebase/storage";

export interface FileUploadDto {
    file: any;
    folder: string;
}

export interface FileUploadResultDto {
    success: boolean;
    result?: { fullPath: string };
    message?: string;
}

export interface FileInfoDto {
    fullPath: string;
    name: string;
    url: string;
}

export interface FileDownloadDto {
    path: string;
}

export interface FileDownloadResultDto {
    success: boolean;
    result?: { url: string };
    message?: string;
}

export interface FolderListDto {
    folder: string;
}

export interface FolderListResultDto {
    success: boolean;
    result?: { files: FileInfoDto[] };
    message?: string;
}
