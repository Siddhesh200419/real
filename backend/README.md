# Retail Sales Backend

This is the backend service for the Retail Sales Management System. It's a lightweight Node.js/Express application that powers the frontend dashboard. 

Instead of setting up a heavy database server (like Postgres or MySQL) which makes local testing a pain, we decided to use **SQLite** (`better-sqlite3`). This keeps everything self-contained and super fast. We also handle large CSV datasets using a stream-based import script, so you don't run out of RAM when loading data.

## How it Works

The backend has two main jobs:
1. **Ingest Data:** We have scripts to download and parse the raw CSV data into a local SQLite database file (`sales.db`).
2. **Serve API:** The Express server queries this SQLite database to provide search, filtering, and pagination to the frontend.

## Getting Started

You'll need Node.js installed. We recommend Node v16 or newer.

### 1. Setup

First, jump into the backend folder and install the dependencies:

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file in the `backend` root. You just need to point it to the CSV dataset URL:

```
CSV_URL=https://truestate-csv-siddhesh-prod.s3.ap-south-1.amazonaws.com/truestate_assignment_dataset.csv
```

### 3. Load the Data

Before running the server, you need to build the database. We have a handy script for this. It downloads the CSV (if you don't have it) and parses it into SQLite:

```bash
npm run import
```

*Note: This might take a moment depending on the file size, but it only needs to be done once.*

### 4. Run the Server

Now you can fire it up:

```bash
# For normal usage
npm start

# For development (auto-restarts on changes)
npm run dev
```

The server listens on port **5000** by default.

## API Reference

We kept the API simple. There are really just a few key endpoints the frontend needs.

- **`GET /api/health`**  
  Just a sanity check to make sure the server is alive. Returns `{"status": "ok"}`.

- **`GET /api/sales`**  
  The main workhorse. It returns the paginated list of sales transactions. You can throw almost any filter at it as a query parameter.
  - `page`, `pageSize` for pagination.
  - `search` for text search (Customer Name/Phone).
  - Filters like `regions`, `categories`, `paymentMethods` (you can pass these multiple times to select multiple, e.g., `?regions=North&regions=South`).
  - Sort with `sortBy` and `sortOrder`.

- **`GET /api/sales/filters`**  
  Returns all the unique values for the dropdowns (like all available regions, categories, etc.) so the frontend knows what to show in the filter bar.

## Project Structure

Everything important is in `src/`.
- `index.js`: The entry point. It sets up Express and the middlewares.
- `routes/`: Defines the API urls.
- `controllers/`: The actual logic for handling requests.
- `services/`: Handles the database queries. If we ever switch to Postgres, we'd mostly just touch this part.
- `scripts/`: Helper scripts for data import and migration.
