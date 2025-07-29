import React from 'react';
import './ExpenseList.css';

export default function ExpenseList({ expenses, onEdit, onDelete }) {
  if (!expenses || expenses.length === 0) {
    return <div className="expense-list-empty">No expenses found.</div>;
  }

  function formatDate(dateString) {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
    } catch (e) {
      return dateString;
    }
  }

  function formatCategory(category) {
    if (!category) return '';
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <table className="expense-list-table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Description</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {expenses.map(exp => (
          <tr key={exp.id}>
            <td>{formatDate(exp.date || exp.createdAt)}</td>
            <td>{exp.description}</td>
            <td>{formatCategory(exp.category)}</td>
            <td>₹{exp.amount}</td>
            <td>
              <button onClick={() => onEdit(exp)}>Edit</button>
              <button onClick={() => onDelete(exp.id)} className="delete-btn">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 