import { useState, useEffect } from 'react';
import { getFilterOptions } from '../services/api';
import reloadIcon from '../assets/reload.svg';
import MultiSelect from './MultiSelect';
import './FilterBar.css';

const FilterBar = ({ filters, onFilterChange, onClearFilters }) => {
  // Store all available options from the backend
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch filter options when the component mounts
    const loadFilterOptions = async () => {
      try {
        const options = await getFilterOptions();
        setFilterOptions(options);
      } catch (error) {
        console.error('Failed to load filter options:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFilterOptions();
  }, []);

  const handleMultiSelectChange = (filterKey, newValues) => {
    onFilterChange({ ...filters, [filterKey]: newValues });
  };

  if (isLoading) {
    return <div className="filter-bar">Loading filters...</div>;
  }

  if (Object.values(filterOptions).every(arr => arr.length === 0)) {
    return (
      <div className="filter-bar error">
        <span className="error-text">Failed to load filter options. Backend might be unreachable or database is empty.</span>
        <button className="filter-reset-btn" onClick={() => window.location.reload()} title="Retry">
          <img src={reloadIcon} alt="Retry" className="reload-icon" />
        </button>
      </div>
    );
  }

  return (
    <div className="filter-bar">
      <button className="filter-reset-btn" onClick={onClearFilters} title="Reset filters">
        <img src={reloadIcon} alt="Reset filters" className="reload-icon" />
      </button>
      
      <MultiSelect
        options={filterOptions.regions}
        selectedValues={filters.regions || []}
        onChange={(values) => handleMultiSelectChange('regions', values)}
        placeholder="Customer Region"
      />

      <MultiSelect
        options={filterOptions.genders}
        selectedValues={filters.genders || []}
        onChange={(values) => handleMultiSelectChange('genders', values)}
        placeholder="Gender"
      />

      <select
        className="filter-select"
        value={filters.ageRange || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '') {
            onFilterChange({ ...filters, ageMin: undefined, ageMax: undefined, ageRange: undefined });
          } else {
            const [min, max] = value.split('-').map(Number);
            onFilterChange({ ...filters, ageMin: min, ageMax: max, ageRange: value });
          }
        }}
      >
        <option value="">Age Range</option>
        <option value="18-25">18-25</option>
        <option value="26-35">26-35</option>
        <option value="36-45">36-45</option>
        <option value="46-55">46-55</option>
        <option value="56-65">56-65</option>
        <option value="66-100">66+</option>
      </select>

      <MultiSelect
        options={filterOptions.categories}
        selectedValues={filters.categories || []}
        onChange={(values) => handleMultiSelectChange('categories', values)}
        placeholder="Product Category"
      />

      <MultiSelect
        options={filterOptions.tags}
        selectedValues={filters.tags || []}
        onChange={(values) => handleMultiSelectChange('tags', values)}
        placeholder="Tags"
      />

      <MultiSelect
        options={filterOptions.paymentMethods}
        selectedValues={filters.paymentMethods || []}
        onChange={(values) => handleMultiSelectChange('paymentMethods', values)}
        placeholder="Payment Method"
      />

      <select
        className="filter-select"
        value={filters.dateRange || ''}
        onChange={(e) => {
          const value = e.target.value;
          if (value === '') {
            onFilterChange({ ...filters, dateFrom: undefined, dateTo: undefined, dateRange: undefined });
          } else {
            const today = new Date();
            let dateFrom, dateTo;
            
            switch(value) {
              case 'today':
                dateFrom = new Date(today);
                dateTo = new Date(today);
                break;
              case 'week':
                dateFrom = new Date(today);
                dateFrom.setDate(today.getDate() - 7);
                dateTo = new Date(today);
                break;
              case 'month':
                dateFrom = new Date(today);
                dateFrom.setMonth(today.getMonth() - 1);
                dateTo = new Date(today);
                break;
              case 'quarter':
                dateFrom = new Date(today);
                dateFrom.setMonth(today.getMonth() - 3);
                dateTo = new Date(today);
                break;
              case 'year':
                dateFrom = new Date(today);
                dateFrom.setFullYear(today.getFullYear() - 1);
                dateTo = new Date(today);
                break;
              default:
                dateFrom = undefined;
                dateTo = undefined;
            }
            
            onFilterChange({ 
              ...filters, 
              dateFrom: dateFrom ? dateFrom.toISOString().split('T')[0] : undefined,
              dateTo: dateTo ? dateTo.toISOString().split('T')[0] : undefined,
              dateRange: value 
            });
          }
        }}
      >
        <option value="">Date</option>
        <option value="today">Today</option>
        <option value="week">Last 7 Days</option>
        <option value="month">Last Month</option>
        <option value="quarter">Last 3 Months</option>
        <option value="year">Last Year</option>
      </select>
    </div>
  );
};

export default FilterBar;

