# Frontend - Retail Sales Management System

## Overview
React-based frontend application for the Retail Sales Management System built with Vite.

## Tech Stack
- React 19
- Vite
- Axios

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend server is running on `http://localhost:5000`

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Features

### Search
- Full-text search across Customer Name and Phone Number
- Case-insensitive search
- Real-time search with debouncing

### Filters
- Multi-select filters for:
  - Customer Region
  - Gender
  - Product Category
  - Tags
  - Payment Method
- Range filters for:
  - Age (Min/Max)
  - Date Range (Date Picker & Presets)

### Sorting
- Sort by Date (Newest/Oldest First)
- Sort by Quantity (Ascending/Descending)
- Sort by Customer Name (A-Z / Z-A)
- Sort by Total Amount

### Pagination
- 10 items per page
- Previous/Next navigation
- Page indicator showing current page and total pages

## Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx
│   ├── FilterPanel.jsx
│   ├── TransactionTable.jsx
│   ├── SortDropdown.jsx
│   └── Pagination.jsx
├── services/
│   └── api.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```
