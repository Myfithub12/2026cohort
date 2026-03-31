document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const team = document.getElementById('team').value;
    const hits = parseFloat(document.getElementById('hits').value);
    const walks = parseFloat(document.getElementById('balls').value);
    const strikeouts = parseFloat(document.getElementById('strikeouts').value);
    const inningsPitched = parseFloat(document.getElementById('inningsPitched').value);

    // Calculate WHIP
    const WHIP = (walks + hits) / inningsPitched;

    // Insert into pitching table
    const tableBody = document.querySelector('#pitchingTable tbody');
    const row = tableBody.insertRow(-1);

    row.innerHTML = `
        <td>${name}</td>
        <td>${walks}</td>
        <td>${strikeouts}</td>
        <td>${hits}</td>
        <td>${inningsPitched}</td>
        <td class="whip">${WHIP.toFixed(2)}</td>
        <td>
            <button class="edit-row">Edit</button>
            <button class="delete-row">Delete</button>
        </td>
    `;

    // Color-code WHIP
    colorCodeWHIP(row.querySelector(".whip"));

    // Add delete functionality
    row.querySelector(".delete-row").addEventListener("click", () => {
        row.remove();
    });

    // Add edit functionality
    row.querySelector(".edit-row").addEventListener("click", () => {
        editRow(row);
    });

    // Save TXT file
    const newTxtLine = `${name},${team},${WHIP.toFixed(2)}\n`;
    const blob = new Blob([newTxtLine], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "whip_data.txt";
    a.click();

    URL.revokeObjectURL(url);

    // Clear form
    document.getElementById('dataForm').reset();
});

// Color coding function
function colorCodeWHIP(cell) {
    const value = parseFloat(cell.textContent);

    if (value <= 1.10) {
        cell.style.color = "green";
        cell.style.fontWeight = "bold";
    } else if (value <= 1.30) {
        cell.style.color = "orange";
    } else {
        cell.style.color = "red";
        cell.style.fontWeight = "bold";
    }
}

// Edit row function
function editRow(row) {
    const cells = row.querySelectorAll("td");

    const name = prompt("Pitcher Name:", cells[0].textContent);
    const walks = prompt("Walks:", cells[1].textContent);
    const strikeouts = prompt("Strikeouts:", cells[2].textContent);
    const hits = prompt("Hits:", cells[3].textContent);
    const innings = prompt("Innings Pitched:", cells[4].textContent);

    const WHIP = (parseFloat(walks) + parseFloat(hits)) / parseFloat(innings);

    cells[0].textContent = name;
    cells[1].textContent = walks;
    cells[2].textContent = strikeouts;
    cells[3].textContent = hits;
    cells[4].textContent = innings;
    cells[5].textContent = WHIP.toFixed(2);

    colorCodeWHIP(cells[5]);
}

// Sort by WHIP
document.getElementById("sortWhip").addEventListener("click", () => {
    const tbody = document.querySelector("#pitchingTable tbody");
    const rows = Array.from(tbody.querySelectorAll("tr"));

    rows.sort((a, b) => {
        const whipA = parseFloat(a.querySelector(".whip").textContent);
        const whipB = parseFloat(b.querySelector(".whip").textContent);
        return whipA - whipB;
    });

    rows.forEach(row => tbody.appendChild(row));
});