import './TransactionTable.css';
import PhoneNumberCell from './PhoneNumberCell';

const TransactionTable = ({ transactions, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="table-container">
        <div className="loading">Loading transactions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-container">
        <div className="error-message" style={{ color: '#d32f2f', padding: '40px', textAlign: 'center' }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="table-container">
        <div className="no-results">No transactions found</div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '-');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Customer ID</th>
            <th>Customer name</th>
            <th>Phone Number</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Product Category</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer region</th>
            <th>Product ID</th>
            <th>Employee name</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={`${transaction['Transaction ID']}-${index}`}>
              <td>{transaction['Transaction ID']}</td>
              <td>{formatDate(transaction.Date)}</td>
              <td>{transaction['Customer ID']}</td>
              <td>{transaction['Customer Name']}</td>
              <td>
                <PhoneNumberCell phoneNumber={transaction['Phone Number']} />
              </td>
              <td>{transaction.Gender}</td>
              <td>{transaction.Age}</td>
              <td>{transaction['Product Category']}</td>
              <td>{String(transaction.Quantity || 0).padStart(2, '0')}</td>
              <td className="amount-cell">{formatCurrency(transaction['Total Amount'] || 0)}</td>
              <td>{transaction['Customer Region']}</td>
              <td>{transaction['Product ID']}</td>
              <td>{transaction['Employee Name']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;

