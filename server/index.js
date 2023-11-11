const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config();
const {dbConnection, createRoom, updateRoom} = require(path.join(__dirname, 'db.js'));
// #region socket io

const client = dbConnection();
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket) => {
    
    socket.on('user_connected', (data) => {
      console.log('a user connected: ' + data.username);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    
    
    // socket.on('requestCreateRoom', (a) => {
    //   onRoomCreateRequested();
    // });

    socket.on('requestJoinRoom', (roomId) => {
      console.log('joinRoom requested: ' + roomId);
      onRoomJoinRequested(roomId, socket);
    });

      socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg);
      });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// #endregion

function onRoomCreateRequested() {
  createRoom(client, function(roomId) {
    console.log("room created: " + roomId);
    socket.emit('roomCreated', roomId);
  });
}

function onRoomJoinRequested(roomId, socket) {
  updateRoom(client, String(roomId), true, function(updated) {
    if(updated) {
      console.log("room joined: " + roomId);
      socket.emit('roomJoined', roomId);
    }
  });
}