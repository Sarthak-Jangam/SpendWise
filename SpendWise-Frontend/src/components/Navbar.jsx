import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const location = useLocation();
  const isAddEditPage = location.pathname === '/add' || location.pathname.startsWith('/edit/');
  
  return (
    <nav className={`navbar ${isAddEditPage ? 'navbar-add-edit' : ''}`}>
      <div className="navbar-brand">SpendWise</div>
      <div className="navbar-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
        <Link to="/add" className={location.pathname === '/add' ? 'active' : ''}>Add Expense</Link>
      </div>
    </nav>
  );
} 