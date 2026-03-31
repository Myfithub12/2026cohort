async function exportToNotepad() {
    let txtContent = "Team,Player,Pos,1,2,3,4,5,6,7,8,9,Total\n";

    function scrapeTeam(tbodyId, teamName) {
        const rows = document.querySelectorAll(`#${tbodyId} tr`);
        let output = "";

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");

            const rowValues = Array.from(cells).map(cell => {
                const input = cell.querySelector("input");
                const select = cell.querySelector("select");

                if (select) return select.value;   // <-- NO NOTES
                if (input) return input.value;

                return cell.innerText;
            });

            output += `${teamName},` + rowValues.join(",") + "\n";
        });

        return output;
    }

    txtContent += scrapeTeam("lineup-body-ht", "Home");
    txtContent += "\n";
    txtContent += scrapeTeam("lineup-body-at", "Away");

    // Changed from CSV to TXT
    const blob = new Blob([txtContent], { type: "text/plain;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    // Changed filename extension
    a.download = "baseball_scorecard.txt";

    a.click();
    URL.revokeObjectURL(url);
}

// Get the selected value from the dropdown
const selection = document.getElementById('hit-Out-Walk').value;

// Creating variables for ERA calculation
let era = parseFloat(document.getElementById('eraValue').innerText);
const earnedRuns = 1; //assuming 1 earned run is added for each "hit"

function saveFormData() {
    const formData = {
        date: document.getElementById('date').value,
        name: document.getElementById('name').value,
        team: document.getElementById('team').value,
    };

    localStorage.setItem('formData', JSON.stringify(formData));
    alert('Form data has been saved successfully.');
}

// Load the saved form data if it exists
window.onload = function() {
    const savedFormData = localStorage.getItem('formData');
    if (savedFormData) {
        const formData = JSON.parse(savedFormData);
        document.getElementById('date').value = formData.name;
        document.getElementById('name').value = formData.name;
        document.getElementById('team').value = formData.team;
        document.getElementById('hitOrOut').value = formData.hitOrOut;
    }
};

function calculateBattingAverage() {
    const results = document.querySelectorAll('.atbat-result');

    let totalAtBats = 0;
    let totalHits = 0;

    results.forEach(select => {
        const value = select.value;

        // HIT
        if (value === "hit" ||
            value === "reach-on-error"
        ) {
            totalHits++;
            totalAtBats++;
        }

        // OUTS that count as at-bats
        else if (
            value === "ground-out" ||
            value === "strikeout" ||
            value === "fly-out" ||
            value === "fielders-choice"
        ) {
            totalAtBats++;
        }

        // Walk, HBP, Sac Bunt, Interference → do NOT count as AB
    });

    const battingAverage = totalHits / totalAtBats || 0;

    document.getElementById('batting-average').textContent =
        battingAverage.toFixed(3);
}

function updateERA() {
    const results = document.querySelectorAll('.atbat-result');

    let era = parseFloat(document.getElementById('eraValue').innerText);
    let earnedRuns = 0;

    results.forEach(select => {
        if (select.value === "hit" ||
            select.value === "reach-on-error"
        ) {
            earnedRuns += 1;
        }
    });

    era += earnedRuns;

    document.getElementById('eraValue').innerText = era.toFixed(2);
}

// Auto-update stats after each at-bat selection
document.querySelectorAll('.atbat-result').forEach(select => {
    select.addEventListener('change', () => {
        calculateBattingAverage();
        updateERA();
    });
});

function updateERA() {
    // ... your existing ERA code ...
}

//INSERT addPlayer() RIGHT HERE
function addPlayer(tbodyId, insertAfterRow = null) {
    const tbody = document.getElementById(tbodyId);

    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" placeholder="Player Name"></td>
        <td><input type="text" placeholder="Pos"></td>
        <td><select class="atbat-result">
                <option value="">--</option>
                <option value="hit">Hit</option>
                <option value="ground-out">Ground Out</option>
                <option value="strikeout">Strikeout</option>
                <option value="fly-out">Fly Out</option>
                <option value="reach-on-error">Reach on Error</option>
                <option value="walk">Walk</option>
            </select>
        </td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><input type="text"></td>
        <td><button class="add-below">+</button></td>
    `;

    // Insert in correct position
    if (insertAfterRow) {
        insertAfterRow.insertAdjacentElement("afterend", newRow);
    } else {
        tbody.appendChild(newRow);
    }

    // Make sure new selects update stats
    newRow.querySelectorAll('.atbat-result').forEach(select => {
        select.addEventListener('change', () => {
            calculateBattingAverage();
            updateERA();
        });
    });

    // Add handler for the "+" button
    newRow.querySelector(".add-below").addEventListener("click", () => {
        addPlayer(tbodyId, newRow);
    });
}

document.querySelectorAll(`#${tbodyId} tr`)

