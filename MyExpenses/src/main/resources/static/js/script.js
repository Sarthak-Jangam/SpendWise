document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('edit.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const expenseId = urlParams.get('id');
        if (expenseId) {
            loadExpenseDetails(expenseId);
        } else {
            window.location.href = 'index.html';
        }
    } else {
        if (document.getElementById('expenseForm')) {
            document.getElementById('expenseForm').addEventListener('submit', handleExpenseSubmit);
        }
        loadExpenses();
        loadTotalAmount();
    }
});


function loadExpenseDetails(id) {
    fetch(`/api/expenses/${id}`)
        .then(response => {
            if (!response.ok) throw new Error('Expense not found');
            return response.json();
        })
        .then(expense => {
            document.getElementById('editId').value = expense.id;
            document.getElementById('editDescription').value = expense.description;
            document.getElementById('editAmount').value = expense.amount;
            document.getElementById('editCategory').value = expense.category;
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to load expense details');
            window.location.href = 'index.html';
        });
}


if (document.getElementById('editForm')) {
    document.getElementById('editForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const updatedExpense = {
            description: document.getElementById('editDescription').value,
            amount: parseFloat(document.getElementById('editAmount').value),
            category: document.getElementById('editCategory').value
        };

        fetch(`/api/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedExpense)
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to update expense');
            return response.json();
        })
        .then(() => {
            alert('Expense updated successfully');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to update expense');
        });
    });
}


function handleExpenseSubmit(e) {
    e.preventDefault();
    const expense = {
        description: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value
    };
    addExpense(expense);
}

function addExpense(expense) {
    fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expense)
    })
    .then(response => response.json())
    .then(() => {
        loadExpenses();
        loadTotalAmount();
        document.getElementById('expenseForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add expense');
    });
}

function loadExpenses() {
    fetch('/api/expenses')
        .then(response => response.json())
        .then(expenses => updateExpensesList(expenses))
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('expensesList').innerHTML =
                '<p class="error-message">Failed to load expenses</p>';
        });
}

function loadTotalAmount() {
    fetch('/api/expenses/totalExpensesAmount')
        .then(response => response.json())
        .then(data => {
            document.getElementById('totalAmount').textContent = data.total.toFixed(2);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('totalAmount').textContent = '0.00';
        });
}

function editExpense(id) {
    window.location.href = `edit.html?id=${id}`;
}

function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    fetch(`/api/expenses/${id}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete');
        loadExpenses();
        loadTotalAmount();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to delete expense');
    });
}

function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    if (category) {
        fetch(`/api/expenses/byCategory?category=${category}`)
            .then(response => response.json())
            .then(expenses => updateExpensesList(expenses))
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to filter expenses');
            });
    } else {
        loadExpenses();
    }
}

function updateExpensesList(expenses) {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    if (!expenses || expenses.length === 0) {
        expensesList.innerHTML = '<p>No expenses found</p>';
        return;
    }

    expenses.forEach(expense => {
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div>
                <strong>${expense.description}</strong>
                <span>(${expense.category})</span>
            </div>
            <div>
                $${expense.amount.toFixed(2)}
                <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
            </div>
        `;
        expensesList.appendChild(expenseElement);
    });



    function filterByCategory() {
        const category = document.getElementById('categoryFilter').value;
        if (category) {
            fetch(`/api/expenses/byCategory?category=${category}`)
                .then(response => response.json())
                .then(expenses => {
                    updateExpensesList(expenses);
                    updateCategoryTotal(category);
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to filter expenses');
                });
        } else {
            loadExpenses();
            loadTotalAmount();
        }
    }

    function updateCategoryTotal(category) {
        fetch(`/api/expenses/totalAmountByCategory?category=${category}`)
            .then(response => response.json())
            .then(data => {
                const total = data[category.toLowerCase()] || 0;
                document.getElementById('totalAmount').textContent = total.toFixed(2);
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('totalAmount').textContent = '0.00';
            });
    }

    function updateExpensesList(expenses) {
        const expensesList = document.getElementById('expensesList');
        expensesList.innerHTML = '';

        if (!expenses || expenses.length === 0) {
            expensesList.innerHTML = '<p>No expenses found</p>';
            return;
        }

        expenses.forEach(expense => {
            const expenseElement = document.createElement('div');
            expenseElement.className = 'expense-item';
            expenseElement.innerHTML = `
                <div>
                    <strong>${expense.description}</strong>
                    <span class="category-tag">${expense.category}</span>
                </div>
                <div>
                    $${expense.amount.toFixed(2)}
                    <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
                </div>
            `;
            expensesList.appendChild(expenseElement);
        });
    }
}
