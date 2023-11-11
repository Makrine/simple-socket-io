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

    input.addEventListener('input', function(event) {
        // The input event is triggered whenever the value of the input changes
        console.log('Input value changed:', event.target.value);
        if (event.target.value == '') {
            socket.emit('not typing', { username: username });
        }
        socket.emit('typing', { username: username });
      });

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

    socket.on('typing', function (data) {
        var item = document.createElement('li', { id: 'typing' });
        item.textContent = data + ' is typing...';
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('not typing', function (data) {
        // find item with id typing and remove it
        var item = document.getElementById('typing');
        if (item) {
            item.remove();
        }
    });

    // Enable the input and button after setting the username
    document.getElementById('input').removeAttribute('disabled');
    document.querySelector('#form > button').removeAttribute('disabled');
}

// Call the promptForUsername function when the page loads
promptForUsername();
