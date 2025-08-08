const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const { randomBytes } = require("crypto");
const { timeStamp } = require("node:console");
const hostName = "127.0.0.1";
const port = 8000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origins: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

/**
 * @typedef {Object} Message
 * @property {string} id
 * @property {string} content
 * @property {string} senderId
 * @property {string} sender
 * @property {Date} timestamp
 */

/**
 * @typedef {Object} RoomData
 * @property {Set<string>} users
 * @property {Message[]} messages
 * @property {number} lastActive
 */

/* client to server events
 *  create-room
 *  join-room
 *  send-message
 *  disconnect
 *
 * server to client events
 *  room-created
 *  error 
 *  room-joined
 *  user-joined
 *  new-message
 *  user-left
 */

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("create-room", () => {
    const roomCode = randomBytes(3).toString("hex").toUpperCase();
    rooms.set(roomCode, {
      users: new Set(),
      messages: [],
      lastActive: Date.now(),
    });
    socket.emit("room-created", roomCode);
  });

  socket.on("join-room", (data) => {
    const roomCode = data.roomCode;

    console.log(`user joined room: ${roomCode}`);
    const room = rooms.get(roomCode);

    console.log(`Room is: ${room}`)
    if (!room) {
      socket.emit("error", "Cannot join room, Room not found");
      return;
    }
    socket.join(roomCode);
    console.log("User socket id:",socket.id);
    room.users.add(socket.id);
    room.lastActive = Date.now();

    console.log(room)
    socket.emit("room-joined", {
      roomCode,
      messages: room.messages,
    });

    io.to(roomCode).emit("user-joined", room.users.size);
  });

  socket.on("send-message", ({ roomCode, message, name }) => {
    const room = rooms.get(roomCode);
    if (!rooms) {
      socket.emit("error", "Cannot send message, Room not found");
      return;
    }
    console.log({roomCode, message,name})

    console.log(Date.now())
    room.lastActive = Date.now();
    const messageData = {
      id: randomBytes(4).toString("hex"),
      content: message,
      // senderId: userId,
      sender: name,
      timeStamp: new Date(),
    };
    room.messages.push(messageData);
    console.log(rooms)
    io.to(roomCode).emit("new-message", messageData);
  });

  socket.on("disconnect", () => {
    rooms.forEach((room, roomCode) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        io.to(roomCode).emit("user-left", room.users.size);
      }

      if (room.users.size == 0) {
        console.log(`Deleting empty room: ${roomCode}`);
        rooms.delete(roomCode);
      }
    });
  });
});

setInterval(() => {
  const curTime = Date.now();
  rooms.forEach((room, roomCode) => {
    if (room.user.size == 0 || curTime - room.user.lastActive > 36000000) {
      console.log(`Deleting inactive room: ${roomCode}`);
      rooms.delete(roomCode);
    }
  });
}, 3600000);

app.get("/", (req, res) => {
  res.send("Ping pon");
});

server.listen(port, hostName, () => {
  console.log(`Server is up and running at http://${hostName}:${port}/`);
});
