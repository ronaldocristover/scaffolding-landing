import { apiCall, ApiResponse } from '@/lib/api';
import { mockCarouselItems } from '@/lib/mock-data';

// Types for carousel endpoints
export interface CarouselItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  alt?: string;
  videoId?: string;
  thumbnail?: string;
  title: string;
  order: number;
  active: boolean;
}

export interface CarouselResponse {
  items: CarouselItem[];
}

export interface MediaUploadRequest {
  file: File;
  type: 'carousel' | 'portfolio' | 'company';
  alt: string;
  title?: string;
}

export interface MediaUploadResponse {
  id: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

// Mock implementation for carousel endpoints
export class CarouselService {
  // Check if we should use mock data (when API is not available)
  private static useMock = !process.env.NEXT_PUBLIC_API_URL || process.env.NODE_ENV === 'development';

  /**
   * Get carousel items
   * GET /api/carousel
   */
  static async getCarouselItems(): Promise<ApiResponse<CarouselResponse>> {
    if (this.useMock) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 150));

      // Sort items by order and only return active items
      const sortedItems = mockCarouselItems
        .filter(item => item.active)
        .sort((a, b) => a.order - b.order);

      return {
        success: true,
        data: {
          items: sortedItems,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<CarouselResponse>('GET', '/carousel');
  }

  /**
   * Upload new media file (Admin only)
   * POST /api/media/upload
   */
  static async uploadMedia(
    uploadData: MediaUploadRequest
  ): Promise<ApiResponse<MediaUploadResponse>> {
    if (this.useMock) {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock response
      const mockResponse: MediaUploadResponse = {
        id: `media_${Date.now()}`,
        url: `/uploads/${uploadData.file.name}`,
        size: uploadData.file.size,
        type: uploadData.file.type,
        uploadedAt: new Date().toISOString(),
      };

      // Log upload for development
      console.log('Media uploaded:', {
        file: uploadData.file.name,
        size: uploadData.file.size,
        type: uploadData.type,
        alt: uploadData.alt,
      });

      return {
        success: true,
        data: mockResponse,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    // For real API, we need to use FormData for file uploads
    const formData = new FormData();
    formData.append('file', uploadData.file);
    formData.append('type', uploadData.type);
    formData.append('alt', uploadData.alt);
    if (uploadData.title) {
      formData.append('title', uploadData.title);
    }

    try {
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
        headers: {
          // Don't set Content-Type header when using FormData
          // Browser will set it automatically with boundary
          'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
        },
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 'UPLOAD_ERROR',
          message: error.message || 'Failed to upload file',
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }
  }

  /**
   * Update carousel item (Admin only)
   * PUT /api/carousel/:id
   */
  static async updateCarouselItem(
    id: string,
    updateData: Partial<CarouselItem>
  ): Promise<ApiResponse<CarouselItem>> {
    if (this.useMock) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      // Log update for development
      console.log('Carousel item updated:', { id, ...updateData });

      // Find and return the updated item
      const item = mockCarouselItems.find(item => item.id === id);
      if (!item) {
        return {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Carousel item not found',
          },
          meta: {
            timestamp: new Date().toISOString(),
          },
        };
      }

      return {
        success: true,
        data: { ...item, ...updateData },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<CarouselItem>('PUT', `/carousel/${id}`, updateData);
  }

  /**
   * Delete carousel item (Admin only)
   * DELETE /api/carousel/:id
   */
  static async deleteCarouselItem(id: string): Promise<ApiResponse<void>> {
    if (this.useMock) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      // Log deletion for development
      console.log('Carousel item deleted:', id);

      return {
        success: true,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };
    }

    return apiCall<void>('DELETE', `/carousel/${id}`);
  }

  /**
   * Validate media upload data
   */
  static validateMediaUpload(uploadData: Partial<MediaUploadRequest>): {
    isValid: boolean;
    errors: Record<string, string>;
  } {
    const errors: Record<string, string> = {};

    if (!uploadData.file) {
      errors.file = 'File is required';
    } else {
      // Check file size (5MB limit)
      if (uploadData.file.size > 5 * 1024 * 1024) {
        errors.file = 'File size must be less than 5MB';
      }

      // Check file type
      const allowedTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'video/mp4',
        'video/mov',
      ];
      if (!allowedTypes.includes(uploadData.file.type)) {
        errors.file = 'File type not supported. Allowed: JPEG, PNG, WebP, MP4, MOV';
      }
    }

    if (!uploadData.type || !['carousel', 'portfolio', 'company'].includes(uploadData.type)) {
      errors.type = 'Type must be one of: carousel, portfolio, company';
    }

    if (!uploadData.alt || uploadData.alt.trim().length < 3) {
      errors.alt = 'Alt text must be at least 3 characters long';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default CarouselService;