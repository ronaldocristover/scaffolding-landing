import { apiCall } from '@/lib/api';

export interface FileUploadResponse {
  success: boolean;
  message: string;
  content: {
    url: string;
    key: string;
    originalName: string;
    mimeType: string;
    size: number;
  };
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class FileUploadService {
  private static readonly UPLOAD_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-production-api.com'
    : 'http://localhost:9003';

  /**
   * Upload a single file to the specified folder
   * @param file - The file to upload
   * @param folder - Target folder (e.g., 'temp', 'logos', 'images')
   * @param onProgress - Optional progress callback
   * @returns Promise<FileUploadResponse>
   */
  static async uploadSingleFile(
    file: File,
    folder: string = 'temp',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await apiCall<FileUploadResponse>(
        'POST',
        `${this.UPLOAD_BASE_URL}/upload/single?folder=${folder}`,
        formData
      );

      // For basic progress tracking, we could simulate progress
      if (onProgress) {
        onProgress({ loaded: 100, total: 100, percentage: 100 });
      }

      if (!response.data) {
        throw new Error('Upload failed: No data received from server');
      }
      return response.data;
    } catch (error) {
      throw new Error(`File upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Upload file and return only the URL (convenience method)
   * @param file - The file to upload
   * @param folder - Target folder (e.g., 'temp', 'logos', 'images')
   * @param onProgress - Optional progress callback
   * @returns Promise<string> - The URL of the uploaded file
   */
  static async uploadFileForUrl(
    file: File,
    folder: string = 'temp',
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    const response = await this.uploadSingleFile(file, folder, onProgress);

    if (!response.success) {
      throw new Error(response.message || 'Upload failed');
    }

    return response.content.url;
  }

  /**
   * Validate file before upload
   * @param file - The file to validate
   * @param maxSize - Maximum file size in bytes (default: 5MB)
   * @param allowedTypes - Allowed MIME types (default: common image types)
   * @returns boolean - true if valid
   */
  static validateFile(
    file: File,
    maxSize: number = 5 * 1024 * 1024, // 5MB
    allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  ): boolean {
    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum size of ${(maxSize / 1024 / 1024).toFixed(2)}MB`);
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
    }

    return true;
  }

  /**
   * Get file preview URL for local display before upload
   * @param file - The file to create preview for
   * @returns Promise<string> - Data URL for preview
   */
  static createFilePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith('image/')) {
        reject(new Error('Preview is only available for image files'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to create file preview'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }
}

