// API Services Index
// Export all services for easy importing

export { default as ContactService } from './contact-service';
export { default as ContentService } from './content-service';
export { default as CarouselService } from './carousel-service';

// Export types for easy importing
export type {
  ContactInfo,
  ContactFormRequest,
  ContactFormResponse,
} from './contact-service';

export type {
  HeroContent,
  AboutContent,
  Service,
  WebsiteContent,
  ContentUpdateRequest,
} from './content-service';

export type {
  CarouselItem,
  CarouselResponse,
  MediaUploadRequest,
  MediaUploadResponse,
} from './carousel-service';

// Re-export API client and utilities
export { apiClient, apiCall } from '@/lib/api';
export type { ApiResponse } from '@/lib/api';
export { mockContactInfo, mockContent, mockCarouselItems } from '@/lib/mock-data';