import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', '..', 'data', 'sales.db');

let db;
try {
  db = new Database(DB_PATH, { readonly: true });
} catch (error) {
  console.error('Error opening SQLite database:', error.message);
  throw new Error('SQLite database not found. Please run: npm run import');
}

// Get all unique values for filters
/**
 * Helper to fetch distinct, non-empty values from a column.
 * This is used to populate the dropdown filters in the frontend.
 */
const getDistinctValues = (column) => {
  try {
    const query = `
      SELECT DISTINCT ${column} 
      FROM sales 
      WHERE ${column} IS NOT NULL AND ${column} != '' 
      ORDER BY ${column}
    `;
    return db.prepare(query).all().map(r => r[column]);
  } catch (err) {
    console.warn(`Warning: Could not fetch distinct values for ${column}`, err.message);
    return [];
  }
};

/**
 * Retrieves all available options for the filter dropdowns.
 * Returns an object with arrays for each filter category.
 */
export const getFilterOptions = () => {
  // Grab distinct values for our standard dropdowns
  const regions = getDistinctValues('customer_region');
  const genders = getDistinctValues('gender');
  const categories = getDistinctValues('product_category');
  const paymentMethods = getDistinctValues('payment_method');

  // Tags are stored as comma-separated strings (e.g., "organic,skincare")
  // We need to split them and collect unique individual tags.
  const tagsResult = db.prepare('SELECT DISTINCT tags FROM sales WHERE tags IS NOT NULL AND tags != \'\'').all();
  const uniqueTags = new Set();

  tagsResult.forEach(row => {
    if (!row.tags) return;

    // Split by comma, trim whitespace, and filter out empty strings
    row.tags.split(',').forEach(tag => {
      const cleanTag = tag.trim();
      if (cleanTag) uniqueTags.add(cleanTag);
    });
  });

  return {
    regions,
    genders,
    categories,
    paymentMethods,
    tags: [...uniqueTags].sort()
  };
};

// Query sales data with search, filter, sort, and pagination
export const querySales = ({
  search = '',
  page = 1,
  pageSize = 10,
  sortBy = 'date',
  sortOrder = 'desc',
  regions = [],
  genders = [],
  ageMin,
  ageMax,
  categories = [],
  tags = [],
  paymentMethods = [],
  dateFrom,
  dateTo
}) => {
  // Build WHERE clause
  const whereConditions = [];
  const params = {};

  // Search on customer name and phone number
  if (search && search.trim()) {
    whereConditions.push('(LOWER(customer_name) LIKE @search OR LOWER(phone_number) LIKE @search)');
    params.search = `%${search.toLowerCase().trim()}%`;
  }

  // Region filter
  if (regions && regions.length > 0) {
    const regionPlaceholders = regions.map((_, i) => `@region${i}`).join(', ');
    whereConditions.push(`customer_region IN (${regionPlaceholders})`);
    regions.forEach((region, i) => {
      params[`region${i}`] = region;
    });
  }

  // Gender filter
  if (genders && genders.length > 0) {
    const genderPlaceholders = genders.map((_, i) => `@gender${i}`).join(', ');
    whereConditions.push(`gender IN (${genderPlaceholders})`);
    genders.forEach((gender, i) => {
      params[`gender${i}`] = gender;
    });
  }

  // Age range filter
  if (ageMin !== undefined && ageMin !== null && ageMin !== '') {
    whereConditions.push('age >= @ageMin');
    params.ageMin = parseInt(ageMin);
  }
  if (ageMax !== undefined && ageMax !== null && ageMax !== '') {
    whereConditions.push('age <= @ageMax');
    params.ageMax = parseInt(ageMax);
  }

  // Product Category filter
  if (categories && categories.length > 0) {
    const categoryPlaceholders = categories.map((_, i) => `@category${i}`).join(', ');
    whereConditions.push(`product_category IN (${categoryPlaceholders})`);
    categories.forEach((category, i) => {
      params[`category${i}`] = category;
    });
  }

  // Tags filter (using LIKE for comma-separated tags)
  if (tags && tags.length > 0) {
    const tagConditions = tags.map((_, i) => {
      params[`tag${i}`] = `%${tags[i]}%`;
      return `tags LIKE @tag${i}`;
    });
    whereConditions.push(`(${tagConditions.join(' OR ')})`);
  }

  // Payment Method filter
  if (paymentMethods && paymentMethods.length > 0) {
    const paymentPlaceholders = paymentMethods.map((_, i) => `@payment${i}`).join(', ');
    whereConditions.push(`payment_method IN (${paymentPlaceholders})`);
    paymentMethods.forEach((payment, i) => {
      params[`payment${i}`] = payment;
    });
  }

  // Date range filter
  if (dateFrom) {
    whereConditions.push('date >= @dateFrom');
    params.dateFrom = dateFrom;
  }
  if (dateTo) {
    whereConditions.push('date <= @dateTo');
    params.dateTo = dateTo;
  }

  const whereSQL = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // Build ORDER BY clause
  let orderSQL = 'ORDER BY ';
  switch (sortBy) {
    case 'date':
      orderSQL += `date ${sortOrder.toUpperCase()}`;
      break;
    case 'quantity':
      orderSQL += `quantity ${sortOrder.toUpperCase()}`;
      break;
    case 'customerName':
      orderSQL += `customer_name ${sortOrder.toUpperCase()}`;
      break;
    default:
      orderSQL += `date DESC`;
  }

  // Get total count
  const countSQL = `SELECT COUNT(*) as count FROM sales ${whereSQL}`;
  const countStmt = db.prepare(countSQL);
  const total = countStmt.get(params).count;

  // Get paginated data
  const offset = (page - 1) * pageSize;
  const dataSQL = `SELECT * FROM sales ${whereSQL} ${orderSQL} LIMIT @limit OFFSET @offset`;
  const dataStmt = db.prepare(dataSQL);
  const data = dataStmt.all({ ...params, limit: pageSize, offset });

  // Convert database rows to match the expected format
  const formattedData = data.map(row => ({
    'Transaction ID': row.transaction_id,
    'Date': row.date,
    'Customer ID': row.customer_id || null,
    'Customer Name': row.customer_name,
    'Phone Number': row.phone_number,
    'Gender': row.gender,
    'Age': row.age,
    'Product Category': row.product_category,
    'Product Name': row.product,
    'Quantity': row.quantity,
    'Total Amount': row.total_amount,
    'Final Amount': row.final_amount,
    'Customer Region': row.customer_region,
    'Product ID': row.product_id || null,
    'Employee Name': row.employee_name || null
  }));

  const totalPages = Math.ceil(total / pageSize);

  return {
    data: formattedData,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: total,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

