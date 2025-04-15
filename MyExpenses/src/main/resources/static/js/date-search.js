// Initialize default dates when page loads
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    document.getElementById('startDate').value = firstDay.toISOString().split('T')[0];
    document.getElementById('endDate').value = today.toISOString().split('T')[0];
});

function searchByDate() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }

    fetch(`/api/expenses/betweenDates?startDate=${startDate}&endDate=${endDate}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Server returned error: ' + response.status);
            }
            return response.json();
        })
        .then(expenses => {
            displayDateSearchResults(expenses);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('expensesList').innerHTML =
                '<p class="error-message">Error loading expenses. Please try again.</p>';
            document.getElementById('totalAmount').textContent = '0.00';
        });
}

function displayDateSearchResults(expenses) {
    const expensesList = document.getElementById('expensesList');
    expensesList.innerHTML = '';

    if (!expenses || expenses.length === 0) {
        expensesList.innerHTML = '<p>No expenses found for the selected date range.</p>';
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