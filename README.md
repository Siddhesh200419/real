# Retail Sales Management System

Hi there! Welcome to the Retail Sales Management System. 

This project is a full-stack dashboard designed to handle large datasets of retail transactions. It allows you to search, filter, and analyze sales data in real-time, all without needing a heavy database setup.

## What's Inside?

We split the project into two main parts to keep things clean:

- **[Backend](/backend)**: A Node.js + Express server.  
  It powers the API and uses a local SQLite database to handle millions of records efficiently. We chose SQLite so you can run this locally without setting up Postgres or MySQL.

- **[Frontend](/frontend)**: A React + Vite application.  
  It's the interface you see above. It features debounced search, dynamic multi-filtering (Regions, Categories, etc.), and smooth pagination.

## Quick Start

You can run the whole stack in two terminal windows.

### 1. Start the Backend
The backend handles the data. You need to verify your `.env` file first (check `backend/README.md` for details), then run:

```bash
cd backend
npm install
npm run import  # Only needed the first time to load data
npm start
```
*It runs on port 5000.*

### 2. Start the Frontend
Open a new terminal for the UI:

```bash
cd frontend
npm install
npm run dev
```
*It runs on port 5173.*

## Why this architecture?
We wanted a system that is easy to deploy but scalable enough to handle real-world data loads. 
- **SQLite** gave us the performance of a SQL engine without the ops overhead.
- **React + Vite** gave us a fast, modern development experience.
- **Validation** is handled strictly on the backend to keep data clean.

For deep dives, check out the [Architecture Docs](docs/architecture.md).

