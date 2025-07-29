import React, { useEffect, useState } from 'react';
import { fetchExpenses, createExpense, updateExpense, deleteExpense } from '../api/expenses';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseSummary from '../components/ExpenseSummary';
import CategoryFilter from '../components/CategoryFilter';
import '../App.css';
import { useNavigate } from 'react-router-dom';

const categories = [
  'FOOD',
  'TRANSPORTATION',
  'ENTERTAINMENT',
  'UTILITIES',
  'RENT',
  'SUPPLIES',
  'HEALTH',
  'EDUCATION',
  'DONATION',
  'TEMPLE',
  'GAS',
  'GIFTS',
  'PERSONAL_EXPENSES',
  'CAR_PAYMENT',
  'TRAVEL',
  'OUTSIDE_MEALS',
  'INTERNET',
  'OTHER',
];

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [categoryTotals, setCategoryTotals] = useState({});
  const [category, setCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function loadExpenses(filter = {}) {
    setLoading(true);
    setError('');
    try {
      const data = await fetchExpenses(filter);
      setExpenses(data.expenses || []);
      setTotalAmount(data.totalAmount || 0);
      setCategoryTotals(data.categoryTotals || {});
    } catch (e) {
      setError(e.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses(category ? { category } : {});
  }, [category]);

  function handleAddClick() {
    navigate('/add');
  }

  function handleEdit(exp) {
    navigate(`/edit/${exp.id}`);
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this expense?')) return;
    setLoading(true);
    setError('');
    try {
      await deleteExpense(id);
      loadExpenses(category ? { category } : {});
    } catch (e) {
      setError(e.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(exp) {
    setLoading(true);
    setError('');
    try {
      if (editData) {
        await updateExpense(editData.id, exp);
      } else {
        await createExpense(exp);
      }
      setShowForm(false);
      loadExpenses(category ? { category } : {});
    } catch (e) {
      setError(e.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-left">
        <ExpenseSummary totalAmount={totalAmount} categoryTotals={categoryTotals} />
      </div>
      <div className="dashboard-right">
        <div className="dashboard-controls">
          <CategoryFilter categories={categories} value={category} onChange={setCategory} />
          <button onClick={handleAddClick}>Add Expense</button>
        </div>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loader">Loading...</div>}
        <ExpenseList expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
} 