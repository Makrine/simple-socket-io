var socket;
var username;
var roomId;

// #region listeners
document.addEventListener('onUsernameSet', function (e) {
    username = e.detail;
    initSocket();
});

document.addEventListener('onCreateRoomRequested', function (e) {
    console.log(username + " wants to create room ");
    socket.emit('requestCreateRoom', null);

    socket.on('roomCreated', function (room_id) {
        console.log("room joined: " + room_id);
        roomId = room_id;

        startChatting();
    });
});

document.addEventListener('onJoinRoomRequested', function (e) {
    console.log(username + " wants to join room " + e.detail);
    socket.emit('requestJoinRoom', e.detail);

    socket.on('roomJoined', function (room_id) {
        console.log("room joined: " + room_id);
        roomId = room_id;

        startChatting();
    });
});

// #endregion

function initSocket() {
    socket = io();

    socket.emit('user_connected', { username: username });
    
}

function startChatting() {
    var body = document.querySelector('body');
        body.innerHTML = `
        <div id="room-id-label">Room ID: </div>
    <ul id="messages"></ul>
    <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
    </form>`;

    var roomIdLabel = document.getElementById('room-id-label');
    roomIdLabel.innerHTML += roomId;
    var form = document.getElementById('form');
    var input = document.getElementById('input');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value) {
            socket.emit('chat_message', { roomId: roomId, username: username, message: input.value });
            input.value = '';
        }
    });

    socket.on('chat_message', function (data) {
        if(roomId != data.roomId) {
            return;
        }
        var item = document.createElement('li');
        item.textContent = data.username + ': ' + data.message;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
}