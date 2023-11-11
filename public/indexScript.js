function setUsername() {
    var username = document.getElementById("username").value;

    // check if username is null or empty
    if (username == null || username == "") {
        alert("Please enter a username");
        return;
    }
    
    // remove disabled attribute from the create room and join room buttons
   // document.querySelector('#create-room').removeAttribute('disabled');
    document.querySelector('#join-room').removeAttribute('disabled');

    // trigger an event
    var event = new CustomEvent('onUsernameSet', { detail: username });
    document.dispatchEvent(event);
}

function requestCreateRoom() {
    // trigger an event for creating a room
    var event = new CustomEvent('onCreateRoomRequested', { detail: null });
    document.dispatchEvent(event);
}

function requestJoinRoom() {
    // trigger an event for joining a room
    var roomId = document.getElementById("roomID").value;
    if (roomId == null || roomId == "") {
        alert("Please enter a room id");
        return;
    }
    var event = new CustomEvent('onJoinRoomRequested', { detail: roomId });
    document.dispatchEvent(event);
}