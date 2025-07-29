import React from 'react';
import './CategoryFilter.css';

export default function CategoryFilter({ categories, value, onChange }) {
  function formatCategory(category) {
    if (!category) return '';
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  return (
    <div className="category-filter">
      <label>
        Category:
        <select value={value} onChange={e => onChange(e.target.value)}>
          <option value="">All</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{formatCategory(cat)}</option>
          ))}
        </select>
      </label>
    </div>
  );
} 