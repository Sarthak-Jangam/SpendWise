function getExpensesByAmountRange() {
    const minAmount = document.getElementById('minAmount').value;
    const maxAmount = document.getElementById('maxAmount').value;

    if (!minAmount || !maxAmount) {
        alert('Please enter both minimum and maximum amounts');
        return;
    }

    if (parseFloat(minAmount) > parseFloat(maxAmount)) {
        alert('Minimum amount cannot be greater than maximum amount');
        return;
    }

    fetch(`/api/expenses/expensesBetweenRanges?start=${minAmount}&end=${maxAmount}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server returned error: ' + response.status);
            }
            return response.json();
        })
        .then(expenses => {
            displayAmountSearchResults(expenses);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('expensesList').innerHTML =
                '<p class="error-message">Error loading expenses. Please try again.</p>';
            document.getElementById('totalAmount').textContent = '0.00';
        });
}

function displayAmountSearchResults(expenses) {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    if (!expenses || expenses.length === 0) {
        expensesList.innerHTML = '<p>No expenses found in the selected amount range.</p>';
        document.getElementById('totalAmount').textContent = '0.00';
        return;
    }

    let total = 0;
    expenses.forEach(expense => {
        total += expense.amount;
        const expenseElement = document.createElement('div');
        expenseElement.className = 'expense-item';
        expenseElement.innerHTML = `
            <div>
                <strong>${expense.description}</strong>
                <span>(${expense.category})</span>
            </div>
            <div>
                $${expense.amount.toFixed(2)}
            </div>
        `;
        expensesList.appendChild(expenseElement);
    });

    document.getElementById('totalAmount').textContent = total.toFixed(2);
}