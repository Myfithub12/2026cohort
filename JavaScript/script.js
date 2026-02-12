const players = [
    "P1 Name", "P2 Name", "P3 Name", "P4 Name", "P5 Name",
    "P6 Name", "P7 Name", "P8 Name", "P9 Name"
];

function populateLineup() {
    const tbody = document.getElementById('lineup-body');

    players.forEach(player => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${player}</td>
            <td>SS</td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="at-bat-cell"></td>
            <td class="total-runs">0</td>
        `;

        tbody.appendChild(row);
    });
}

function exportToExcel() {
    let csv = 'Player,Pos,1,2,3,4,5,6,7,8,9,R\n';

    document.querySelectorAll('#lineup-body tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        const rowData = Array.from(cells).map(cell => cell.innerText);
        csv += rowData.join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "baseball_scorecard.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

populateLineup();