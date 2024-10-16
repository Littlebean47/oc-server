const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors')

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3001

// Serve static files if needed (e.g., for production builds of React app)
app.use(express.static('public'));
app.use(cors());

// Define Online Users
let onlineUsers = []
io.on('connection', (socket) => {
    const username = socket.handshake.query.username;
    onlineUsers.push(username)

    // Show online users
    io.emit("online users", onlineUsers)

    socket.emit("welcome", `Welcome, ${username}`)

    socket.broadcast.emit("user joined", {
        message: `${username} has joined the chat`,
        key: Math.random(),
    });

    // Receiving messages from client
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        onlineUsers = onlineUsers.filter((user) => user !== username)
        io.emit("online users", onlineUsers)
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
