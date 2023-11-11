// script.js

var socket;
var username;

// Function to prompt the user for a username using an alert
function promptForUsername() {
    username = prompt("Enter your username:");
    if (username) {
        initSocket();
    } else {
        promptForUsername(); // Prompt again if the user cancels or enters an empty username
    }
}

// Function to initialize the socket connection
function initSocket() {
    socket = io();

    socket.emit('initConnection', { username: username });

    var form = document.getElementById('form');
    var input = document.getElementById('input');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', { username: username, message: input.value });
            input.value = '';
        }
    });

    socket.on('chat message', function (data) {
        var item = document.createElement('li');
        item.textContent = data.username + ': ' + data.message;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    // Enable the input and button after setting the username
    document.getElementById('input').removeAttribute('disabled');
    document.querySelector('#form > button').removeAttribute('disabled');
}

// Call the promptForUsername function when the page loads
promptForUsername();
