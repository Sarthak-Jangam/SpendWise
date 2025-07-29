import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExpense, updateExpense } from '../api/expenses';
import ExpenseForm from '../components/ExpenseForm';
import '../App.css';

export default function EditExpense() {
  const { id } = useParams();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchExpense(id);
        setExpense(data);
      } catch (e) {
        setError(e.message || 'Failed to load expense');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(updated) {
    setLoading(true);
    setError('');
    try {
      await updateExpense(id, updated);
      navigate('/');
    } catch (e) {
      setError(e.message || 'Failed to update expense');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="loader">Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!expense) return <div className="error-message">Expense not found.</div>;

  return (
    <div className="page-container">
      <h2>Edit Expense</h2>
      <ExpenseForm initialData={expense} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
    </div>
  );
} 