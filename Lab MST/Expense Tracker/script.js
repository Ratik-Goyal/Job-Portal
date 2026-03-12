let expenses = [];
let selectedIndex = -1;

function addExpense() {
    let name = document.getElementById('expenseName').value;
    let amount = document.getElementById('amount').value;
    let category = document.getElementById('category').value;
    
    expenses.push({name: name, amount: amount, category: category});
    display();
    clear();
}

function updateExpense() {
    if(selectedIndex >= 0) {
        expenses[selectedIndex].name = document.getElementById('expenseName').value;
        expenses[selectedIndex].amount = document.getElementById('amount').value;
        expenses[selectedIndex].category = document.getElementById('category').value;
        selectedIndex = -1;
        display();
        clear();
    }
}

function deleteExpense() {
    if(selectedIndex >= 0) {
        expenses.splice(selectedIndex, 1);
        selectedIndex = -1;
        display();
        clear();
    }
}

function display() {
    let table = document.getElementById('expenseTable');
    table.innerHTML = '<tr><th>Name</th><th>Amount</th><th>Category</th></tr>';
    
    for(let i = 0; i < expenses.length; i++) {
        let row = table.insertRow();
        row.onclick = function() {
            selectedIndex = i;
            document.getElementById('expenseName').value = expenses[i].name;
            document.getElementById('amount').value = expenses[i].amount;
            document.getElementById('category').value = expenses[i].category;
        };
        row.insertCell(0).innerHTML = expenses[i].name;
        row.insertCell(1).innerHTML = expenses[i].amount;
        row.insertCell(2).innerHTML = expenses[i].category;
    }
    
    calculateTotal();
}

function calculateTotal() {
    let total = 0;
    for(let i = 0; i < expenses.length; i++) {
        total += parseFloat(expenses[i].amount);
    }
    document.getElementById('total').innerHTML = 'Total: ' + total;
}

function clear() {
    document.getElementById('expenseName').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('category').value = 'Food';
}