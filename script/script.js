function populateLineup(tableId) {
    const tbody = document.getElementById(tableId);
    if (!tbody) return; // Safety check

    tbody.innerHTML = ""; 
    const rowCount = 9; 

    for (let i = 0; i < rowCount; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" placeholder="#" class="input-small"></td>
            <td><input type="text" placeholder="Player Name" class="input-large"></td>
            <td><input type="text" placeholder="Pos" class="input-small"></td>
            ${Array(9).fill('<td><input type="text" class="at-bat-input"></td>').join('')}
            <td class="total-runs">0</td>
        `;
        tbody.appendChild(row);
    }
}

// Call the function for BOTH tables
populateLineup('lineup-body-ht');
populateLineup('lineup-body-at');

function exportToExcel() {
    let csv = 'Team,Number,Player,Pos,1,2,3,4,5,6,7,8,9,Totals\n';

    // Use querySelectorAll to grab rows from BOTH bodies
    const rows = document.querySelectorAll('#lineup-body-ht tr, #lineup-body-at tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => {
            const input = cell.querySelector('input');
            return input ? input.value : cell.innerText;
        });
        csv += rowData.join(',') + '\n';
    });

    // Create and download the blob
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "baseball_scorecard.csv";
    link.click();
}