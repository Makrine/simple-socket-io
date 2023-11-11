const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const {dbConnection, addUser} = require(path.join(__dirname, 'db.js'));
// #region socket io

const client = dbConnection();
// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', (socket) => {
    
    socket.on('initConnection', (data) => {
      console.log('a user connected: ' + data.username);
      addUser(client, data.username);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });

      socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
      });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// #endregion