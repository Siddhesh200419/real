# System Architecture

This document explains how the Retail Sales Management System is put together. We wanted to keep things simple but scalable, so we split the app into a clean **Frontend** (React) and **Backend** (Node/Express) structure.

## The Big Picture

We need to handle large datasets (potentially thousands of sales records) without making the user's browser crash. 
- **Old Approach:** Load everything into frontend memory. (Bad for performance)
- **Current Approach:** Validated storage in SQLite with server-side pagination. (Fast and efficient)

## Backend Mechanics

The backend is more than just a proxy; it acts as the data guardian.

### Directory Breakdown
- `src/index.js`: The "brain" that starts the server.
- `src/controllers/`: The traffic cops. They validate inputs (like checking if `page` is actually a number) so the service layer doesn't crash.
- `src/services/`: The distinct business logic. This is where we talk to SQLite.
- `src/routes/`: Just maps URLs to controllers.

### Why SQLite?
We intentionally chose **SQLite** (via `better-sqlite3`) for this project. 
1.  **Speed**: It's incredibly fast for read-heavy workloads.
2.  **No DevOps**: You don't need to install Postgres or MySQL to run this project. It just works.
3.  **SQL Power**: Unlike using JSON files or CSV parsing on every request, we can use real SQL features like `WHERE`, `ORDER BY`, and `LIMIT` to filter data effectively.

### Data Flow
When a user searches for "John":
1.  Frontend sends `GET /api/sales?search=John`.
2.  **Controller** grabs `search` param and sanitizes it.
3.  **Service** builds a SQL query: `SELECT * FROM sales WHERE customer_name LIKE '%John%' LIMIT 10`.
4.  **SQLite** runs this locally and returns just the 10 rows we need.
5.  Frontend gets the clean JSON response.

## Frontend Mechanics

The frontend is built with **Vite + React**. 

### Key Components
- **`App.jsx`**: Holds the "global" state (current page, active filters, search text). It manages the API calls.
- **`FilterBar`**: Renders dynamic filters based on what the backend says is available (e.g. it asks the backend "what regions do we have?" before rendering the dropdown).
- **`TransactionTable`**: Purely presentational. It just takes data and shows it.

### Smart Optimizations
- **Debouncing**: We don't spam the API every time you press a key in the search box. We wait 300ms.
- **Dynamic Filters**: We don't hardcode categories. If a new category appears in the CSV, it automatically shows up in the dropdowns.

## Security Note
Since we are constructing SQL queries, we strictly use **parameterized queries** (e.g., `WHERE name = ?`). This makes SQL injection impossible, even if someone tries to search for `'; DROP TABLE sales; --`.
