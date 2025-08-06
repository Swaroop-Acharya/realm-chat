
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const { randomBytes } = require("crypto");
const hostName = "127.0.0.1";
const port = 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:5173","http://localhost:5174"],
    mthods: ["GET", "POST"],
  },
});


const rooms = new Map();
io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
  console.log(rooms)
  socket.on("create-room", ()=>{
   const roomCode = randomBytes(3).toString('hex').toUpperCase();
   rooms.set(roomCode,[]);
   socket.join(roomCode);
   socket.emit("room-created",roomCode);
  });
 
  socket.on("join-room",(roomCode)=>{
    if(!rooms.has(roomCode)){
      socket.emit("error","Room not found");
      return;
    }
    socket.join(roomCode);
    socket.emit("joined-room", {roomCode, message:rooms.get(roomCode)});
  });

  socket.on("send-message",({ roomCode, name, text})=>{
    const message = {name, text, time: new Date()};
    console.log(rooms)
    rooms.get(roomCode).push(message);
    socket.to(roomCode).emit("new-message",message);
  });
  
  socket.on("disconnect", ()=>{
      console.log("Disconnect:",socket.id);
  });

});

app.get("/", (req, res) => {
  res.send("Ping pon");
});

server.listen(port, hostName, () => {
  console.log(`Server is up and running at http://${hostName}:${port}/`);
});
