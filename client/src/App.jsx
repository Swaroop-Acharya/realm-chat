import { useEffect, useRef, useState } from "react";
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
import { Copy, Loader2 } from "lucide-react";
import MessageBubble from "./components/MessageBubble";
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

const LOCALHOST_SOCKET_URL = import.meta.env.VITE_LOCAL_SOCKET_URL;
const PROD_SOCKET_URL = "https://realm-chat-backend.onrender.com";
const socket = io(import.meta.env.DEV ? LOCALHOST_SOCKET_URL : PROD_SOCKET_URL);

function App() {
  const [roomCode, setRoomCode] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [usersSize, setUsersSize] = useState(0);
  const [connected, setConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputRoomCode,setInputRoomCode] = useState("");
  const currentMessgeRef = useRef(null);

  useEffect(() => {
    socket.on("room-created", (code) => {
      setIsLoading(false);
      setRoomCode(code);
      toast.success("Realm created");
    });

    socket.on("room-joined", ({ roomCode, messages }) => {
      setRoomCode(roomCode);
      setMessages(messages);
      setConnected(true);
      toast.success("Realm joined");
    });

    socket.on("error", (err) => {
      setIsLoading(false);
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

  useEffect(() => {
    currentMessgeRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateRoom = () => {
    setIsLoading(true);
    socket.emit("create-room");
  };

  const handleJoinRoom = () => {
    if (!inputRoomCode) return toast.error("Enter room ID");
    if(!name) return toast.error("Please enter name");
    setIsLoading(true);
    socket.emit("join-room", { roomCode: inputRoomCode.trim().toUpperCase() });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!textMessage.trim()) return;
    console.log(roomCode, textMessage, name);
    socket.emit("send-message", {
      roomCode,
      message: textMessage.trim(),
      name,
    });
    setTextMessage("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      toast.success("Realm code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy realm code" + err);
    }
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
            {!connected ? (
              <div className="space-y-4">
                <Button
                  size="lg"
                  className="w-full text-lg py-6"
                  onClick={handleCreateRoom}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Realm...
                    </>
                  ) : (
                    "Create New Realm"
                  )}
                </Button>
                <div className="flex  gap-2">
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Name"
                    className="text-lg py-5"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="RoomCode"
                    value={inputRoomCode}
                    placeholder="Room Code"
                    className="text-lg py-5"
                    onChange={(e) => setInputRoomCode(e.target.value)}
                  />
                  <Button size="lg" className="px-8" onClick={handleJoinRoom}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Joining Realm...
                      </>
                    ) : (
                      "Join Realm"
                    )}
                  </Button>
                </div>

                {roomCode && (
                  <div className="text-center p-6 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Share this code with your friend
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-2xl font-bold">
                        {roomCode}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(roomCode)}
                        className="h-8 w-8"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-7">
                <div className="flex items-center justify-between text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span>
                      Room Code:{" "}
                      <span className="font-mono font-bold">{roomCode}</span>
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(roomCode)}
                      className="h-6 w-6"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <span>Users: {usersSize}</span>
                </div>
                <div className="h-[430px] overflow-y-auto border rounded-lg p-4 space-y-2 chat-scrollbar">
                  {messages.map((msg, i) => (
                    <MessageBubble
                      key={i}
                      sender={msg.sender}
                      content={msg.content}
                      timeStamp={msg.timeStamp}
                      isOwn={msg.sender === name}
                    />
                  ))}
                  <div ref={currentMessgeRef}></div>
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <Input
                    type="text"
                    value={textMessage}
                    name="messageText"
                    className="text-lg py-5"
                    placeholder="Send message"
                    onChange={(e) => setTextMessage(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="px-8">
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
export default App;
