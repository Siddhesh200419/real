import { useState, useRef, useEffect } from 'react';
import './MultiSelect.css';

const MultiSelect = ({ 
  options = [], 
  selectedValues = [], 
  onChange, 
  placeholder = 'Select...',
  label = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  const displayText = selectedValues.length > 0 
    ? `${selectedValues.length} selected`
    : placeholder;

  return (
    <div className="multi-select-container" ref={dropdownRef}>
      {label && <label className="multi-select-label">{label}</label>}
      <div 
        className={`multi-select ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="multi-select-text">{displayText}</span>
        <div className="multi-select-actions">
          {selectedValues.length > 0 && (
            <span 
              className="multi-select-clear"
              onClick={handleClear}
              title="Clear selection"
            >
              ×
            </span>
          )}
          <span className="multi-select-arrow">▼</span>
        </div>
      </div>
      {isOpen && (
        <div className="multi-select-dropdown">
          {options.length === 0 ? (
            <div className="multi-select-option empty">No options available</div>
          ) : (
            options.map(option => (
              <label 
                key={option} 
                className="multi-select-option"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggle(option)}
                />
                <span>{option}</span>
              </label>
            ))
          )}
        </div>
      )}
      {selectedValues.length > 0 && (
        <div className="multi-select-chips">
          {selectedValues.slice(0, 2).map(value => (
            <span key={value} className="multi-select-chip">
              {value}
            </span>
          ))}
          {selectedValues.length > 2 && (
            <span className="multi-select-chip more">
              +{selectedValues.length - 2} more
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
