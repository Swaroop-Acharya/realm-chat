import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    socket.on("room-created", (code) => {
      setRoomCode(code);
      console.log(code);
    });
  }, []);

  const createRoom = () => {
    socket.emit("create-room");
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

      <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={createRoom}>
        Create Realm
      </button>
      <h4>Room code: {roomCode}</h4>
    </>
  );
}
export default App;
