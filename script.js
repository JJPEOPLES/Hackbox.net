// HackBox main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('HackBox interface loaded');
    
    // Add event listeners to buttons if they exist
    const launchButton = document.querySelector('.launch-button');
    if (launchButton) {
        launchButton.addEventListener('click', function(e) {
            console.log('Launching HackBox environment');
        });
    }
    
    // Check if we're on the desktop page
    const novncContainer = document.getElementById('novnc-container');
    if (novncContainer) {
        // Check if we're running locally
        checkIfRunningLocally()
            .then(isLocal => {
                if (isLocal) {
                    // If running locally, load the noVNC iframe
                    loadNoVNCIframe();
                }
            })
            .catch(error => {
                console.error('Error checking if running locally:', error);
            });
    }
    
    // Check database status when page loads
    checkDatabaseStatus()
        .then(data => {
            console.log('Database status:', data);
        })
        .catch(error => {
            console.error('Database error:', error);
        });
        
    // Set up user data form if it exists
    const userForm = document.getElementById('user-form');
    if (userForm) {
        userForm.addEventListener('submit', handleUserFormSubmit);
        
        // Load existing users
        loadUsers();
    }
});

// Function to check database status
async function checkDatabaseStatus() {
    try {
        const response = await fetch('/.netlify/functions/db-status');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error checking database status:', error);
        throw error;
    }
}

// Function to save user data
async function saveUserData(userData) {
    try {
        const response = await fetch('/.netlify/functions/user-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving user data:', error);
        throw error;
    }
}

// Function to load users
async function loadUsers() {
    try {
        const response = await fetch('/.netlify/functions/user-data');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Display users if the element exists
        const usersList = document.getElementById('users-list');
        if (usersList && data.users) {
            usersList.innerHTML = '';
            
            data.users.forEach(user => {
                const userItem = document.createElement('div');
                userItem.className = 'user-item';
                userItem.innerHTML = `
                    <strong>${user.username}</strong>
                    <span>Last login: ${new Date(user.last_login).toLocaleString()}</span>
                `;
                usersList.appendChild(userItem);
            });
        }
        
        return data;
    } catch (error) {
        console.error('Error loading users:', error);
        throw error;
    }
}

// Handle user form submission
async function handleUserFormSubmit(event) {
    event.preventDefault();
    
    const usernameInput = document.getElementById('username');
    if (!usernameInput || !usernameInput.value.trim()) {
        alert('Please enter a username');
        return;
    }
    
    const userData = {
        username: usernameInput.value.trim(),
        settings: {
            theme: document.getElementById('theme')?.value || 'default',
            notifications: document.getElementById('notifications')?.checked || false
        }
    };
    
    try {
        const result = await saveUserData(userData);
        alert('User data saved successfully!');
        usernameInput.value = '';
        
        // Reload the users list
        await loadUsers();
    } catch (error) {
        alert('Error saving user data: ' + error.message);
    }
}

// Check if we're running locally (localhost or 127.0.0.1)
async function checkIfRunningLocally() {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
}

// Load the noVNC iframe
function loadNoVNCIframe() {
    const novncContainer = document.getElementById('novnc-container');
    if (novncContainer) {
        // Clear the container
        novncContainer.innerHTML = '';
        
        // Create the iframe
        const iframe = document.createElement('iframe');
        iframe.id = 'novnc-frame';
        iframe.src = '/vnc.html?autoconnect=true&resize=remote&password=hackbox';
        
        // Add the iframe to the container
        novncContainer.appendChild(iframe);
        
        // Show the fullscreen button
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.style.display = 'inline-block';
        }
        
        console.log('noVNC iframe loaded for local environment');
    }
}