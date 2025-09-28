# Mock API Server

This is a mock API server for the scaffolding landing page. It provides endpoints for retrieving landing page content in multiple locales.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3002`.

## Available Endpoints

- `GET /api/health` - Health check
- `GET /api/landing-page/:locale` - Get all landing page data for specified locale
- `GET /api/contact` - Get contact information only
- `GET /api/pricing/:locale` - Get pricing steps for specified locale

## Supported Locales

- `en` - English
- `zh-HK` - Traditional Chinese (Hong Kong)

## Testing

Test the API with curl:

```bash
# Health check
curl http://localhost:3002/api/health

# Get English landing page data
curl http://localhost:3002/api/landing-page/en

# Get Chinese landing page data
curl http://localhost:3002/api/landing-page/zh-HK

# Get contact info
curl http://localhost:3002/api/contact

# Get pricing steps
curl http://localhost:3002/api/pricing/en
```

## Configuration

The server runs on port 3002 by default. You can modify the `PORT` constant in `server.js` if needed.

## CORS

CORS is enabled for all origins to allow the Next.js frontend to communicate with this API during development.