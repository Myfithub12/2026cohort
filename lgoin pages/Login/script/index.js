const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// In-memory data storage
let collectedData = [];

// Endpoint for submitting data
app.post('/submit', (req, res) => {
    const newData = req.body;
    collectedData.push(newData);
    console.log('Data collected:', newData);
    res.status(200).send('Data collected successfully');
});

// Endpoint for retrieving all collected data
app.get('/data', (req, res) => {
    res.json(collectedData);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

document.getElementById('dataForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const dataInput = document.getElementById('dataInput').value;

    const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: dataInput })
    });

    if (response.ok) {
        alert('Data submitted successfully');
        document.getElementById('dataInput').value = '';
    } else {
        alert('Failed to submit data');
    }
});

document.getElementById('getDataBtn').addEventListener('click', async function() {
    const response = await fetch('http://localhost:3000/data');
    const data = await response.json();

    let dataOutput = '';
    data.forEach(item => {
        dataOutput += `<p>${item.data}</p>`;
    });

    document.getElementById('collectedData').innerHTML = dataOutput;
});
function toggleForm() {
    var selection = document.getElementById("selection").value;

    if (selection === "batting") {
        document.getElementById("battingForm").classList.remove("hidden");
        document.getElementById("pitchingForm").classList.add("hidden");
    } else if (selection === "pitching") {
        document.getElementById("pitchingForm").classList.remove("hidden");
        document.getElementById("battingForm").classList.add("hidden");
    } else {
        document.getElementById("battingForm").classList.add("hidden");
        document.getElementById("pitchingForm").classList.add("hidden");
    }
}

function toggleForm() {
    var selection = document.getElementById("selection").value;
    if (selection === "batting") {
        window.location.href = "/html/batting.html";
    } else if (selection === "pitching") {
        window.location.href = "/html/pitching.html";
    }
}
