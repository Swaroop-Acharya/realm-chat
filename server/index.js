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

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("create-room", () => {
    const roomCode = randomBytes(3).toString("hex").toUpperCase();
    rooms.set(roomCode, {
      users: new Set(),
      messges: [],
      lastActive: Date.now(),
    });
    socket.emit("room-created", roomCode);
  });

  socket.on("join-room", (data) => {
    const parsedData = JSON.parse(data);
    const roomCode = parsedData.roomCode;
    const room = room.get(roomCode);
    if (!rooms) {
      socket.emit("error", "Room not found");
      return;
    }
    socket.join(roomCode);
    room.users.add(socket.id);
    room.lastActive = Date.now();
    socket.emit("joined-room", {
      roomCode,
      message: messages,
    });

    io.to(roomCode).emit("user-joined", room.users.size);
  });

  socket.on("send-message", ({ roomCode, messsage, userId, name }) => {
    const room = room.get(roomCode);
    if (!rooms) {
      socket.emit("error", "Room not found");
      return;
    }
    room.lastActive = Date.now();
    const messsageData = {
      id: randomBytes(4).toString("hex"),
      content: messsage,
      senderId: userId,
      sender: name,
      timeStamp: new Date(),
    };
    room.messages.put(messageData);
    io.to("new-message", messsageData);
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
