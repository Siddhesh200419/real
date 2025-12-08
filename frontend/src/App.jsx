import { useState, useEffect, useCallback } from 'react';
import { getSalesData } from './services/api';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import SortDropdown from './components/SortDropdown';
import SummaryCards from './components/SummaryCards';
import TransactionTable from './components/TransactionTable';
import Pagination from './components/Pagination';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for search, filters, sort, and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    regions: [],
    genders: [],
    ageMin: undefined,
    ageMax: undefined,
    ageRange: undefined,
    categories: [],
    tags: [],
    paymentMethods: [],
    dateFrom: undefined,
    dateTo: undefined,
    dateRange: undefined
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when any parameter changes
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {
        search: debouncedSearchTerm,
        page: currentPage,
        pageSize: 10,
        sortBy,
        sortOrder,
        ...filters
      };

      // Clean up params - remove undefined values and empty arrays
      const cleanedParams = {};
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && 
            !(Array.isArray(params[key]) && params[key].length === 0)) {
          cleanedParams[key] = params[key];
        }
      });

      // Axios will automatically handle arrays in params by repeating the key
      const response = await getSalesData(cleanedParams);
      setTransactions(response.data || []);
      setPagination(response.pagination || pagination);
      setError(null);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      const errorMessage = error.response?.data?.error || 
                          error.message || 
                          'Failed to load data. Make sure the backend server is running on http://localhost:5000';
      setError(errorMessage);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearchTerm, currentPage, sortBy, sortOrder, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setFilters({
      regions: [],
      genders: [],
      ageMin: undefined,
      ageMax: undefined,
      ageRange: undefined,
      categories: [],
      tags: [],
      paymentMethods: [],
      dateFrom: undefined,
      dateTo: undefined,
      dateRange: undefined
    });
    setCurrentPage(1);
  };

  const handleSortChange = ({ sortBy: newSortBy, sortOrder: newSortOrder }) => {
    if (newSortBy) setSortBy(newSortBy);
    if (newSortOrder) setSortOrder(newSortOrder);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Sales Management System</h1>
          <div className="header-search">
            <SearchBar onSearch={handleSearch} searchTerm={searchTerm} />
          </div>
        </div>
        <div className="header-filters">
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          <div className="header-sort">
            <SortDropdown
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="app-content">
          <SummaryCards transactions={transactions} />
          
          <div className="content-area">
            <TransactionTable transactions={transactions} isLoading={isLoading} error={error} />
            {!error && (
              <Pagination
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
