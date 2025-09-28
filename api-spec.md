# Landing Page API Specification

## Overview
This API provides data for the scaffolding company landing page, supporting multiple locales.

## Base URL
```
http://localhost:3002/api
```

## Endpoints

### 1. Get Landing Page Data
**GET** `/landing-page/{locale}`

Returns all content for the landing page in the specified locale.

**Parameters:**
- `locale` (path): Language code (e.g., 'en', 'zh', 'zh-HK')

**Response:**
```json
{
  "locale": "en",
  "hero": {
    "certificates": [
      {
        "src": "/certificate.jpeg",
        "alt": "Company Certificate 1"
      },
      {
        "src": "/certificate.jpeg",
        "alt": "Company Certificate 2"
      }
    ]
  },
  "about": {
    "title": "About Our Company",
    "subtitle": "Professional scaffolding services",
    "description": "We are a professional scaffolding company...",
    "images": [
      {
        "src": "/company-1.png",
        "alt": "Company Image 1"
      },
      {
        "src": "/company-2.png",
        "alt": "Company Image 2"
      }
    ]
  },
  "companyLogos": [
    "/company-logo-1.png",
    "/company-logo-2.png",
    "/company-logo-3.png",
    "/company-logo-1.png"
  ],
  "video": {
    "title": "Company Video",
    "embedUrl": "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  "pricing": {
    "title": "How to Get Quote",
    "subtitle": "6 Easy Steps",
    "steps": [
      {
        "title": "Step 1",
        "content": "Contact us for initial consultation"
      },
      {
        "title": "Step 2",
        "content": "Site inspection and measurement"
      },
      {
        "title": "Step 3",
        "content": "Quote preparation and pricing"
      },
      {
        "title": "Step 4",
        "content": "Agreement and contract signing"
      },
      {
        "title": "Step 5",
        "content": "Scaffolding installation"
      },
      {
        "title": "Step 6",
        "content": "Quality check and handover"
      }
    ]
  },
  "contact": {
    "phoneNumber": "+852 6806-0108",
    "contacts": [
      {
        "type": "whatsapp",
        "icon": "/whatsapp-icon.png",
        "alt": "WhatsApp",
        "text": "+852 6806-0108",
        "link": "https://wa.me/85268060108"
      },
      {
        "type": "phone",
        "icon": "/print-icon.png",
        "alt": "Phone",
        "text": "+852 3020-6719",
        "link": "tel:+85230206719"
      },
      {
        "type": "email",
        "icon": "/email-icon.png",
        "alt": "Email",
        "text": "leego.scaffolding@gmail.com",
        "link": "mailto:leego.scaffolding@gmail.com"
      },
      {
        "type": "facebook",
        "icon": "/fb-icon.png",
        "alt": "Facebook",
        "text": "https://www.facebook.com/MasterHongScaffolding/",
        "link": "https://www.facebook.com/MasterHongScaffolding/"
      }
    ]
  },
  "footer": {
    "copyright": "© 2024 Scaffolding Engineering Limited. All rights reserved."
  },
  "navigation": {
    "about": "About",
    "pricing": "Pricing",
    "contact": "Contact"
  }
}
```

### 2. Get Contact Information
**GET** `/contact`

Returns contact information only.

**Response:**
```json
{
  "phoneNumber": "+852 6806-0108",
  "contacts": [
    {
      "type": "whatsapp",
      "icon": "/whatsapp-icon.png",
      "alt": "WhatsApp",
      "text": "+852 6806-0108",
      "link": "https://wa.me/85268060108"
    }
  ]
}
```

### 3. Get Pricing Steps
**GET** `/pricing/{locale}`

Returns pricing steps for the specified locale.

**Response:**
```json
{
  "title": "How to Get Quote",
  "subtitle": "6 Easy Steps",
  "steps": [
    {
      "title": "Step 1",
      "content": "Contact us for initial consultation"
    }
  ]
}
```

## Sample cURL Commands

### Get Landing Page Data (English)
```bash
curl -X GET "http://localhost:3002/api/landing-page/en" \
  -H "Accept: application/json"
```

### Get Landing Page Data (Traditional Chinese)
```bash
curl -X GET "http://localhost:3002/api/landing-page/zh-HK" \
  -H "Accept: application/json"
```

### Get Contact Information
```bash
curl -X GET "http://localhost:3002/api/contact" \
  -H "Accept: application/json"
```

### Get Pricing Steps
```bash
curl -X GET "http://localhost:3002/api/pricing/en" \
  -H "Accept: application/json"
```

## Error Responses

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Locale not supported",
  "statusCode": 404
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong",
  "statusCode": 500
}
```