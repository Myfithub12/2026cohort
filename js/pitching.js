/* ============================================================
   SCOREBOARD BALL / STRIKE / FOUL LOGIC (GLOBAL FUNCTIONS)
   These MUST remain global so HTML buttons can call them.
============================================================ */

function addBall(team = "home") {
    const id = team === "home" ? "balls-home" : "balls-away";
    document.getElementById(id).textContent += "●";
}

function addStrike(team = "home") {
    const id = team === "home" ? "strikes-home" : "strikes-away";
    document.getElementById(id).textContent += "●";
}

function addFoul(team = "home") {
    const id = team === "home" ? "strikes-home" : "strikes-away";
    const current = document.getElementById(id).textContent.length;

    // Foul balls only add strikes until 2 strikes
    if (current < 2) {
        document.getElementById(id).textContent += "●";
    }
}

/* ============================================================
   PITCHING TRACKER MODULE
============================================================ */

const PitchingTracker = (() => {

    const CONFIG = {
        tableBody: document.querySelector('#pitchingTable tbody'),
        form: document.getElementById('dataForm'),
        fileInput: document.getElementById('csvData'),
        storageKey: 'whipData',
        csvHeader: "Name,Team,Walks,Strikeouts,Hits,Innings,WHIP\n"
    };

    /* Load saved pitching data on page load */
    window.addEventListener("load", () => {
        const savedData = localStorage.getItem(CONFIG.storageKey);
        if (savedData) loadPitchingTable(savedData);
    });

    /* Safe form initialization */
    document.addEventListener('DOMContentLoaded', () => {
        if (CONFIG.form) {
            CONFIG.form.addEventListener('submit', (event) => {
                event.preventDefault();

                const data = {
                    name: document.getElementById('name').value,
                    team: document.getElementById('team').value,
                    walks: parseFloat(document.getElementById('walks').value) || 0,
                    strikeouts: parseFloat(document.getElementById('strikeouts').value) || 0,
                    hits: parseFloat(document.getElementById('hits').value) || 0,
                    innings: parseFloat(document.getElementById('inningsPitched').value) || 1
                };

                const whip = (data.walks + data.hits) / data.innings;

                addPitchingRow({ ...data, whip });
                savePitchingData(data, whip);

                CONFIG.form.reset();
            });
        }
    });

    /* Add a new row to the pitching table */
    function addPitchingRow(data) {
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

        colorWHIP(row.querySelector(".whip"));
        attachPitchingRowEvents(row);
    }

    /* Attach edit/delete events */
    function attachPitchingRowEvents(row) {
        row.querySelector(".delete-row").addEventListener("click", () => {
            if (confirm("Delete this entry?")) {
                row.remove();
                syncPitchingStorage();
            }
        });

        row.querySelector(".edit-row").addEventListener("click", () => {
            editPitchingRow(row);
        });
    }

    /* Edit a pitching row */
    function editPitchingRow(row) {
        const cells = row.querySelectorAll("td");
        const prompts = ["Name", "Team", "Walks", "Strikeouts", "Hits", "Innings"];
        const values = [];

        for (let i = 0; i < prompts.length; i++) {
            const val = prompt(`Edit ${prompts[i]}:`, cells[i].textContent);
            if (val === null) return;
            values.push(val);
        }

        const walks = parseFloat(values[2]) || 0;
        const hits = parseFloat(values[4]) || 0;
        const innings = parseFloat(values[5]) || 1;
        const whip = (walks + hits) / innings;

        values.forEach((val, i) => cells[i].textContent = val);
        cells[6].textContent = whip.toFixed(2);

        colorWHIP(cells[6]);
        syncPitchingStorage();
    }

    /* Color-code WHIP values */
    function colorWHIP(cell) {
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

    /* Load pitching table from CSV text */
    function loadPitchingTable(text) {
        const lines = text.trim().split("\n").slice(1);
        CONFIG.tableBody.innerHTML = "";

        lines.forEach(line => {
            const [name, team, walks, strikeouts, hits, innings, whip] = line.split(",");
            addPitchingRow({
                name, team, walks, strikeouts, hits, innings,
                whip: parseFloat(whip)
            });
        });
    }

    /* Save table to localStorage */
    function syncPitchingStorage() {
        const rows = CONFIG.tableBody.querySelectorAll("tr");
        let content = CONFIG.csvHeader;

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll("td")).slice(0, 7);
            content += cells.map(c => c.textContent).join(",") + "\n";
        });

        localStorage.setItem(CONFIG.storageKey, content);
    }

    /* Save a single new entry */
    function savePitchingData(data, whip) {
        const newLine = `${data.name},${data.team},${data.walks},${data.strikeouts},${data.hits},${data.innings},${whip.toFixed(2)}\n`;

        const existing = localStorage.getItem(CONFIG.storageKey) || CONFIG.csvHeader;
        const updated = existing.endsWith("\n") ? existing + newLine : existing + "\n" + newLine;

        localStorage.setItem(CONFIG.storageKey, updated);
    }

    return {
        addPitchingRow,
        savePitchingData
    };

})();