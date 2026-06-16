// src/lib/file-upload.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export interface UploadedFile {
    id: string;
    url: string;
}

/**
 * Upload a single file to the server
 * @param file - The file to upload
 * @returns Promise with the uploaded file object containing id and url
 */
export const uploadFile = async (file: File): Promise<UploadedFile> => {
  const formData = new FormData();
  formData.append("images", file);

  console.log("Uploading file:", file.name, file.type, file.size);

  try {
    const response = await axios.post(
      `${baseURL}/fileupload/image`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log("Upload response:", response.data);
    
    const result = response.data;
    
    // Handle different response formats
    if (result.id && result.url) {
      return result as UploadedFile;
    }
    
    // If response is an array of files
    if (Array.isArray(result) && result.length > 0) {
      return result[0] as UploadedFile;
    }
    
    // If response has urls array
    if (result.urls && result.urls.length > 0) {
      return {
        id: result.ids?.[0] || result.urls[0],
        url: result.urls[0],
      };
    }
    
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

/**
 * Upload multiple files to the server
 * @param files - Array of files to upload
 * @returns Promise with array of uploaded file objects
 */
export const uploadMultipleFiles = async (files: File[]): Promise<UploadedFile[]> => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append("images", file);
  });

  try {
    const response = await axios.post(
      `${baseURL}/fileupload/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const result = response.data;
    
    if (Array.isArray(result)) {
      return result as UploadedFile[];
    }
    
    if (result.urls && Array.isArray(result.urls)) {
      return result.urls.map((url: string, index: number) => ({
        id: result.ids?.[index] || url,
        url: url,
        key: result.keys?.[index] || '',
        mimeType: result.mimeTypes?.[index] || files[index]?.type || '',
        size: result.sizes?.[index] || files[index]?.size || 0,
        type: result.types?.[index] || 'image',
      }));
    }
    
    throw new Error("Invalid response format from server");
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
};

/**
 * Delete a file from the server
 * @param fileId - The ID of the file to delete
 * @returns Promise with deletion response
 */
export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await axios.delete(`${baseURL}/fileupload/image/${fileId}`);
  } catch (error) {
    console.error("Delete file error:", error);
    throw error;
  }
};

/**
 * Get file URL for display
 * @param fileData - Can be string (URL/ID) or object with url property
 * @returns The file URL or null
 */
export const getFileUrl = (fileData: string | { url: string } | null | undefined): string | null => {
  if (!fileData) return null;
  
  // If it's a string
  if (typeof fileData === 'string') {
    // If it's already a full URL
    if (fileData.startsWith('http://') || fileData.startsWith('https://')) {
      return fileData;
    }
    // If it's just an ID or path, construct full URL
    if (fileData.startsWith('/uploads/')) {
      return `${baseURL}${fileData}`;
    }
    // If it's just an ID, construct URL (adjust based on your backend)
    return `${baseURL}/fileupload/image/${fileData}`;
  }
  
  // If it's an object with url property
  if (fileData.url) {
    return getFileUrl(fileData.url);
  }
  
  return null;
};

/**
 * Get file ID from file data
 * @param fileData - Can be string (URL/ID) or object with url property
 * @returns The file ID or null
 */
export const getFileId = (fileData: string | { id: string } | null | undefined): string | null => {
  if (!fileData) return null;
  
  if (typeof fileData === 'string') {
    return fileData;
  }
  
  if (fileData.id) {
    return fileData.id;
  }
  
  return null;
};