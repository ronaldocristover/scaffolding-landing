# API Design Documentation - Master Hong Scaffolding Works

## Overview

This document outlines the complete API design for transforming the static Master Hong Scaffolding Works landing page into a dynamic, data-driven application.

## Base Configuration

- **Base URL**: `/api`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token for admin endpoints
- **Rate Limiting**: 10 requests per minute for form submissions

## Standard Response Format

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
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    timestamp: string;
  };
}
```

## API Endpoints

### 1. Contact Management

#### GET /api/contact-info
**Description**: Retrieve dynamic contact information
**Response**:
```json
{
  "success": true,
  "data": {
    "whatsapp": {
      "number": "+852 6806-0108",
      "link": "https://wa.me/85268060108",
      "available": true,
      "workingHours": "Mon-Sat 9:00-18:00"
    },
    "phone": {
      "main": "+852 3020-6719",
      "backup": "+852 6806-0108",
      "available": true
    },
    "email": {
      "address": "leego.scaffolding@gmail.com",
      "responseTime": "Within 24 hours"
    },
    "facebook": {
      "url": "https://www.facebook.com/MasterHongScaffolding/",
      "active": true
    },
    "address": {
      "full": "Hong Kong",
      "areas": ["Kowloon", "Hong Kong Island", "New Territories"]
    }
  }
}
```

#### POST /api/contact-form
**Description**: Submit contact form
**Request Body**:
```json
{
  "name": "John Doe",
  "company": "ABC Construction",
  "email": "john@example.com",
  "phone": "+852 12345678",
  "subject": "Scaffolding Inquiry",
  "message": "Need scaffolding for residential project",
  "projectType": "residential",
  "location": "Kowloon",
  "urgency": "normal"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "contact_123456",
    "status": "received",
    "estimatedResponse": "2-4 hours",
    "followUpDate": "2025-01-23T10:00:00Z"
  }
}
```

### 2. Quote Request Management

#### POST /api/quote-request
**Description**: Submit detailed quote request with file uploads
**Request Body** (multipart/form-data):
```
customerName: string
companyName?: string
email: string
phone: string
location: string
projectType: 'residential' | 'commercial' | 'industrial'
projectDescription: string
height: number
width: number
length: number
duration: number (days)
accessDifficulty: 'easy' | 'medium' | 'difficult'
urgency: 'normal' | 'urgent'
sitePhotos: File[] (max 5 files, 5MB each)
additionalRequirements?: string
```

**Response**:
```json
{
  "success": true,
  "data": {
    "quoteId": "QUOTE_789012",
    "status": "pending_survey",
    "estimatedQuoteDate": "2025-01-25T00:00:00Z",
    "surveyRequired": true,
    "nextSteps": [
      "Our team will contact you within 24 hours",
      "Site survey will be scheduled",
      "Detailed quote will be provided"
    ],
    "estimatedPriceRange": {
      "min": 15000,
      "max": 25000,
      "currency": "HKD"
    }
  }
}
```

#### GET /api/quote/:quoteId
**Description**: Retrieve quote status and details
**Response**:
```json
{
  "success": true,
  "data": {
    "quoteId": "QUOTE_789012",
    "status": "survey_completed",
    "detailedQuote": {
      "materials": 8000,
      "labor": 6000,
      "transportation": 1500,
      "safetyMeasures": 2000,
      "total": 17500,
      "currency": "HKD",
      "validUntil": "2025-02-23T23:59:59Z"
    },
    "timeline": [
      {
        "step": "Initial Consultation",
        "status": "completed",
        "completedAt": "2025-01-22T14:30:00Z"
      },
      {
        "step": "Site Survey",
        "status": "completed",
        "completedAt": "2025-01-23T10:00:00Z"
      },
      {
        "step": "Quote Provided",
        "status": "pending",
        "estimatedDate": "2025-01-25T00:00:00Z"
      }
    ]
  }
}
```

### 3. Content Management

#### GET /api/content
**Description**: Retrieve dynamic website content
**Query Parameters**: `locale=en|zh`

**Response**:
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "Professional Scaffolding Services",
      "subtitle": "20+ Years of Experience in Hong Kong",
      "ctaText": "Get Free Quote",
      "backgroundImage": "/hero-bg.jpg"
    },
    "about": {
      "title": "About Master Hong Scaffolding",
      "description": "Professional scaffolding services...",
      "stats": [
        {
          "label": "Years Experience",
          "value": "20+"
        },
        {
          "label": "Projects Completed",
          "value": "500+"
        },
        {
          "label": "Happy Clients",
          "value": "300+"
        }
      ]
    },
    "services": [
      {
        "id": "residential",
        "title": "Residential Scaffolding",
        "description": "Safe scaffolding for homes and apartments",
        "icon": "/icons/residential.svg",
        "features": ["Safety Certified", "Quick Setup", "Affordable"]
      }
    ]
  }
}
```

