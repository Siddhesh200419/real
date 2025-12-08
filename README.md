
---

````md
# Retail Sales Management System

## Overview
A full-stack Retail Sales Management System featuring advanced **search**, **multi-filtering**, **sorting**, and **pagination** over a large real-world sales dataset.  
The project follows a clean, modular architecture with a clear separation between **frontend**, **backend**, and **data services**.

---

## Tech Stack

### **Backend**
- Node.js  
- Express.js  
- SQLite (better-sqlite3)  
- csv-parser  

### **Frontend**
- React 19  
- Vite  
- Axios  

---

## Features

### 🔍 **Search**
- Case-insensitive full-text search  
- Searches across **Customer Name** and **Phone Number**  
- **Debounced input (300ms)** to reduce API calls  
- Works smoothly with filters, sorting, and pagination  

### 🎛️ **Filters**
Supports dynamic multi-select and range-based filtering:

- Customer Region  
- Gender  
- Age Range (min/max)  
- Product Category  
- Tags (parses comma-separated values)  
- Payment Method  
- Date Range (custom + presets like Today, Last 7 Days, etc.)

Filters can be applied independently or in combination.

### ↕️ **Sorting**
Sorting is available for:  
- Date  
- Quantity  
- Customer Name  
- Total Amount  

### 📄 **Pagination**
- Default: 10 items per page  
- Uses optimized SQLite `LIMIT` + `OFFSET`  
- Works seamlessly with search & filters  

---

## Setup Instructions

### **Prerequisites**
- Node.js (v16+)
- npm

---

## Backend Setup

```bash
cd backend
````

### 1. Create `.env`

```
CSV_URL=your s3 bucket dataset url
SQLITE_DB_URL=your s3 deploy db url
```

### 2. Install dependencies

```bash
npm install
```

### 3. Import data into SQLite

```bash
npm run import
```

### 4. Start server

```bash
npm start
```

Backend runs at:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## Frontend Setup

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Frontend runs at:
👉 **[http://localhost:5173](http://localhost:5173)**

---

## Project Structure

```
root/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── salesController.js
│   │   ├── services/
│   │   │   └── sqliteService.js
│   │   ├── routes/
│   │   │   └── salesRoutes.js
│   │   └── index.js
│   ├── scripts/
│   │   └── import_to_sqlite.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FilterBar.jsx
│   │   │   ├── TransactionTable.jsx
│   │   │   └── ...
│   │   └── App.jsx
│   └── package.json
└── README.md
```

---

## Deployment & Dataset Handling Notes

The provided CSV (`truestate_assignment_dataset.csv`) is large.
I explored multiple cloud deployment approaches:

### **1. Supabase (initial attempt)**

* Easy integration
* Failed due to upload size limits + timeouts

### **2. AWS S3 → RDS PostgreSQL Pipeline**

Evaluated a full ingestion pipeline using:

* S3 for storage
* EC2 for transformation
* `psql \copy` for bulk load into PostgreSQL

This is scalable and production-friendly.
The backend architecture (service/controller split) is already prepared for a smooth switch to PostgreSQL.

### **Why the CSV-based backend was kept for submission**

Due to limited time, I focused on:

* Correct implementation of all required features
* Clean architecture
* Stable local execution
* Avoiding a rushed, incomplete cloud setup

The app is fully working locally end-to-end.

### **With more time**

I would:

* Finish the RDS ingestion pipeline
* Deploy a PostgreSQL-backed API
* Keep the same frontend (API contract already matches)

---

## Final Notes

This project demonstrates:

* Solid engineering structure
* All required features working smoothly
* Scalable architecture ready for database migration

---

## Screenshot

<img width="1917" height="925" src="https://github.com/user-attachments/assets/ae63a059-575b-46f0-acc8-816357998274" />
```

---

