function uploadFiles() {
    const formData = new FormData(document.getElementById('uploadForm'));
    fetch('https://example.com/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log('Success:', data))
    .catch(error => console.error('Error:', error));
  }