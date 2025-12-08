import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'sales.db');

console.log('Opening database at:', DB_PATH);

const db = new Database(DB_PATH);

try {
  // Check if columns exist and add them if they don't
  const tableInfo = db.prepare("PRAGMA table_info(sales)").all();
  const columnNames = tableInfo.map(col => col.name);

  console.log('Existing columns:', columnNames.join(', '));

  // Add customer_id if it doesn't exist
  if (!columnNames.includes('customer_id')) {
    console.log('Adding customer_id column...');
    db.exec('ALTER TABLE sales ADD COLUMN customer_id TEXT');
    console.log('✓ Added customer_id column');
  } else {
    console.log('✓ customer_id column already exists');
  }

  // Add product_id if it doesn't exist
  if (!columnNames.includes('product_id')) {
    console.log('Adding product_id column...');
    db.exec('ALTER TABLE sales ADD COLUMN product_id TEXT');
    console.log('✓ Added product_id column');
  } else {
    console.log('✓ product_id column already exists');
  }

  // Add employee_name if it doesn't exist
  if (!columnNames.includes('employee_name')) {
    console.log('Adding employee_name column...');
    db.exec('ALTER TABLE sales ADD COLUMN employee_name TEXT');
    console.log('✓ Added employee_name column');
  } else {
    console.log('✓ employee_name column already exists');
  }

  console.log('\nMigration completed successfully!');
  console.log('Note: The new columns will be NULL for existing rows.');
  console.log('To populate them, you can either:');
  console.log('1. Re-run the import script: npm run import');
  console.log('2. Or update the values manually if they exist in your CSV with different column names');

} catch (error) {
  console.error('Error during migration:', error);
  process.exit(1);
} finally {
  db.close();
}
