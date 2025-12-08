import { useMemo } from 'react';
import './SummaryCards.css';

const SummaryCards = ({ transactions }) => {
  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return {
        totalUnits: 0,
        totalAmount: 0,
        totalDiscount: 0,
        transactionCount: 0
      };
    }

    const totals = transactions.reduce((acc, transaction) => {
      acc.totalUnits += transaction.Quantity || 0;
      acc.totalAmount += transaction['Final Amount'] || 0;
      acc.totalDiscount += (transaction['Total Amount'] || 0) - (transaction['Final Amount'] || 0);
      return acc;
    }, { totalUnits: 0, totalAmount: 0, totalDiscount: 0 });

    return {
      ...totals,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="summary-cards">
      <div className="summary-card">
        {/* <div className="summary-card-icon"></div> */}
        <div className="summary-card-content">
          <div className="summary-card-label">Total units sold</div>
          <div className="summary-card-value">{summary.totalUnits}</div>
        </div>
      </div>
      
      <div className="summary-card">
        {/* <div className="summary-card-icon"></div> */}
        <div className="summary-card-content">
          <div className="summary-card-label">Total Amount</div>
          <div className="summary-card-value">
            {formatCurrency(summary.totalAmount)} ({summary.transactionCount} {summary.transactionCount === 1 ? 'SR' : 'SRs'})
          </div>
        </div>
      </div>
      
      <div className="summary-card">
        {/* <div className="summary-card-icon"></div> */}
        <div className="summary-card-content">
          <div className="summary-card-label">Total Discount</div>
          <div className="summary-card-value">
            {formatCurrency(summary.totalDiscount)} ({summary.transactionCount} {summary.transactionCount === 1 ? 'SR' : 'SRs'})
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;

