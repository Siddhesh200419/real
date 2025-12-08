import './SortDropdown.css';

const SortDropdown = ({ sortBy, sortOrder, onSortChange }) => {
  const handleSortByChange = (e) => {
    onSortChange({ sortBy: e.target.value, sortOrder });
  };

  const handleSortOrderChange = (e) => {
    onSortChange({ sortBy, sortOrder: e.target.value });
  };

  const getSortLabel = () => {
    const labels = {
      date: 'Date',
      quantity: 'Quantity',
      customerName: 'Customer Name'
    };
    const orderLabel = sortOrder === 'asc' ? '(A-Z)' : '(Z-A)';
    return `${labels[sortBy]} ${orderLabel}`;
  };

  return (
    <div className="sort-controls">
      <label className="sort-label">Sort by:</label>
      <select
        className="sort-select"
        value={`${sortBy}-${sortOrder}`}
        onChange={(e) => {
          const [newSortBy, newSortOrder] = e.target.value.split('-');
          onSortChange({ sortBy: newSortBy, sortOrder: newSortOrder });
        }}
      >
        <option value="date-desc">Date (Newest First)</option>
        <option value="date-asc">Date (Oldest First)</option>
        <option value="quantity-desc">Quantity (High to Low)</option>
        <option value="quantity-asc">Quantity (Low to High)</option>
        <option value="customerName-asc">Customer Name (A-Z)</option>
        <option value="customerName-desc">Customer Name (Z-A)</option>
      </select>
    </div>
  );
};

export default SortDropdown;

