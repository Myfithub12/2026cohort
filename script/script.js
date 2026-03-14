const players = [
{ name: "", number: "", position: "" },
    { name: "", number: "", position: "" },
    { name: "", number: "", position: "" },
];

function populateLineup() {
    const tbody = document.getElementById('lineup-body');
    tbody.innerHTML = ""; // Cleared and fixed typo

    // Define how many empty rows you want (e.g., 9 for a standard lineup)
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

function exportToExcel() {
    let csv = 'Number,Player,Pos,1,2,3,4,5,6,7,8,9,Totals\n';

    document.querySelectorAll('#lineup-body tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => {
            const input = cell.querySelector('input');

// If there's an input, get its value; otherwise, get the text (for the Total column)
            return input ? input.value : cell.innerText;
        });
        csv += rowData.join(',') + '\n';
    });

    document.getElementById("myTable").addEventListener("input", (e) => {
  const table = document.getElementById("myTable");
  const rowCount = table.rows.length;
  
  // Logic: If we are at row 9 and it's currently the last row, add row 10
  
  if (rowCount === 9) {
    addRow();
  }
});

    // ... (rest of your existing blob/download code)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "baseball_scorecard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

populateLineup();
