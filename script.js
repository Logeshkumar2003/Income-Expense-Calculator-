document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const addBtn = document.getElementById('addBtn');
    const resetBtn = document.getElementById('resetBtn');
    const entryList = document.getElementById('entryList');
    const totalIncome = document.getElementById('totalIncome');
    const totalExpense = document.getElementById('totalExpense');
    const netBalance = document.getElementById('netBalance');
    const filters = document.querySelectorAll('input[name="filter"]');

    let entries = JSON.parse(localStorage.getItem('entries')) || [];

    // Render entries
    const renderEntries = (filter = 'all') => {
        entryList.innerHTML = '';
        let totalInc = 0;
        let totalExp = 0;

        entries
            .filter(entry => filter === 'all' || entry.type === filter)
            .forEach((entry, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
          <span>${entry.description}: <span>&#8377;</span> ${entry.amount} (${entry.type})</span>
          <div>
            <button onclick="editEntry(${index})">Edit</button>
            <button class="deleteBtn" onclick="deleteEntry(${index})">Delete</button>
          </div>
        `;
                entryList.appendChild(li);

                if (entry.type === 'income') totalInc += entry.amount;
                else totalExp += entry.amount;
            });

        totalIncome.textContent = totalInc;
        totalExpense.textContent = totalExp;
        netBalance.textContent = totalInc - totalExp;
    };

    // Add entry
    addBtn.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;

        if (description && amount > 0) {
            entries.push({
                description,
                amount,
                type
            });
            localStorage.setItem('entries', JSON.stringify(entries));
            renderEntries();
            descriptionInput.value = '';
            amountInput.value = '';
        }
    });

    // Reset fields
    resetBtn.addEventListener('click', () => {
        descriptionInput.value = '';
        amountInput.value = '';
    });

    // Edit entry
    window.editEntry = (index) => {
        const entry = entries[index];
        descriptionInput.value = entry.description;
        amountInput.value = entry.amount;
        typeInput.value = entry.type;
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    // Delete entry
    window.deleteEntry = (index) => {
        entries.splice(index, 1);
        localStorage.setItem('entries', JSON.stringify(entries));
        renderEntries();
    };

    // Filter entries
    filters.forEach(filter => {
        filter.addEventListener('change', () => {
            renderEntries(filter.value);
        });
    });

    // Initial render
    renderEntries();
});