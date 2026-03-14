document.getElementById('dataForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const name = document.getElementById('name').value;
    const team = document.getElementById('team').value;
    const hits = parseFloat(document.getElementById('hits').value);
    const balls = parseFloat(document.getElementById('balls').value);
    const inningsPitched = parseFloat(document.getElementById('inningsPitched').value);

    // Calculate WHIP
    let sum = hits + balls;
    let WHIP = sum / inningsPitched;

    // Display the result
    document.getElementById('result').innerHTML = `Name: ${name} <br> Team: ${team} <br> WHIP: ${WHIP.toFixed(2)}`;

    // Create CSV string for new data
    const newCsvLine = `${name},${team},${WHIP.toFixed(2)}`;

    // Optional: Read existing CSV data
    let existingData = '';
    const reader = new FileReader();
    reader.onload = function() {
        existingData = reader.result + '\n' + newCsvLine;
        const updatedBlob = new Blob([existingData], { type: 'text/csv' });
        const url = URL.createObjectURL(updatedBlob);

        // Save the updated data to the same CSV file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whip_data.csv';
        a.click();
    };

    // Read the existing CSV file or create a new one
    if (document.getElementById('csvData').files.length > 0) {
        reader.readAsText(document.getElementById('csvData').files[0]);
    } else {
        // If no existing CSV file, create and save a new one with the new data
        const initialCsvContent = `Name,Team,WHIP\n${newCsvLine}`;
        const initialBlob = new Blob([initialCsvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(initialBlob);

        // Save the new data to a CSV file
        const a = document.createElement('a');
        a.href = url;
        a.download = 'whip_data.csv';
        a.click();
    }
});