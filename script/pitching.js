/**
 * PITCHING DATA TRACKER
 * Refactored for efficiency and modularity
 */

// Configuration and Selectors
const CONFIG = {
    tableBody: document.querySelector('#pitchingTable tbody'),
    form: document.getElementById('dataForm'),
    fileInput: document.getElementById('csvData'),
    storageKey: 'whipData',
    csvHeader: "Name,Team,Walks,Strikeouts,Hits,Innings,WHIP\n"
};

// --- INITIALIZATION ---
window.addEventListener("load", () => {
    const savedData = localStorage.getItem(CONFIG.storageKey);
    if (savedData) loadTableFromText(savedData);
});

// --- EVENT LISTENERS ---

// Handle Form Submission
CONFIG.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = {
        name: document.getElementById('name').value,
        team: document.getElementById('team').value,
        hits: parseFloat(document.getElementById('hits').value) || 0,
        walks: parseFloat(document.getElementById('balls').value) || 0,
        strikeouts: parseFloat(document.getElementById('strikeouts').value) || 0,
        innings: parseFloat(document.getElementById('inningsPitched').value) || 1
    };

    const whip = (data.walks + data.hits) / data.innings;
    
    // Add to UI
    addRowToTable({ ...data, whip });
    
    // Persist Data
    updateDataAndDownload(data, whip);
    
    CONFIG.form.reset();
});

// Handle File Import
CONFIG.fileInput.addEventListener("change", function() {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        loadTableFromText(reader.result);
        localStorage.setItem(CONFIG.storageKey, reader.result);
    };
    reader.readAsText(file);
});

// Handle Sorting
document.getElementById("sortWhip").addEventListener("click", () => {
    const rows = Array.from(CONFIG.tableBody.querySelectorAll("tr"));
    rows.sort((a, b) => {
        const whipA = parseFloat(a.querySelector(".whip").textContent);
        const whipB = parseFloat(b.querySelector(".whip").textContent);
        return whipA - whipB;
    });
    rows.forEach(row => CONFIG.tableBody.appendChild(row));
});

// --- CORE FUNCTIONS ---

function addRowToTable(data) {
    const row = CONFIG.tableBody.insertRow(-1);
    row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.team}</td>
        <td>${data.walks}</td>
        <td>${data.strikeouts}</td>
        <td>${data.hits}</td>
        <td>${data.innings}</td>
        <td class="whip">${data.whip.toFixed(2)}</td>
        <td>
            <button class="edit-row">Edit</button>
            <button class="delete-row">Delete</button>
        </td>
    `;

    colorCodeWHIP(row.querySelector(".whip"));
    attachRowEvents(row);
}

function attachRowEvents(row) {
    row.querySelector(".delete-row").addEventListener("click", () => {
        if (confirm("Delete this entry?")) {
            row.remove();
            syncStorageFromTable();
        }
    });

    row.querySelector(".edit-row").addEventListener("click", () => {
        editRow(row);
    });
}

function editRow(row) {
    const cells = row.querySelectorAll("td");
    const prompts = ["Name", "Team", "Walks", "Strikeouts", "Hits", "Innings"];
    const values = [];

    // Prompt for each field
    for (let i = 0; i < prompts.length; i++) {
        const val = prompt(`Edit ${prompts[i]}:`, cells[i].textContent);
        if (val === null) return; // User cancelled
        values.push(val);
    }

    // Recalculate WHIP
    const walks = parseFloat(values[2]) || 0;
    const hits = parseFloat(values[4]) || 0;
    const innings = parseFloat(values[5]) || 1;
    const whip = (walks + hits) / innings;

    // Update UI
    values.forEach((val, i) => cells[i].textContent = val);
    cells[6].textContent = whip.toFixed(2);
    
    colorCodeWHIP(cells[6]);
    syncStorageFromTable();
}

// --- HELPERS ---

function colorCodeWHIP(cell) {
    const val = parseFloat(cell.textContent);
    cell.style.fontWeight = "bold";

    if (val <= 1.10) {
        cell.style.color = "green";
    } else if (val <= 1.30) {
        cell.style.color = "orange";
        cell.style.fontWeight = "normal";
    } else {
        cell.style.color = "red";
    }
}

function loadTableFromText(text) {
    const lines = text.trim().split("\n").slice(1); // skip header
    CONFIG.tableBody.innerHTML = "";

    lines.forEach(line => {
        const [name, team, walks, strikeouts, hits, innings, whip] = line.split(",");
        addRowToTable({
            name, team, walks, strikeouts, hits, innings,
            whip: parseFloat(whip)
        });
    });
}

function syncStorageFromTable() {
    const rows = CONFIG.tableBody.querySelectorAll("tr");
    let content = CONFIG.csvHeader;

    rows.forEach(row => {
        const cells = Array.from(row.querySelectorAll("td")).slice(0, 7);
        content += cells.map(c => c.textContent).join(",") + "\n";
    });

    localStorage.setItem(CONFIG.storageKey, content);
}

function updateDataAndDownload(data, whip) {
    const newLine = `${data.name},${data.team},${data.walks},${data.strikeouts},${data.hits},${data.innings},${whip.toFixed(2)}\n`;
    
    const finalize = (fullContent) => {
        saveTxt(fullContent);
        localStorage.setItem(CONFIG.storageKey, fullContent);
    };

    if (CONFIG.fileInput.files.length > 0) {
        const reader = new FileReader();
        reader.onload = () => finalize(reader.result + newLine);
        reader.readAsText(CONFIG.fileInput.files[0]);
    } else {
        const existing = localStorage.getItem(CONFIG.storageKey) || CONFIG.csvHeader;
        finalize(existing.endsWith("\n") ? existing + newLine : existing + "\n" + newLine);
    }
}

function saveTxt(content) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whip_data.txt";
    a.click();
    URL.revokeObjectURL(url);
}