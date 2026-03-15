function exportToExcel() {
    let csv = 'Team,Number,Player,Pos,1,2,3,4,5,6,7,8,9,Totals\n';
}


async function exportToExcel() {
  const csvContent = "Name,Age\nJohn Doe,30\nJane Smith,25"; // Your CSV data
  const blob = new Blob([csvContent], { type: 'text/csv' });

  if ('showSaveFilePicker' in window) {
    try {
      // 1. Show the "Save As" dialog
      const handle = await window.showSaveFilePicker({
        suggestedName: 'export.csv',
        types: [{
          description: 'CSV File',
          accept: { 'text/csv': ['.csv'] },
        }],
      });
      // 2. Write the data to the chosen location
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
    } catch (err) {
      if (err.name !== 'AbortError') console.error(err);
    }
  } else {
    // Fallback: Automatic download to "Downloads" folder
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
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

