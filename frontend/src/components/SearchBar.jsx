import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    onSearch(value);
  };

  const handleClear = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Name, Phone no."
          value={localSearchTerm}
          onChange={handleChange}
        />
        {localSearchTerm && (
          <button className="clear-button" onClick={handleClear}>
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;

