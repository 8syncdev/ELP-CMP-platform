import { ref, uploadBytes, getDownloadURL, listAll, StorageReference, UploadResult } from "firebase/storage";
import { storage } from "./firebase.config";
import { File } from "buffer";

/**
 * Uploads a file to Firebase Storage.
 * @param file - The file to be uploaded.
 * @param folder - The folder path in Firebase Storage where the file will be stored.
 * @returns A Promise that resolves to the full path of the uploaded file.
 * @throws Will throw an error if the upload fails.
 */
export const uploadFile = async (file: File, folder: string): Promise<string> => {
    try {
        // Use original filename instead of generating random ID
        const filename: string = file.name.split(".")[0];
        const fileExtension: string = file.name.split(".").pop() || "";
        const storageRef: StorageReference = ref(
            storage,
            `${folder}${filename}.${fileExtension}`
        );
        const uploadResult: UploadResult = await uploadBytes(storageRef, file);

        return uploadResult.metadata.fullPath;
    } catch (error: unknown) {
        console.error("Error uploading file:", error);
        throw new Error("Failed to upload file");
    }
};

/**
 * Retrieves the download URL for a file in Firebase Storage.
 * @param path - The full path of the file in Firebase Storage.
 * @returns A Promise that resolves to the download URL of the file.
 * @throws Will throw an error if retrieving the URL fails.
 */
export const getFile = async (path: string): Promise<string> => {
    try {
        const fileRef: StorageReference = ref(storage, path);
        return await getDownloadURL(fileRef);
    } catch (error: unknown) {
        console.error("Error getting file URL:", error);
        throw new Error("Failed to retrieve file URL");
    }
};

/**
 * Retrieves all file information from a specific folder in Firebase Storage.
 * @param folder - The folder path in Firebase Storage to list files from.
 * @returns A Promise that resolves to an array of objects containing file information.
 * @throws Will throw an error if listing or retrieving file information fails.
 */
export const getAllFilesInfo = async (folder: string): Promise<Array<{ fullPath: string; name: string; url: string }>> => {
    try {
        const storageRef: StorageReference = ref(storage, folder);
        const listResult = await listAll(storageRef);

        const fileInfoPromises = listResult.items.map(async (item) => {
            return {
                fullPath: item.fullPath,
                name: item.name.split('.')[0],
                url: await getDownloadURL(item)
            };
        });

        return await Promise.all(fileInfoPromises);
    } catch (error: unknown) {
        console.error("Error getting all file information:", error);
        throw new Error("Failed to retrieve file information");
    }
};


/**
 * Retrieves a file from Firebase Storage using folder path and filename (without extension).
 * @param folder - The folder path in Firebase Storage.
 * @param fileName - The name of the file within the folder (without extension).
 * @returns A Promise that resolves to the download URL of the file.
 * @throws Will throw an error if retrieving the file URL fails.
 */
export const getFileByName = async (folder: string, fileName: string): Promise<string> => {
    try {
        const storageRef: StorageReference = ref(storage, folder);
        const listResult = await listAll(storageRef);

        // Find the file that matches the name (ignoring extension)
        const matchingFile = listResult.items.find(item =>
            item.name.split('.')[0] === fileName
        );

        if (!matchingFile) {
            throw new Error(`File with name '${fileName}' not found in folder '${folder}'`);
        }

        return await getDownloadURL(matchingFile);
    } catch (error: unknown) {
        console.error("Error getting file URL:", error);
        throw new Error("Failed to retrieve file URL");
    }
};


/**
 * Retrieves all folder names from a specified path in Firebase Storage.
 * @param path - The path to list folders from (can be root '/' or a specific folder path).
 * @returns A Promise that resolves to an array of folder names.
 * @throws Will throw an error if retrieving folder information fails.
 */
export const getAllFolderNames = async (path: string): Promise<string[]> => {
    try {
        const storageRef: StorageReference = ref(storage, path);
        const listResult = await listAll(storageRef);

        // Extract only the folder names from prefixes
        const folderNames = listResult.prefixes.map(prefix => {
            // Get the last segment of the full path as the folder name
            const pathSegments = prefix.fullPath.split('/');
            return pathSegments[pathSegments.length - 1];
        });

        return folderNames;
    } catch (error: unknown) {
        console.error("Error getting folder names:", error);
        throw new Error("Failed to retrieve folder names");
    }
};

