# Architecture Documentation

## System Overview

The Retail Sales Management System is a robust full-stack application designed to handle large datasets efficiently. We've separated frontend and backend concerns to ensure modularity and ease of maintenance. The system is built around a performant SQLite database, allowing for complex querying and filtering without the overhead of a full database server.

## Backend Architecture

### Structure
```
backend/
├── src/
│   ├── index.js          # Entry point, Express server & Middleware
│   ├── controllers/      # Request handlers (input validation & response formatting)
│   ├── services/         # Business logic & Database interactions (SQLite)
│   └── routes/           # API route definitions
├── scripts/
│   └── import_to_sqlite.js # Data ingestion script (CSV -> SQLite)
```

### Components

#### Entry Point (`index.js`)
- Initializes the Express app.
- Sets up essential middleware (CORS, body parsing).
- Registers route handlers.
- Starts the server on port 5000.

#### Controllers (`controllers/salesController.js`)
- **getFilterOptionsController**: Coordinates fetching distinct values for our filter dropdowns.
- **getSalesDataController**: The heavy lifter. It parses all query parameters (search, filters, sort, pagination), sanitizes inputs, calls the service layer, and formats the response for the frontend.

#### Services (`services/sqliteService.js`)
- **Database Connection**: Establishes a read-only connection to the SQLite database using `better-sqlite3`.
- **getFilterOptions**: Executes optimized `SELECT DISTINCT` queries to populate UI filters.
- **querySales**: Dynamically builds complex SQL queries based on user criteria.
  - Handles `WHERE` clauses for filtering.
  - manages `ORDER BY` for sorting.
  - implements `LIMIT/OFFSET` for efficient pagination.

### Data Flow

1. **Data Ingestion**: The `import_to_sqlite.js` script reads the raw CSV, maps columns to a clean schema, and bulk-inserts records into the `sales.db` SQLite file.
2. **Request Handling**:
   - The frontend sends a GET request with query parameters (e.g., `?regions=North&sortBy=date`).
   - The Controller extracts and cleans these parameters.
   - The Service layer constructs a parameterized SQL query to prevent injection and optimize performance.
   - SQLite executes the query and returns the matching rows and total count.
   - The Controller sends the JSON response back to the client.

### API Endpoints

#### GET /api/health
Simple health check to ensure the server is up.

#### GET /api/sales/filters
Returns logical groups of filter options:
```json
{
  "regions": ["Central", "East", "North", "South", "West"],
  "genders": ["Female", "Male"],
  "categories": ["Beauty", "Clothing", "Electronics"],
  "paymentMethods": ["Credit Card", "UPI"],
  "tags": ["organic", "fashion"]
}
```

#### GET /api/sales
Main data endpoint.
- **Query Params**: `search`, `page`, `pageSize`, `sortBy`, `sortOrder`, `regions[]`, `genders[]`, `dates`, etc.
- **Response**:
```json
{
  "data": [{ "Transaction ID": "...", ... }],
  "pagination": {
    "currentPage": 1,
    "totalItems": 500,
    "totalPages": 50
  }
}
```

## Frontend Architecture

### Structure
```
frontend/
├── src/
│   ├── components/       # Reusable UI building blocks
│   ├── services/         # API integration layer
│   ├── App.jsx           # Main container & state manager
│   └── main.jsx          # React entry point
```

### Key Components

#### App.jsx
The brain of the frontend. It manages the global state for:
- Active filters
- Search query
- Pagination status
- Sorting preferences

It debounces search inputs to avoid hammering the API and coordinates data fetching whenever state changes.

#### FilterPanel & FilterBar
We moved to a more dynamic `FilterBar` that works horizontally. It fetches options from the backend on mount and renders:
- **MultiSelect**: For categories like Region, Gender, etc.
- **Date Inputs**: For date range filtering.

#### TransactionTable
A pure presentation component that renders data in a responsive table. It handles:
- Currency formatting.
- Date formatting.
- Empty states and loading indicators.

### Data Flow
1. **User Action**: User types in search or selects a filter.
2. **State Update**: React updates the state (debounced for search).
3. **Effect Trigger**: `useEffect` detects the state change and calls `api.getSalesData`.
4. **Render**: The new data populates the grid.

## Design Decisions

### Why SQLite?
We moved from in-memory array filtering to SQLite because:
- **Performance**: SQL engines are optimized for querying large datasets.
- **Memory Efficiency**: We don't need to load the entire dataset into RAM.
- **Flexibility**: Adding complex filters (like multi-select) is much easier with SQL `WHERE` clauses than writing complex JavaScript array filter logic.

### Why better-sqlite3?
It provides a synchronous API that is faster and easier to use than asynchronous SQLite wrappers for read-heavy workloads like this.

## Scalability & Performance

- **Database Indexing**: We index key columns (`customer_name`, `date`, `region`) to ensure queries run in milliseconds, even with thousands of records.
- **Pagination**: We only fetch the 10 rows the user needs to see, keeping the payload small.
- **Debouncing**: Prevents API overload during rapid typing.

## Security
- **Parameterized Queries**: All user inputs in the SQL service are passed as parameters, effectively neutralizing SQL injection attacks.
- **Input Sanitization**: The controller helps ensure types (arrays vs strings) are consistent before they reach the logic layer.
