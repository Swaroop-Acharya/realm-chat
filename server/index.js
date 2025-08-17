
const { createServer } = require("node:http");
const { Server } = require("socket.io");
const express = require("express");
const { randomBytes } = require("crypto");
const PORT = process.env.PORT || 8080;

const app = express();

// Add CORS middleware for Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://realmchat.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origins: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://realmchat.vercel.app",
      "https://realmchat.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
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
 * @typedef {Object} RealmData 
 * @property {Set<string>} users
 * @property {Message[]} messages
 * @property {number} lastActive
 */

/* client to server events
 *  create-realm
 *  join-realm
 *  send-message
 *  disconnect
 *
 * server to client events
 *  realm-created
 *  error
 *  realm-joined
 *  user-joined
 *  new-message
 *  user-left
 */


const realms= new Map();

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("create-realm", () => {
    const realmCode= randomBytes(3).toString("hex").toUpperCase();
    realms.set(realmCode, {
      users: new Set(),
      messages: [],
      lastActive: Date.now(),
    });
    socket.emit("realm-created", realmCode);
  });

  socket.on("join-realm", (data) => {
    const realmCode= data.realmCode;

    console.log(`user joined realm: ${realmCode}`);
    const realm = realms.get(realmCode);

    console.log(`Realm is: ${realm}`);
    if (!realm) {
      socket.emit("error", "Cannot join realm, Realm not found");
      return;
    }
    socket.join(realmCode);
    console.log("User socket id:", socket.id);
    realm.users.add(socket.id);
    realm.lastActive = Date.now();

    console.log(realm);
    socket.emit("realm-joined", {
      realmCode,
      messages: realm.messages,
    });

    io.to(realmCode).emit("user-joined", realm.users.size);
  });

  socket.on("send-message", ({ realmCode, message, name }) => {
    const realm = realms.get(realmCode);
    if (!realm) {
      socket.emit("error", "Cannot send message, Realm not found");
      return;
    }
    console.log({ realmCode, message, name });

    console.log(Date.now());
    realm.lastActive = Date.now();
    const messageData = {
      id: randomBytes(4).toString("hex"),
      content: message,
      sender: name,
      timeStamp: new Date(),
    };
    realm.messages.push(messageData);
    io.to(realmCode).emit("new-message", messageData);
  });

  socket.on("disconnect", () => {
    realms.forEach((realm, realmCode) => {
      if (realm.users.has(socket.id)) {
        realm.users.delete(socket.id);
        io.to(realmCode).emit("user-left", realm.users.size);
      }

      if (realm.users.size == 0) {
        console.log(`Deleting empty realm: ${realmCode}`);
        realms.delete(realmCode);
      }
    });
  });
});

setInterval(() => {
  const curTime = Date.now();
  realms.forEach((realm, realmCode) => {
    if (realm.users.size == 0 || curTime - realm.lastActive > 36000000) {
      console.log(`Deleting inactive realm: ${realmCode}`);
      realms.delete(realmCode);
    }
  });
}, 3600000);

app.get("/", (req, res) => {
  res.send("Ping pon");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
