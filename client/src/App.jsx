import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [msgText, setMsgText] = useState("");
  useEffect(() => {
    socket.on("room-created", (code) => {
      setRoomCode(code);
      console.log(code);
    });

    socket.on("joined-room", ({ code, messages }) => {
      setRoomCode(code);
      setMessages(messages);
    });

    socket.on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off();
    };
  }, []);

  const handleCreateRoom = () => {
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!roomCode) return alert("Enter room ID");
    socket.emit("join-room", { roomCode });
  };

  const handleSendMessage = () => {
    if (!messages.trim()) return;
    socket.emit("send-message", { roomCode, name, text: msgText.trim() });
    setMsgText("");
  };
  return (
    <>
      <h1>Weclome to realmChat</h1>
      <input
        type="text"
        name="name"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleCreateRoom}
      >
        Create Realm
      </button>

      <input
        type="text"
        name="RoomCode"
        placeholder="Room Code"
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        onClick={handleJoinRoom}
      >
        Join Realm
      </button>

      <h4>Room code: {roomCode}</h4>
    </>
  );
}
export default App;
