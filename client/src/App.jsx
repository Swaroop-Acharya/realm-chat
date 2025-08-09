import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";

import { toast } from "sonner";

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

 const VITE_SOCKET_URL = import.meta.env.VITE_LOCAL_SOCKET_URL;
 const socket = io(VITE_SOCKET_URL,{ forceNew: true });

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [usersSize, setUsersSize] = useState(0);
  useEffect(() => {
    socket.on("room-created", (code) => {
      setRoomCode(code);
      toast.success("Realm created");
      console.log(code);
    });

    socket.on("room-joined", ({ roomCode, messages }) => {
      toast.success("Realm joined");
      setRoomCode(roomCode);
      setMessages(messages);
    });

    socket.on("error", (err) => {
      toast.error(err);
    });

    socket.on("user-joined", (userSize) => setUsersSize(userSize));

    socket.on("new-message", (message) => {
      console.log(message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("room-created");
      socket.off("joined-room");
      socket.off("error");
      socket.off("user-joined");
      socket.off("new-message");
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!roomCode) return alert("Enter room ID");
    socket.emit("join-room", { roomCode: roomCode.trim().toUpperCase() });
  };

  const handleSendMessage = () => {
    if (!textMessage.trim()) return;
    socket.emit("send-message", {
      roomCode,
      message: textMessage.trim(),
      name,
    });
    setTextMessage("");
  };
  return (
    <>
      <h1>Weclome to the happy the realmChat</h1>
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />

        <Button onClick={handleCreateRoom}>Create Realm</Button>

        <Input
          type="text"
          name="RoomCode"
          placeholder="Room Code"
          onChange={(e) => setRoomCode(e.target.value)}
        />
        <Button onClick={handleJoinRoom}>Join Realm</Button>
      </div>
      <div>
        <h4>Room code: {roomCode}</h4>
        <p>
          <strong>{usersSize}</strong>
        </p>
        <div>
          {messages.map((msg, i) => (
            <div key={i}>
              <h3>{msg.sender}</h3>
              <p>{msg.content}</p>
              <p>{msg.timeStamp}</p>
            </div>
          ))}
        </div>
        <div className="flex">
          <Input
            type="text"
            name="messageText"
            placeholder="Send message"
            onChange={(e) => setTextMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send Message</Button>
        </div>
      </div>
    </>
  );
}
export default App;