#### PUT /api/content (Admin)
**Description**: Update website content
**Authentication Required**: Admin Bearer Token

**Request Body**:
```json
{
  "section": "hero",
  "locale": "en",
  "content": {
    "title": "Updated Hero Title",
    "subtitle": "Updated subtitle"
  }
}
```

### 4. Media Management

#### GET /api/carousel
**Description**: Retrieve carousel items
**Response**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "carousel_1",
        "type": "image",
        "url": "/banner-1.jpeg",
        "alt": "Scaffolding project 1",
        "title": "Commercial Project in Central",
        "order": 1,
        "active": true
      },
      {
        "id": "carousel_2",
        "type": "video",
        "videoId": "dQw4w9WgXcQ",
        "thumbnail": "/video-thumb.jpg",
        "title": "Company Introduction",
        "order": 2,
        "active": true
      }
    ]
  }
}
```

#### POST /api/media/upload (Admin)
**Description**: Upload new media files
**Authentication Required**: Admin Bearer Token
**Content-Type**: multipart/form-data

**Request Body**:
```
file: File
type: 'carousel' | 'portfolio' | 'company'
alt: string
title?: string
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "media_123456",
    "url": "/uploads/image_123456.jpg",
    "size": 2048576,
    "type": "image/jpeg",
    "uploadedAt": "2025-01-22T15:30:00Z"
  }
}
```

### 5. Portfolio Management

#### GET /api/portfolio
**Description**: Retrieve completed projects
**Query Parameters**: `page=1&limit=10&category=residential`

**Response**:
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "project_001",
        "title": "Residential Building in Mong Kok",
        "category": "residential",
        "location": "Mong Kok, Kowloon",
        "completionDate": "2024-12-15",
        "duration": "14 days",
        "height": "20 meters",
        "description": "Complete scaffolding solution for 10-story residential building",
        "images": [
          "/projects/project_001_1.jpg",
          "/projects/project_001_2.jpg"
        ],
        "challenges": [
          "Limited space access",
          "Working above busy street"
        ],
        "client": "Private Property Owner"
      }
    ],
    "categories": [
      {"id": "residential", "name": "Residential", "count": 45},
      {"id": "commercial", "name": "Commercial", "count": 32},
      {"id": "industrial", "name": "Industrial", "count": 18}
    ]
  },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 95,
      "totalPages": 10
    }
  }
}
```

### 6. Services & Pricing

