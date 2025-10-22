# API Integration Documentation

This document explains how the frontend is integrated with the Master Hong Scaffolding Works API.

## Overview

The application uses Axios for HTTP requests and implements a service layer architecture with mock data support for development. The API endpoints follow the design specified in `api.md`.

## Architecture

### 1. API Client Configuration (`src/lib/api.ts`)
- Axios instance with base configuration
- Request/response interceptors for error handling
- Authentication token management
- Standardized error handling

### 2. Services Layer (`src/services/`)
- **ContactService**: Handles contact information and form submissions
- **ContentService**: Manages website content and localization
- **CarouselService**: Controls carousel items and media uploads

### 3. Mock Data (`src/lib/mock-data.ts`)
- Complete mock implementation of all API responses
- Supports both English and Chinese content
- Realistic data structure matching the API specification

## Usage Examples

### Getting Contact Information

```typescript
import { ContactService } from '@/services';

const response = await ContactService.getContactInfo();
if (response.success) {
  console.log('WhatsApp:', response.data.whatsapp.number);
  console.log('Phone:', response.data.phone.main);
}
```

### Submitting Contact Form

```typescript
import { ContactService } from '@/services';

const formData = {
  name: "John Doe",
  email: "john@example.com",
  phone: "+852 12345678",
  projectType: "residential",
  location: "Kowloon",
  message: "Need scaffolding services",
  // ... other fields
};

const response = await ContactService.submitContactForm(formData);
if (response.success) {
  console.log('Form submitted with ID:', response.data.id);
}
```

### Getting Website Content

```typescript
import { ContentService } from '@/services';

// Get content in Chinese
const response = await ContentService.getContent('zh');
if (response.success) {
  console.log('Hero title:', response.data.hero.title);
  console.log('Services:', response.data.services);
}
```

### Managing Carousel Items

```typescript
import { CarouselService } from '@/services';

// Get carousel items
const response = await CarouselService.getCarouselItems();
if (response.success) {
  console.log('Carousel items:', response.data.items);
}

// Upload new media
const uploadResponse = await CarouselService.uploadMedia({
  file: fileInput.files[0],
  type: 'carousel',
  alt: 'New scaffolding project'
});
```

## Mock vs Real API

### Mock Mode (Development)
- Automatically enabled when `NEXT_PUBLIC_API_URL` is not set
- Uses `mock-data.ts` for responses
- Simulates network delays for realistic UX
- Logs API calls to console for debugging

### Real API Mode (Production)
- Uses actual API endpoints via Axios
- Requires proper CORS configuration
- Supports authentication tokens
- Handles real network errors

### Environment Variables

```env
# Development (uses mock data)
# NEXT_PUBLIC_API_URL=

# Production (uses real API)
NEXT_PUBLIC_API_URL=https://api.masterhongscaffolding.com
```

## Error Handling

All services return a standardized `ApiResponse<T>` format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    // ... other metadata
  };
}
```

### Error Response Example

```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",
    message: "Invalid input data",
    details: {
      field: "email",
      issue: "Invalid email format"
    }
  },
  meta: {
    timestamp: "2025-01-22T15:30:00Z"
  }
}
```

## Form Validation

Services include built-in validation:

```typescript
import { ContactService } from '@/services';

const formData = { /* form data */ };
const validation = ContactService.validateContactForm(formData);

if (!validation.isValid) {
  console.log('Validation errors:', validation.errors);
  // { email: "Invalid email format", phone: "Invalid phone number" }
}
```

## File Uploads

For media uploads with files:

```typescript
const uploadData = {
  file: fileInput.files[0], // File object
  type: 'carousel',
  alt: 'Project image',
  title: 'Optional title'
};

const validation = CarouselService.validateMediaUpload(uploadData);
if (validation.isValid) {
  const response = await CarouselService.uploadMedia(uploadData);
}
```

## Integration with Components

### Example: Contact Form Component

```typescript
"use client";

import { useState } from "react";
import { ContactService } from "@/services";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    // ... other fields
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await ContactService.submitContactForm(formData);

    if (response.success) {
      // Handle success
      alert('Form submitted successfully!');
    } else {
      // Handle error
      alert(response.error?.message || 'Submission failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## Best Practices

1. **Always check `success` property** before accessing `data`
2. **Handle loading states** for better UX
3. **Validate forms on client-side** before sending to API
4. **Use try-catch blocks** for network error handling
5. **Implement retry logic** for failed requests
6. **Sanitize user inputs** before sending to API
7. **Use proper TypeScript types** for type safety

## Testing

Mock data makes testing easy:

```typescript
// Test component without actual API calls
jest.mock('@/services/contact-service');

const mockResponse = {
  success: true,
  data: { id: 'test_id', status: 'received' }
};

ContactService.submitContactForm.mockResolvedValue(mockResponse);
```

## Migration to Real API

When the real API is ready:

1. Set `NEXT_PUBLIC_API_URL` environment variable
2. Deploy API endpoints matching `api.md` specification
3. Ensure CORS is properly configured
4. Test all endpoints in production environment
5. Monitor API performance and error rates

The services will automatically switch from mock to real API based on the environment configuration.