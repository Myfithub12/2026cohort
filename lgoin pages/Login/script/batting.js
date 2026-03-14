// Get the selected value from the dropdown
const selection = document.getElementById('hitOrOut').value;

// Creating variables for ERA calculation
let era = parseFloat(document.getElementById('eraValue').innerText);
const earnedRuns = 1; //assuming 1 earned run is added for each "hit"

function saveFormData() {
    const formData = {
        name: document.getElementById('date').value,
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
    // Get checkboxes
    const hit = document.querySelector('input[name="hit"]').checked;
    const plainOldOut = document.querySelector('input[name="plain-old-out"]').checked;
    const fieldersChoice = document.querySelector('input[name="fielders-choice"]').checked;
    const reachOnError = document.querySelector('input[name="reach-on-error"]').checked;
    const droppedStrike = document.querySelector('input[name="dropped-strike"]').checked;

    // Get total number of at-bats
    const totalAtBats = parseInt(document.getElementById('total-at-bats').value) || 0;

    // Calculate total hits
    let totalHits = 0;

    if (hit) {
        totalHits++;
    }

    // Calculate batting average
    const battingAverage = totalHits / totalAtBats || 0; // Default to 0 if no at bats

    // Display batting average
    document.getElementById('batting-average').textContent = battingAverage.toFixed(3); // Display with three decimal places
}

// Extract data from table
let table = document.getElementById("myTable");
let rows = table.getElementsByTagName("tr");
let csvData = [];

for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].getElementsByTagName("td");
    let row = [];
    for (let j = 0; j < cells.length; j++) {
        row.push(cells[j].innerText);
    }
    if (row.length > 0) {
        csvData.push(row);
    }
}

// Add headers
csvData.unshift(["Header1", "Header2", "Header3"]);

// Convert to CSV and download
let csvContent = "data:text/csv;charset=utf-8," 
    + csvData.map(e => e.join(",")).join("\n");
let encodedUri = encodeURI(csvContent);
let link = document.createElement("a");
link.setAttribute("href", encodedUri);
link.setAttribute("download", "batting.csv");
document.body.appendChild(link);
link.click();
