import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

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
const socket = io("http://localhost:8000", { forceNew: true });
function App() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [error, setError] = useState("");
  const [usersSize, setUsersSize] = useState(0);
  useEffect(() => {
    socket.on("room-created", (code) => {
      setRoomCode(code);
      console.log(code);
    });

    socket.on("room-joined",({roomCode,messages})=>{
      setRoomCode(roomCode);
      setMessages(messages);
    });

    socket.on("error", err => {
      setError(err);
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
    socket.emit("join-room", { roomCode : roomCode.trim().toUpperCase() });
  };

  const handleSendMessage = () => {
    if (!textMessage.trim()) return;
    socket.emit("send-message", { roomCode, message: textMessage.trim(), name });
    setTextMessage("");
  };
  return (
    <>
      <h1>Weclome to the happy the realmChat</h1>
      <p>{error}</p>
        <div>
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
        </div>
        <div>
          <h4>Room code: {roomCode}</h4>
          <p><strong>{usersSize}</strong></p>
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
            <input
              type="text"
              name="messageText"
              placeholder="Send message" onChange={(e) => setTextMessage(e.target.value)}
            />

            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
              onClick={handleSendMessage}
            >
              Send Message
            </button>
          </div>
        </div>
    </>
  );
}
export default App;
