import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');

console.log('Opening DB at:', DB_PATH);
const db = new Database(DB_PATH, { readonly: true });

try {
    // Check total count
    const count = db.prepare('SELECT COUNT(*) as count FROM sales').get();
    console.log('Total rows:', count.count);

    // Check one row
    const row = db.prepare('SELECT * FROM sales LIMIT 1').get();
    console.log('Sample row:', row);

    // Check distinct regions
    // FIXED: Using single quotes for empty string check
    const regions = db.prepare('SELECT DISTINCT customer_region FROM sales WHERE customer_region IS NOT NULL AND customer_region != \'\' LIMIT 10').all();
    console.log('Distinct Regions:', regions);

    // Check distinct genders
    // FIXED: Using single quotes for empty string check
    const genders = db.prepare('SELECT DISTINCT gender FROM sales WHERE gender IS NOT NULL AND gender != \'\' LIMIT 10').all();
    console.log('Distinct Genders:', genders);

} catch (error) {
    console.error('Error querying database:', error);
}
