import React from 'react';
import './ExpenseSummary.css';

export default function ExpenseSummary({ totalAmount, categoryTotals }) {
  return (
    <div className="expense-summary">
      <h3>Total Spent: ₹{totalAmount?.toFixed(2) || '0.00'}</h3>
      <div className="category-totals">
        <h4>By Category:</h4>
        <ul>
          {categoryTotals && Object.entries(categoryTotals).map(([cat, amt]) => (
            <li key={cat}>{cat}: ₹{amt.toFixed(2)}</li>
          ))}
        </ul>
      </div>
    </div>
  );
} 