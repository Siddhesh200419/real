import { useState, useEffect } from 'react';
import { getFilterOptions } from '../services/api';
import './FilterPanel.css';

const FilterPanel = ({ filters, onFilterChange, onClearFilters }) => {
  const [filterOptions, setFilterOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        setError(null);
        const options = await getFilterOptions();
        setFilterOptions(options);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading filter options:', error);
        setError(error.response?.data?.error || error.message || 'Failed to load filters. Make sure the backend server is running.');
        setIsLoading(false);
      }
    };
    loadFilterOptions();
  }, []);

  const handleMultiSelect = (filterKey, value) => {
    const currentValues = filters[filterKey] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    onFilterChange({ ...filters, [filterKey]: newValues });
  };

  const handleRangeChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value || undefined });
  };

  if (isLoading) {
    return <div className="filter-panel">Loading filters...</div>;
  }

  if (error) {
    return (
      <div className="filter-panel">
        <div className="error-message" style={{ color: '#d32f2f', padding: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-all-button" onClick={onClearFilters}>
          Clear All
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Customer Region</label>
        <div className="checkbox-group">
          {filterOptions.regions.map(region => (
            <label key={region} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.regions || []).includes(region)}
                onChange={() => handleMultiSelect('regions', region)}
              />
              <span>{region}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Gender</label>
        <div className="checkbox-group">
          {filterOptions.genders.map(gender => (
            <label key={gender} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.genders || []).includes(gender)}
                onChange={() => handleMultiSelect('genders', gender)}
              />
              <span>{gender}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Age Range</label>
        <div className="range-inputs">
          <input
            type="number"
            placeholder="Min"
            value={filters.ageMin || ''}
            onChange={(e) => handleRangeChange('ageMin', e.target.value)}
            className="range-input"
          />
          <span>to</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.ageMax || ''}
            onChange={(e) => handleRangeChange('ageMax', e.target.value)}
            className="range-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Product Category</label>
        <div className="checkbox-group">
          {filterOptions.categories.map(category => (
            <label key={category} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.categories || []).includes(category)}
                onChange={() => handleMultiSelect('categories', category)}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Tags</label>
        <div className="checkbox-group">
          {filterOptions.tags.map(tag => (
            <label key={tag} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.tags || []).includes(tag)}
                onChange={() => handleMultiSelect('tags', tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Payment Method</label>
        <div className="checkbox-group">
          {filterOptions.paymentMethods.map(method => (
            <label key={method} className="checkbox-label">
              <input
                type="checkbox"
                checked={(filters.paymentMethods || []).includes(method)}
                onChange={() => handleMultiSelect('paymentMethods', method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <label className="filter-label">Date Range</label>
        <div className="date-inputs">
          <input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => handleRangeChange('dateFrom', e.target.value)}
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => handleRangeChange('dateTo', e.target.value)}
            className="date-input"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

