import { uploadFile, getFile, getAllFilesInfo } from "./firebase.util";
import { FileUploadDto, FileUploadResultDto, FileDownloadDto, FileDownloadResultDto, FolderListDto, FolderListResultDto } from "./firebase.dto";

const FirebaseService = {
  uploadFile: async (data: FileUploadDto): Promise<FileUploadResultDto> => {
    try {
      const fullPath = await uploadFile(data.file, data.folder);
      return {
        success: true,
        result: { fullPath },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to upload file",
      };
    }
  },

  getFile: async (data: FileDownloadDto): Promise<FileDownloadResultDto> => {
    try {
      const url = await getFile(data.path);
      return {
        success: true,
        result: { url },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve file URL",
      };
    }
  },

  getAllFilesInfo: async (data: FolderListDto): Promise<FolderListResultDto> => {
    try {
      const files = await getAllFilesInfo(data.folder);
      return {
        success: true,
        result: { files },
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to retrieve file information",
      };
    }
  },
};

export default FirebaseService;

