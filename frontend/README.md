# Retail Sales Frontend

This is the user interface for the Retail Sales Management System. It's a single-page application built with **React 19** and **Vite**, designed to be snappy and responsive.

## What it does

We built this dashboard to help users explore sales data easily. Instead of just extensive tables, we focused on making the data *accessible* through powerful filtering and search.

- **Fast Search:** You can type a customer's name or number, and we'll find it instantly. We use "debouncing" (a 300ms delay) so we don't spam the API while you type.
- **Smart Filtering:** You don't have to guess what regions or options are available. The app asks the backend for the list of available filters (like Regions, Tags, Categories) and shows them to you dynamically.
- **Responsive Tables:** We handle large numbers of records by only asking for one page of data at a time (Pagination).

## Getting Started

### 1. Prerequisites
Make sure your backend is running first! 
The frontend expects the API to be alive at `http://localhost:5000`.

### 2. Install Dependencies
Go into the frontend folder and grab the packages:

```bash
cd frontend
npm install
```

### 3. Run Locally

To start the development server:

```bash
npm run dev
```

The app will usually open at **[http://localhost:5173](http://localhost:5173)**.

## Project Layout

We kept the React structure clean and functional:

- `src/main.jsx`: The entry point.
- `src/App.jsx`: The main controller. It holds the state for search, filters, and pagination.
- `src/components/`:
    - `FilterBar.jsx`: The top bar where you select regions, dates, etc.
    - `TransactionTable.jsx`: The grid that displays the data.
    - `Pagination.jsx`: The page switcher at the bottom.
- `src/services/api.js`: The layer that talks to the backend (Axios calls).

## Tech Stack Note
We kept dependencies minimal:
- **React 19**: For the UI library.
- **Vite**: For super-fast build and hot reloading.
- **Axios**: To handle HTTP requests cleanly.
- **Vanilla CSS**: We used standard CSS modules for styling to keep things simple and predictable without needing a heavy framework like Tailwind for this specific scope.
