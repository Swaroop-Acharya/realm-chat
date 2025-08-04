const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
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

  io.on("create-room", ()=>{
   const roomCode = randomBytes(3).toString('hex').toUpperCase();
   rooms.set(roomCode,[]);
   io.join(roomCode);
   io.emit("room-created",roomCode);
  });
 
  io.on("join-room",(roomCode)=>{
    if(!rooms.has(roomCode)){
        io.emit("error","Room not found");
      return;
    }
    io.join(roomCode);
    io.emit("joined-room", {roomCode, message:rooms.get(roomCode)});
  });

  io.on("send-message",({ roomCode, name, text})=>{
    const message = {name, text, time: new Date()};
    rooms.get(roomCode).push(message);
    io.to(roomCode).emit("new-message",message);
  });
  
  io.on("disconnect", ()=>{
      console.log("Disconnect:",socket.id);
  });

});

app.get("/", (req, res) => {
  res.send("Ping pon");
});

server.listen(port, hostName, () => {
  console.log(`Server is up and running at http://${hostName}:${port}/`);
});
