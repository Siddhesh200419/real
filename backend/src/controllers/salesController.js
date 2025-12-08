import { getFilterOptions, querySales } from '../services/sqliteService.js';

// Get filter options
export const getFilterOptionsController = async (req, res) => {
  try {
    const options = getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({
      error: error.message || 'Failed to get filter options',
      details: 'Make sure the SQLite database exists. Run: node scripts/import_to_sqlite.js'
    });
  }
};

// Helper to ensure we always have an array, even for single values
// This handles cases where Express might give us a string, an array, or nothing.
const normalizeToArray = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    // Clean up the array: remove empty strings, nulls, etc.
    return value.filter(v => v !== null && v !== undefined && v !== '');
  }
  // If it's a single valid value, wrap it in an array
  if (value !== null && value !== undefined && value !== '') {
    return [value];
  }
  return [];
};

/**
 * Main endpoint to fetch sales data.
 * Supports:
 * - Pagination (page, pageSize)
 * - Sorting (sortBy, sortOrder)
 * - Search (text search on name/phone)
 * - Filtering (regions, genders, dates, etc.)
 */
export const getSalesDataController = async (req, res) => {
  try {
    const {
      search = '',
      page = 1,
      pageSize = 10,
      sortBy = 'date',
      sortOrder = 'desc',
      regions,
      genders,
      ageMin,
      ageMax,
      categories,
      tags,
      paymentMethods,
      dateFrom,
      dateTo
    } = req.query;

    // We need to make sure all filter parameters are arrays
    // before passing them to our service layer.
    const filters = {
      regions: normalizeToArray(regions),
      genders: normalizeToArray(genders),
      categories: normalizeToArray(categories),
      tags: normalizeToArray(tags),
      paymentMethods: normalizeToArray(paymentMethods)
    };

    const result = querySales({
      search,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      sortBy,
      sortOrder,
      ageMin,
      ageMax,
      dateFrom,
      dateTo,
      ...filters
    });

    res.json(result);
  } catch (error) {
    console.error('Failed to retrieve sales data:', error);
    res.status(500).json({
      error: 'Unable to fetch sales data. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

