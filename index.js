const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files if needed (e.g., for production builds of React app)
app.use(express.static('public'));

io.on('connection', (socket) => {
    // Receive and Send username to clients
    socket.on("username", (name) => {
        socket.emit('message', `${name} Joined the server`);
    })

    // Receiving messages from client
    socket.on('chat message', (msg) => {
        console.log('Message received:', msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server is running on port 3001');
});
