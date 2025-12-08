# Backend - Retail Sales Management System

## Overview
Backend API server for the Retail Sales Management System built with Node.js and Express.

## Tech Stack
- Node.js
- Express.js
- SQLite (via better-sqlite3)
- csv-parser

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with the CSV URL:
```
CSV_URL=https://truestate-csv-siddhesh-prod.s3.ap-south-1.amazonaws.com/truestate_assignment_dataset.csv
```

3. Import data to SQLite:
```bash
npm run import
```

4. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Endpoints

### GET /api/health
Health check endpoint.

### GET /api/sales/filters
Get all available filter options (regions, genders, categories, payment methods, tags).

### GET /api/sales
Get sales data with search, filter, sort, and pagination.

**Query Parameters:**
- `search` - Search term (searches Customer Name and Phone Number)
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `sortBy` - Sort field: 'date', 'quantity', 'customerName' (default: 'date')
- `sortOrder` - Sort order: 'asc' or 'desc' (default: 'desc')
- `regions` - Array of regions to filter
- `genders` - Array of genders to filter
- `ageMin` - Minimum age
- `ageMax` - Maximum age
- `categories` - Array of product categories to filter
- `tags` - Array of tags to filter
- `paymentMethods` - Array of payment methods to filter
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)

