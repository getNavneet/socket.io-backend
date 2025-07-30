import express from 'express';
import http from 'http'; 
import { Server } from 'socket.io'; 
import cors from 'cors'; 

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", 
    methods: ["GET", "POST"],      
  },
});

io.on('connection', (socket) => {
  console.log(`✅ User Connected: ${socket.id}`);

  // Handle event when a user joins a specific room
  socket.on('join_room', (room) => {
    socket.join(room); // Adds the socket to a room
    console.log(`User with ID: ${socket.id} joined room: ${room}`);
  });

  // Handle event when a user sends a message
  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
  });
});

app.get('/', (req, res) => {
  res.send('✅ Chat server is running');
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
