const BASE_URL = 'http://localhost:8080/api/expenses';

// Helper to handle fetch responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API error');
  }
  return response.json();
}

export async function fetchExpenses(params = {}) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, value);
    }
  });
  const res = await fetch(url);
  return handleResponse(res);
}

export async function fetchExpense(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  return handleResponse(res);
}

export async function createExpense(expense) {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function updateExpense(id, expense) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok && res.status !== 204) {
    const error = await res.text();
    throw new Error(error || 'Delete failed');
  }
  return true;
} 