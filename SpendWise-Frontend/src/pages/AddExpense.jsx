import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createExpense } from '../api/expenses';
import ExpenseForm from '../components/ExpenseForm';
import '../App.css';

export default function AddExpense() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(expense) {
    setLoading(true);
    setError('');
    try {
      await createExpense(expense);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <h2>Add New Expense</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loader">Adding...</div>}
      <ExpenseForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
    </div>
  );
} 