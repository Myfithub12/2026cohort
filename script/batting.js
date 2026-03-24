async function exportToExcel() {
  // 1. Create the Header Row
  let csvContent = "Number,Player,Pos,1,2,3,4,5,6,7,8,9,Total\n";

  // Helper function to scrape a specific team table
  const scrapeTeam = (tbodyId, teamLabel) => {
    let teamData = "";
    const rows = document.querySelectorAll(`#${tbodyId} tr`);
    
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const rowValues = Array.from(cells).map(cell => {
        const input = cell.querySelector('input');
        return input ? input.value : cell.innerText;
      });
      // Add the team label (Home/Away) to the first column
      teamData += `${teamLabel},` + rowValues.join(',') + '\n';
    });
    return teamData;
  };

  // 2. Scrape Home Team then Away Team separately
  csvContent += scrapeTeam('lineup-body-ht', 'Home'); // HT data
  csvContent += "\n"; // Optional blank row for spacing in Excel
  csvContent += scrapeTeam('lineup-body-at', 'Away'); // AT data

  // 3. SAVE THE FILE (Using your existing logic)
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'baseball_lineup.csv',
        types: [{ description: 'CSV File', accept: { 'text/csv': ['.csv'] } }],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  } else {
    // Fallback: Automatic download for older browsers
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'baseball_lineup.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
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
