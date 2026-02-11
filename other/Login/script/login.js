document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get username and password values
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    // Send login request to server
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Login failed');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Display success message (optional)
        window.location.href = 'main.html'; // Redirect to main page after successful login
    })
    .catch(error => {
        alert('Invalid username or password. Please try again.');
        console.error('Error:', error);
    });
});

document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get new username and password values
    var newUsername = document.getElementById('new-username').value;
    var newPassword = document.getElementById('new-password').value;

    // Send signup request to server
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newUsername, newPassword })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Signup failed');
        }
        return response.json();
    })
    .then(data => {
        alert(data.message); // Display success message (optional)
        window.location.href = 'main.html'; // Redirect to main page after successful signup
    })
    .catch(error => {
        alert('Signup failed. Please try again.');
        console.error('Error:', error);
    });
});

// Function to toggle visibility based on login status
function toggleLoginVisibility(isLoggedIn) {
    const loginContainer = document.getElementById('login-container');
    const selectionContainer = document.getElementById('selection-container');

    if (isLoggedIn) {
        loginContainer.classList.add('hidden');
        selectionContainer.classList.remove('hidden');
    } else {
        loginContainer.classList.remove('hidden');
        selectionContainer.classList.add('hidden');
    }
}

// Example: Check if user is logged in (replace with your actual logic)
const isLoggedIn = false; // Replace with your actual login check logic

// Initially hide the selection container
toggleLoginVisibility(isLoggedIn);

// Function to toggle form visibility based on selection
function toggleForm() {
    const selection = document.getElementById('selection').value;

    // Example: Show different forms based on selection (replace with your actual logic)
    if (selection === 'batting') {
        console.log('Display Batting form');
    } else if (selection === 'pitching') {
        console.log('Display Pitching form');
    }
}
