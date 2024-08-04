import express from "express";
import { Server } from "socket.io";
import {createServer} from "http";
import { Socket } from "dgram";
import cors from "cors";
import { stringify } from "querystring";

const port = 3000;
const app = express();
const server = createServer(app);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"],
        credentials:true,
    },
});

app.use(cors({
    origin:"*",
    methods:["GET","POST"],
    credentials:true,
}));

app.get("/",(req,res)=>{
    res.send("Hello World!");
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

io.on("connection", (socket)=>{
    console.log("User connected ID:", socket.id);
    // socket.emit("Welcome", "Welcome to the server");
    // socket.broadcast.emit("Welcome", `${socket.id} connected the server`);

    socket.emit("activeSockets",io.engine.clientsCount);

    socket.on("message",({message,room})=>{
        console.log(socket.id,{message,room});
        if(room === "")
            socket.broadcast.emit("recieve-message",message);
        else
            socket.to(room).emit("recieve-message",message);
    });

    socket.on('check-room', (roomId, callback) => {
        const roomExists = io.sockets.adapter.rooms.has(roomId);
        callback(roomExists);
      });

    socket.on("join-room",(room)=>{
        socket.join(room);    
        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        const roomSockets = Array.from(io.sockets.adapter.rooms.get(room) || []);
        io.to(room).emit('activeSocketsInRoom', roomSockets);
        console.log(`User ${socket.id} joined room ${room}. Room size: ${roomSize}`);
    })

    socket.on('getSocketIndex', (roomName, callback) => {
        if (roomName) {
            const roomSockets = Array.from(io.sockets.adapter.rooms.get(roomName) || []);
            console.log(roomSockets);
            const index = roomSockets.indexOf(socket.id);
            console.log(roomName, index);
          callback(index);
        } else {
          callback(-1); // Room not found or socket not in the room
        }
    });

    socket.on('leave-room', (room) => {
        socket.leave(room);
        const roomSize = io.sockets.adapter.rooms.get(room)?.size || 0;
        const roomSockets = Array.from(io.sockets.adapter.rooms.get(room) || []);
        io.to(room).emit('activeSocketsInRoom', roomSockets);
        console.log(`User ${socket.id} left room ${room}. Room size: ${roomSize}`);
    });

    socket.on('distribute', (room, numbers) => {
        numbers = shuffleArray(numbers);
        const roomSockets = Array.from(io.sockets.adapter.rooms.get(room) || []);
        const numberOfUsers = roomSockets.length;

        io.to(room).emit('activeSocketsInRoom', roomSockets);
        
        roomSockets.forEach((socketId, index) => {
          const numbersForUser = [];
          for (let i = index; i < numbers.length; i += numberOfUsers) {
            numbersForUser.push(numbers[i]);
          }
          io.to(socketId).emit('numbers', numbersForUser);
        });
    
        console.log(`Distributed numbers to room ${room}`);
    });

    socket.on('updatePublicCards',(room,publicCards)=>{
        io.to(room).emit('capturePublicCards',publicCards);
    })

    socket.on('isPresent',(num)=>{
        socket.emit('setIsPresent',num);
    })

    socket.on("disconnect", ()=>{
        console.log("User Disconnected ID:", socket.id);
        io.emit('activeSockets', io.engine.clientsCount);
    })

    
})



server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)
});