import React, { useState, useEffect } from 'react';
import './ExpenseForm.css';

const categories = [
  { value: 'FOOD', label: 'Food' },
  { value: 'TRANSPORTATION', label: 'Transportation' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'RENT', label: 'Rent' },
  { value: 'SUPPLIES', label: 'Supplies' },
  { value: 'HEALTH', label: 'Health' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'DONATION', label: 'Donation' },
  { value: 'TEMPLE', label: 'Temple' },
  { value: 'GAS', label: 'Gas' },
  { value: 'GIFTS', label: 'Gifts' },
  { value: 'PERSONAL_EXPENSES', label: 'Personal Expenses' },
  { value: 'CAR_PAYMENT', label: 'Car Payment' },
  { value: 'TRAVEL', label: 'Travel' },
  { value: 'OUTSIDE_MEALS', label: 'Outside Meals' },
  { value: 'INTERNET', label: 'Internet' },
  { value: 'OTHER', label: 'Other' },
];

export default function ExpenseForm({ onSubmit, onCancel, initialData }) {
  const [form, setForm] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
  });
  const [error, setError] = useState('');

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        date: initialData.date || initialData.createdAt || '',
        description: initialData.description || '',
        category: initialData.category || '',
        amount: initialData.amount || '',
      });
    }
  }, [initialData]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.date || !form.description || !form.category || !form.amount) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit({ ...form, amount: parseFloat(form.amount) });
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <h3>{initialData ? 'Edit Expense' : 'Add Expense'}</h3>
      {error && <div className="form-error">{error}</div>}
      <label>
        Date:
        <input type="date" name="date" value={form.date} onChange={handleChange} />
      </label>
      <label>
        Description:
        <input type="text" name="description" value={form.description} onChange={handleChange} />
      </label>
      <label>
        Category:
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="">Select</option>
          {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
        </select>
      </label>
      <label>
        Amount:
        <input type="number" name="amount" value={form.amount} onChange={handleChange} min="0" step="0.01" />
      </label>
      <div className="form-actions">
        <button type="submit">{initialData ? 'Update' : 'Add'}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
} 