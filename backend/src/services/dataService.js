import csv from 'csv-parser';
import { Readable } from 'stream';

let salesData = [];
let isDataLoaded = false;

// Load CSV data from S3 URL
export const loadSalesData = async () => {
  if (isDataLoaded) {
    return salesData;
  }

  return new Promise(async (resolve, reject) => {
    const csvUrl = process.env.CSV_URL;
    
    if (!csvUrl) {
      reject(new Error('CSV_URL environment variable is not set. Please check your .env file.'));
      return;
    }

    console.log(`Loading CSV from: ${csvUrl}`);
    let rowCount = 0;
    const startTime = Date.now();
    const results = [];

    try {
      // Fetch the CSV file from S3
      const response = await fetch(csvUrl);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`);
      }

      // Convert the response body to a stream
      // Use Readable.fromWeb for Node.js 18+ or fallback to text-based approach
      let stream;
      if (response.body && typeof Readable.fromWeb === 'function') {
        stream = Readable.fromWeb(response.body);
      } else {
        // Fallback: convert response to text then create a stream
        const text = await response.text();
        stream = new Readable();
        stream.push(text);
        stream.push(null); // End the stream
      }
      
      stream
        .pipe(csv())
        .on('data', (data) => {
          // Parse numeric fields
          const parsedData = {
            ...data,
            Age: parseInt(data.Age) || 0,
            Quantity: parseInt(data.Quantity) || 0,
            'Price per Unit': parseFloat(data['Price per Unit']) || 0,
            'Discount Percentage': parseFloat(data['Discount Percentage']) || 0,
            'Total Amount': parseFloat(data['Total Amount']) || 0,
            'Final Amount': parseFloat(data['Final Amount']) || 0,
            Date: new Date(data.Date)
          };
          results.push(parsedData);
          rowCount++;
          
          // Log progress every 100k rows
          if (rowCount % 100000 === 0) {
            console.log(`Loaded ${rowCount.toLocaleString()} rows...`);
          }
        })
        .on('end', () => {
          salesData = results;
          isDataLoaded = true;
          const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`✓ Loaded ${salesData.length.toLocaleString()} sales records in ${loadTime}s`);
          resolve(salesData);
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    } catch (error) {
      console.error('Error fetching CSV from URL:', error);
      reject(error);
    }
  });
};

// Get all unique values for filters
export const getFilterOptions = () => {
  const regions = [...new Set(salesData.map(item => item['Customer Region']).filter(Boolean))];
  const genders = [...new Set(salesData.map(item => item.Gender).filter(Boolean))];
  const categories = [...new Set(salesData.map(item => item['Product Category']).filter(Boolean))];
  const paymentMethods = [...new Set(salesData.map(item => item['Payment Method']).filter(Boolean))];
  
  // Extract all unique tags
  const allTags = new Set();
  salesData.forEach(item => {
    if (item.Tags) {
      const tags = item.Tags.split(',').map(tag => tag.trim()).filter(Boolean);
      tags.forEach(tag => allTags.add(tag));
    }
  });

  return {
    regions: regions.sort(),
    genders: genders.sort(),
    categories: categories.sort(),
    paymentMethods: paymentMethods.sort(),
    tags: Array.from(allTags).sort()
  };
};

// Search function
export const searchData = (data, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return data;
  }

  const term = searchTerm.toLowerCase().trim();
  return data.filter(item => {
    const customerName = (item['Customer Name'] || '').toLowerCase();
    const phoneNumber = (item['Phone Number'] || '').toLowerCase();
    return customerName.includes(term) || phoneNumber.includes(term);
  });
};

// Filter function
export const filterData = (data, filters) => {
  let filtered = [...data];

  // Region filter
  if (filters.regions && filters.regions.length > 0) {
    filtered = filtered.filter(item => 
      filters.regions.includes(item['Customer Region'])
    );
  }

  // Gender filter
  if (filters.genders && filters.genders.length > 0) {
    filtered = filtered.filter(item => 
      filters.genders.includes(item.Gender)
    );
  }

  // Age range filter
  if (filters.ageMin !== undefined && filters.ageMin !== null && filters.ageMin !== '') {
    filtered = filtered.filter(item => item.Age >= parseInt(filters.ageMin));
  }
  if (filters.ageMax !== undefined && filters.ageMax !== null && filters.ageMax !== '') {
    filtered = filtered.filter(item => item.Age <= parseInt(filters.ageMax));
  }

  // Product Category filter
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter(item => 
      filters.categories.includes(item['Product Category'])
    );
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    filtered = filtered.filter(item => {
      if (!item.Tags) return false;
      const itemTags = item.Tags.split(',').map(tag => tag.trim());
      return filters.tags.some(tag => itemTags.includes(tag));
    });
  }

  // Payment Method filter
  if (filters.paymentMethods && filters.paymentMethods.length > 0) {
    filtered = filtered.filter(item => 
      filters.paymentMethods.includes(item['Payment Method'])
    );
  }

  // Date range filter
  if (filters.dateFrom) {
    const fromDate = new Date(filters.dateFrom);
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate >= fromDate;
    });
  }
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999); // Include entire end date
    filtered = filtered.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate <= toDate;
    });
  }

  return filtered;
};

// Sort function
export const sortData = (data, sortBy, sortOrder = 'asc') => {
  const sorted = [...data];

  sorted.sort((a, b) => {
    let aVal, bVal;

    switch (sortBy) {
      case 'date':
        aVal = new Date(a.Date);
        bVal = new Date(b.Date);
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      
      case 'quantity':
        aVal = a.Quantity || 0;
        bVal = b.Quantity || 0;
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      
      case 'customerName':
        aVal = (a['Customer Name'] || '').toLowerCase();
        bVal = (b['Customer Name'] || '').toLowerCase();
        if (sortOrder === 'asc') {
          return aVal.localeCompare(bVal);
        } else {
          return bVal.localeCompare(aVal);
        }
      
      default:
        return 0;
    }
  });

  return sorted;
};

// Paginate function
export const paginateData = (data, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginated = data.slice(startIndex, endIndex);
  const totalPages = Math.ceil(data.length / pageSize);

  return {
    data: paginated,
    pagination: {
      currentPage: page,
      pageSize: pageSize,
      totalItems: data.length,
      totalPages: totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1
    }
  };
};

export { salesData };

