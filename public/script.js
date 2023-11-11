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

      var typingTimer;
    var doneTypingInterval = 500; // 1000 milliseconds (1 second)

    input.addEventListener('input', function() {
      // Clear the previous typing timer
      clearTimeout(typingTimer);

      // Set a new timer to check for inactivity
      typingTimer = setTimeout(function() {
        console.log('No typing activity for 1 second.');
        socket.emit('not typing', { username: username });
        // Add your code to handle inactivity here
      }, doneTypingInterval);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat message', { username: username, message: input.value });
            input.value = '';
        }
    });

    socket.on('chat message', function (data) {
        removeTyping();
        var item = document.createElement('li');
        item.textContent = data.username + ': ' + data.message;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    socket.on('typing', function (data) {
        addTyping(data);
    });

    socket.on('not typing', function (data) {
        removeTyping();
    });

    // Enable the input and button after setting the username
    document.getElementById('input').removeAttribute('disabled');
    document.querySelector('#form > button').removeAttribute('disabled');
}

function removeTyping() {
    // find item with id typing and remove it
    var item = document.getElementById('typing');
    if (item) {
        item.remove();
    }
}

function addTyping(user) { 
    if(user == username) return;
    var item = document.getElementById('typing');
        if (item) {
        }
        else 
        {
            var item = document.createElement('li');
            item.setAttribute('id', 'typing');
            item.textContent = user + ' is typing...';
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }
}

// Call the promptForUsername function when the page loads
promptForUsername();
