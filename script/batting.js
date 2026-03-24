async function exportToExcel() {
    let csvContent = "Team,Player,Pos,1,2,3,4,5,6,7,8,9,Total\n";

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

    csvContent += scrapeTeam("lineup-body-ht", "Home");
    csvContent += "\n";
    csvContent += scrapeTeam("lineup-body-at", "Away");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "baseball_scorecard.csv";
    a.click();
    URL.revokeObjectURL(url);
}

/* Sending to backend server
async function exportToExcel() {
  const csvContent = "Name,Age\nJohn Doe,30\nJane Smith,25";
  
  // Use FormData to send the file to your server
  const formData = new FormData();
  const blob = new Blob([csvContent], { type: 'text/csv' });
  formData.append('file', blob, 'export.csv');

  try {
    const response = await fetch('https://your-api.com', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('Success:', result);
  } catch (error) {
    console.error('Error saving to server:', error);
  }
}

// Backend (node.js/express example)
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Saves to an "uploads" folder
const app = express();

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File saved on server!', file: req.file });
});
*/


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
    // Get checkboxes
    const hit = document.querySelector('input[name="hit"]').checked;
    const strikeout = document.querySelector('input[name="strikeout"]').checked;
    const forceOutChoice = document.querySelector('input[name="force-out"]').checked;
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