#### GET /api/services
**Description**: Retrieve available services
**Response**:
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": "residential_scaffolding",
        "name": "Residential Scaffolding",
        "description": "Safe and reliable scaffolding for residential properties",
        "basePrice": 150,
        "unit": "per square meter",
        "minCharge": 3000,
        "features": [
          "Safety certified equipment",
          "Professional installation",
          "Regular safety inspections",
          "Insurance coverage"
        ],
        "suitableFor": [
          "Apartment buildings",
          "Townhouses",
          "Villas",
          "Renovation projects"
        ],
        "timeline": "1-3 days setup"
      }
    ]
  }
}
```

#### POST /api/pricing/calculate
**Description**: Calculate estimated pricing
**Request Body**:
```json
{
  "serviceType": "residential_scaffolding",
  "dimensions": {
    "height": 15,
    "width": 10,
    "length": 8
  },
  "duration": 14,
  "location": "kowloon",
  "accessDifficulty": "medium",
  "specialRequirements": ["weather_protection", "edge_protection"]
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "basePrice": 12000,
    "breakdown": {
      "materials": 7200,
      "labor": 3600,
      "transportation": 800,
      "safetyEquipment": 400,
      "specialRequirements": {
        "weather_protection": 800,
        "edge_protection": 600
      }
    },
    "total": 13400,
    "currency": "HKD",
    "validFor": "7 days",
    "discounts": [
      {
        "type": "long_term",
        "description": "Projects over 30 days",
        "discount": 10,
        "amount": 1340
      }
    ],
    "finalTotal": 12060
  }
}
```

### 7. Testimonials

#### GET /api/testimonials
**Description**: Retrieve customer testimonials
**Response**:
```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": "testimonial_001",
        "customerName": "Mr. Chan",
        "company": "Chan Construction",
        "projectType": "commercial",
        "rating": 5,
        "comment": "Professional team, completed on time, very satisfied with the service.",
        "projectDate": "2024-11-20",
        "verified": true,
        "response": {
          "message": "Thank you for your feedback! We appreciate your business.",
          "from": "Master Hong Team",
          "date": "2024-11-21"
        }
      }
    ],
    "statistics": {
      "averageRating": 4.8,
      "totalReviews": 127,
      "recommendationRate": 96
    }
  }
}
```

### 8. Admin Dashboard APIs

#### GET /api/admin/inquiries
**Description**: Retrieve all customer inquiries (Admin)
**Authentication Required**: Admin Bearer Token
**Query Parameters**: `status=pending&page=1&limit=20`

**Response**:
```json
{
  "success": true,
  "data": {
    "inquiries": [
      {
        "id": "inquiry_001",
        "type": "quote_request",
        "customerName": "John Doe",
        "company": "ABC Construction",
        "email": "john@example.com",
        "phone": "+852 12345678",
        "status": "new",
        "priority": "normal",
        "assignedTo": null,
        "createdAt": "2025-01-22T14:30:00Z",
        "lastUpdated": "2025-01-22T14:30:00Z",
        "projectDetails": {
          "location": "Kowloon",
          "projectType": "commercial",
          "estimatedSize": "medium"
        }
      }
    ],
    "summary": {
      "total": 45,
      "new": 12,
      "in_progress": 23,
      "completed": 8,
      "cancelled": 2
    }
  }
}
```

#### PUT /api/admin/inquiries/:id/status
**Description**: Update inquiry status (Admin)
**Authentication Required**: Admin Bearer Token

**Request Body**:
```json
{
  "status": "in_progress",
  "assignedTo": "staff_001",
  "notes": "Customer contacted, survey scheduled for tomorrow",
  "nextFollowUp": "2025-01-23T10:00:00Z"
}
```

### Error Responses

#### Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  },
  "meta": {
    "timestamp": "2025-01-22T15:30:00Z"
  }
}
```

#### Common Error Codes
- `VALIDATION_ERROR`: Invalid input data
- `NOT_FOUND`: Resource not found
- `UNAUTHORIZED`: Invalid or missing authentication
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `INVALID_FILE_TYPE`: Unsupported file format

## Rate Limiting

- **Contact Forms**: 10 submissions per hour per IP
- **Quote Requests**: 5 submissions per hour per IP
- **File Uploads**: 20 uploads per hour per IP
- **Admin APIs**: 1000 requests per hour per authenticated user

## File Upload Specifications

- **Max File Size**: 5MB per file
- **Supported Formats**:
  - Images: JPEG, PNG, WebP
  - Documents: PDF, DOC, DOCX
  - Videos: MP4, MOV (max 50MB)
- **Max Files per Request**: 5 files

## Security Implementation

1. **Input Validation**: All inputs validated using Zod schemas
2. **File Security**: All uploaded files scanned for malware
3. **Rate Limiting**: Redis-based rate limiting
4. **CORS**: Configured for specific domains
5. **Sanitization**: HTML content sanitized to prevent XSS
6. **Authentication**: JWT tokens for admin endpoints

## Implementation Priority

### Phase 1 (Essential)
1. Contact form submission
2. Quote request management
3. Basic content management
4. Media upload for carousel

### Phase 2 (Business Logic)
5. Portfolio management
6. Services catalog
7. Pricing calculator
8. Testimonials system

### Phase 3 (Advanced)
9. Admin dashboard
10. Analytics and reporting
11. Automated notifications
12. Customer portal