import 'dotenv/config';
import fs from 'fs';
import csv from 'csv-parser';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import { Readable } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_URL = process.env.CSV_URL;
const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');

if (!CSV_URL) {
  console.error('Error: CSV_URL environment variable is not set in .env file');
  process.exit(1);
}

// Create data folder if missing
const dataDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDir, { recursive: true });

console.log('Creating SQLite DB at:', DB_PATH);
const db = new Database(DB_PATH);

// Speed optimizations
db.pragma('journal_mode = WAL');
db.pragma('synchronous = OFF');
db.pragma('temp_store = MEMORY');

// Create table with all CSV columns
db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_id TEXT,
    customer_id TEXT,
    customer_name TEXT,
    age INTEGER,
    city TEXT,
    customer_region TEXT,
    gender TEXT,
    date TEXT,
    product TEXT,
    product_id TEXT,
    product_category TEXT,
    quantity INTEGER,
    price_per_unit REAL,
    discount_percentage REAL,
    total_amount REAL,
    final_amount REAL,
    phone_number TEXT,
    payment_method TEXT,
    tags TEXT,
    employee_name TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_customer_name ON sales(customer_name);
  CREATE INDEX IF NOT EXISTS idx_phone_number ON sales(phone_number);
  CREATE INDEX IF NOT EXISTS idx_date ON sales(date);
  CREATE INDEX IF NOT EXISTS idx_region ON sales(customer_region);
  CREATE INDEX IF NOT EXISTS idx_gender ON sales(gender);
  CREATE INDEX IF NOT EXISTS idx_category ON sales(product_category);
  CREATE INDEX IF NOT EXISTS idx_payment_method ON sales(payment_method);
`);

const insert = db.prepare(`
  INSERT INTO sales (
    transaction_id, customer_id, customer_name, age, city, customer_region, gender, date, 
    product, product_id, product_category, quantity, price_per_unit, discount_percentage, 
    total_amount, final_amount, phone_number, payment_method, tags, employee_name
  ) VALUES (
    @transaction_id, @customer_id, @customer_name, @age, @city, @customer_region, @gender, @date,
    @product, @product_id, @product_category, @quantity, @price_per_unit, @discount_percentage,
    @total_amount, @final_amount, @phone_number, @payment_method, @tags, @employee_name
  );
`);

const batchInsert = db.transaction(rows => {
  for (const r of rows) insert.run(r);
});

let buffer = [];
const BATCH_SIZE = 1000;
let total = 0;

console.log('Fetching CSV from:', CSV_URL);
console.log('Importing CSV to SQLite...');

try {
  // Fetch the CSV file from S3
  const response = await fetch(CSV_URL);

  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
  }

  // Convert the response body to a stream
  let stream;
  if (response.body && typeof Readable.fromWeb === 'function') {
    stream = Readable.fromWeb(response.body);
  } else {
    // Fallback: convert response to text then create a stream
    const text = await response.text();
    stream = new Readable();
    stream.push(text);
    stream.push(null);
  }

  stream
    .pipe(csv())
    .on('data', row => {
      // Map CSV columns to database fields
      // Handles various CSV header formats (e.g. "Product ID", "Product Id", "product_id")
      const doc = {
        transaction_id: row['Transaction ID'] || null,
        date: row['Date'] || null,
        customer_id: row['Customer ID'] || row['Customer Id'] || row['customer_id'] || null,
        customer_name: row['Customer Name'] || row['Customer name'] || null,
        phone_number: row['Phone Number'] || null,
        gender: row['Gender'] || null,
        age: row['Age'] ? parseInt(row['Age']) : null,
        customer_region: row['Customer Region'] || row['Customer region'] || null,
        city: row['City'] || null,

        // Product details
        product: row['Product Name'] || row['Product'] || null,
        product_id: row['Product ID'] || row['Product Id'] || row['product_id'] || null,
        product_category: row['Product Category'] || row['Product category'] || null,

        // Sales metrics
        quantity: row['Quantity'] ? parseInt(row['Quantity']) : null,
        price_per_unit: row['Price per Unit'] ? parseFloat(row['Price per Unit']) : null,
        discount_percentage: row['Discount Percentage'] ? parseFloat(row['Discount Percentage']) : null,
        total_amount: row['Total Amount'] ? parseFloat(row['Total Amount']) : null,
        final_amount: row['Final Amount'] ? parseFloat(row['Final Amount']) : null,

        payment_method: row['Payment Method'] || null,
        tags: row['Tags'] || null,
        employee_name: row['Employee Name'] || row['Employee name'] || row['employee_name'] || row['Employee'] || null
      };

      buffer.push(doc);
      total++;

      if (buffer.length >= BATCH_SIZE) {
        batchInsert(buffer);
        buffer = [];
        process.stdout.write(`\rInserted: ${total.toLocaleString()}`);
      }
    })
    .on('end', () => {
      if (buffer.length) {
        batchInsert(buffer);
      }
      console.log(`\nDone! Inserted ${total.toLocaleString()} rows into SQLite.`);
      db.close();
      process.exit(0);
    })
    .on('error', err => {
      console.error('\nCSV read error:', err);
      db.close();
      process.exit(1);
    });
} catch (error) {
  console.error('Error fetching CSV:', error);
  db.close();
  process.exit(1);
}

