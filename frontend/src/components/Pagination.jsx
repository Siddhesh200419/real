import './Pagination.css';

const Pagination = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage, totalItems } = pagination;

  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (hasPreviousPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers to show (max 6 page numbers)
  const getPageNumbers = () => {
    const maxPagesToShow = 6;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is 6 or less
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // If more than 6 pages, show exactly 6 page numbers
    const pages = [];
    
    if (currentPage <= 3) {
      // Near the start: show 1, 2, 3, 4, 5, 6
      for (let i = 1; i <= maxPagesToShow; i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Near the end: show last 6 pages
      for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // In the middle: show 1, ..., and 4 pages around current
      pages.push(1);
      pages.push('...');
      // Show current-1, current, current+1, current+2 (4 pages)
      for (let i = currentPage - 1; i <= currentPage + 2; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  return (
    <div className="pagination">
      <div className="pagination-numbers">
        {getPageNumbers().map((page, index) => {
          if (page === '...') {
            return <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>;
          }
          return (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Pagination;

