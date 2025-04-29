import { api, APIError } from "encore.dev/api";
import FirebaseService from "./firebase.service";
import {
  FileUploadDto,
  FileUploadResultDto,
  FileDownloadDto,
  FileDownloadResultDto,
  FolderListDto,
  FolderListResultDto
} from "./firebase.dto";
import { getAllFolderNames, getFileByName } from "./firebase.util";

/**
 * Upload a file
 */
export const uploadFile = api(
  { expose: true, method: "POST", path: "/firebase/upload" },
  async (data: FileUploadDto): Promise<FileUploadResultDto> => {
    try {
      return await FirebaseService.uploadFile(data);
    } catch (error) {
      throw APIError.aborted(error?.toString() || "Error uploading file");
    }
  }
);

/**
 * Download a file
 */
export const downloadFile = api(
  { expose: true, method: "GET", path: "/firebase/download" },
  async (data: FileDownloadDto): Promise<FileDownloadResultDto> => {
    try {
      return await FirebaseService.getFile(data);
    } catch (error) {
      throw APIError.aborted(error?.toString() || "Error downloading file");
    }
  }
);

/**
 * List files in a folder
 */
export const listFiles = api(
  { expose: true, method: "GET", path: "/firebase/list" },
  async (data: FolderListDto): Promise<FolderListResultDto> => {
    try {
      return await FirebaseService.getAllFilesInfo(data);
    } catch (error) {
      throw APIError.aborted(error?.toString() || "Error listing files");
    }
  }
);

/**
 * Download a file by name
 */
export const downloadFileByName = api(
  { expose: true, method: "GET", path: "/firebase/download-by-name" },
  async (data: { folder: string; fileName: string }): Promise<FileDownloadResultDto> => {
    try {
      const url = await getFileByName(data.folder, data.fileName);
      return {
        success: true,
        result: { url }
      };
    } catch (error) {
      throw APIError.aborted(error?.toString() || "Error downloading file");
    }
  }
);


/**
 * List all folder names in a path
 */
export const listFolders = api(
  { expose: true, method: "GET", path: "/firebase/folders" },
  async (data: { path: string }): Promise<{ success: boolean; result?: { folders: string[] }; message?: string }> => {
    try {
      const folders = await getAllFolderNames(data.path);
      return {
        success: true,
        result: { folders }
      };
    } catch (error) {
      throw APIError.aborted(error?.toString() || "Error listing folders");
    }
  }
);


