import { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
const socket = io(VITE_SOCKET_URL);

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
      <div className="container mx-auto max-w-2xl p-4 h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl flex items-center gap-2 font-bold">
              Realm Chat
            </CardTitle>
            <CardDescription>Chat with friends</CardDescription>
          </CardHeader>
          <CardContent> 
            <Button className="w-full text-lg py-6" onClick={handleCreateRoom}>
              Create Realm
            </Button>
            <div className="flex gap-10">
              <Input
                type="text"
                name="name"
                placeholder="Name"
                className="text-lg py-5"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                name="RoomCode"
                placeholder="Room Code"
                className="text-lg py-5"
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
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export default App;
