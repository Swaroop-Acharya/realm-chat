import { useEffect, useRef, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Loader2, Github } from "lucide-react";
import { encrypt, decrypt } from "./Encrypt";
import MessageBubble from "./components/MessageBubble";
import { ChatInput, ChatInputSubmit, ChatInputTextArea } from "@/components/ui/chat-input";

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

const LOCALHOST_SOCKET_URL = import.meta.env.VITE_LOCAL_SOCKET_URL;
const PROD_SOCKET_URL = "https://realm-chat-backend.onrender.com";
const socket = io(import.meta.env.DEV ? LOCALHOST_SOCKET_URL : PROD_SOCKET_URL);

/**
 * Realm-based chat React component that provides UI to create/join encrypted chat "realms" and exchange messages.
 *
 * Renders the full chat application: controls to create a new realm, join an existing realm, display participants,
 * show an encrypted message stream, and send messages. Messages are encrypted before sending and decrypted on receipt
 * using the realm code. The component:
 * - Manages local UI state (name, realm code, connection state, message list, input text, modal visibility).
 * - Establishes Socket.IO listeners for server events: "realm-created", "realm-joined", "user-joined", "new-message", and "error".
 * - Emits socket events to create/join realms and to send encrypted messages.
 * - Copies the current realm code to the clipboard.
 * - Automatically scrolls the message list to the latest message and performs cleanup of socket listeners on unmount.
 *
 * Side effects:
 * - Uses Socket.IO for network events and toast notifications for user feedback.
 * - Calls `encrypt` before emitting outgoing messages and `decrypt` for incoming messages.
 * - Writes to the system clipboard when copying the realm code.
 *
 * @returns {JSX.Element} The App component's rendered UI.
 */
function App() {
  const [realmCode, setRealmCode] = useState("");
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([]);
  const [textMessage, setTextMessage] = useState("");
  const [usersSize, setUsersSize] = useState(0);
  const [connected, setConnected] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [inputRealmCode, setInputRealmCode] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const currentMessgeRef = useRef(null);
  const realmCodeRef = useRef("");

  // Update ref whenever state changes
  useEffect(() => {
    realmCodeRef.current = realmCode;
  }, [realmCode]);

  useEffect(() => {
    socket.on("realm-created", (code) => {
      setIsCreated(false);
      setRealmCode(code);
      toast.success("Realm created");
    });

    socket.on("realm-joined", async ({ realmCode, messages }) => {
      setRealmCode(realmCode);
      const decryptedMessages = await Promise.all(
        messages.map(async (msg) => ({
          ...msg,
          content: await decrypt(msg.content.encrypted, msg.content.iv, realmCode),
        }))
      );
      setMessages(decryptedMessages);
      setConnected(true);
      toast.success("Realm joined");
    });

    socket.on("error", (err) => {
      setIsCreated(false);
      setIsJoined(false);
      toast.error(err);
    });

    socket.on("user-joined", (userSize) => setUsersSize(userSize));

    socket.on("new-message", async (message) => {
      message.content = await decrypt(
        message.content.encrypted,
        message.content.iv,
        realmCodeRef.current
      );
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("realm-created");
      socket.off("joined-realm");
      socket.off("error");
      socket.off("user-joined");
      socket.off("new-message");
    };
  }, []);

  useEffect(() => {
    currentMessgeRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateRealm = () => {
    setIsCreated(true);
    socket.emit("create-realm");
  };

  const handleJoinRealm = () => {
    if (!inputRealmCode) return toast.error("Enter realm code");
    if (!name) return toast.error("Please enter name");
    setIsJoined(true);
    socket.emit("join-realm", {
      realmCode: inputRealmCode.trim().toUpperCase(),
    });
  };

  const handleSendMessage = async () => {
    if (!textMessage.trim()) return;
    const {iv, encrypted} = await encrypt(textMessage.trim(), realmCode);
    socket.emit("send-message", {
      realmCode,
      message: {iv, encrypted},
      name,
    });
    setTextMessage("");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(realmCode);
      toast.success("Realm code copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy realm code" + err);
    }
  };
  return (
    <>
      <div className={`container mx-auto max-w-2xl p-2 sm:p-4 h-screen flex ${connected ? "flex-col overflow-hidden" : "flex-col"}`}>
        {!connected && (
          <nav className="w-full flex items-center justify-between py-2 sm:py-3">
            <div className="text-lg sm:text-xl font-bold">Realm Chat</div>
            <a
              href="https://github.com/Swaroop-Acharya/realm-chat"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span>Drop a star</span>
            </a>
          </nav>
        )}
        <div className={`${connected ? "flex-1 min-h-0 flex flex-col" : "flex-1 flex items-center justify-center"}`}>
        <Card className={`w-full ${connected ? "flex-1 flex flex-col min-h-0" : ""}`}>
          <CardHeader className="space-y-1 shrink-0">
            {!connected ? (
              <></>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex flex-col">
                  <span className="font-mono text-2xl sm:text-3xl font-extrabold">{realmCode}</span>
                  <span className="text-xs sm:text-sm text-muted-foreground">{usersSize} users</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => copyToClipboard(realmCode)}
                  className="h-6 w-6 sm:h-8 sm:w-8"
                >
                  <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className={`${connected ? "flex-1 flex flex-col min-h-0" : ""}`}>
            {!connected ? (
              <div className="space-y-3 sm:space-y-4">
                <Button
                  size="lg"
                  className="w-full text-base sm:text-lg py-4 sm:py-6"
                  onClick={handleCreateRealm}
                  disabled={isCreated}
                >
                  {isCreated ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Realm...
                    </>
                  ) : (
                    "Create New Realm"
                  )}
                </Button>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    name="name"
                    value={name}
                    placeholder="Name"
                    className="text-base sm:text-lg py-3 sm:py-5"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    type="text"
                    name="RealmCode"
                    value={inputRealmCode}
                    placeholder="Enter Realm Code"
                    className="text-base sm:text-lg py-3 sm:py-5"
                    onChange={(e) => setInputRealmCode(e.target.value)}
                  />
                  <Button
                    size="lg"
                    disabled={isJoined}
                    className="px-4 sm:px-8 py-3 sm:py-4"
                    onClick={handleJoinRealm}
                  >
                    {isJoined ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                        Joining Realm...
                      </>
                    ) : (
                      "Join Realm"
                    )}
                  </Button>
                </div>

                {realmCode && (
                  <div className="text-center p-4 sm:p-6 bg-muted rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                      Share this code with your friend
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="font-mono text-xl sm:text-2xl font-bold">
                        {realmCode}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => copyToClipboard(realmCode)}
                        className="h-6 w-6 sm:h-8 sm:w-8"
                      >
                        <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 chat-scrollbar">
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
                <div className="sticky bottom-0 mt-3 shrink-0">
                  <ChatInput
                    variant="default"
                    value={textMessage}
                    onChange={(e) => setTextMessage(e.target.value)}
                    onSubmit={handleSendMessage}
                  >
                    <ChatInputTextArea placeholder="Type a message..." rows={1} />
                    <ChatInputSubmit />
                  </ChatInput>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
        {!connected && (
          <footer className="mt-3 sm:mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <button onClick={() => setShowPrivacy(true)} className="hover:underline">
                Privacy Policy
              </button>
              <button onClick={() => setShowTerms(true)} className="hover:underline">
                Terms & Conditions
              </button>
            </div>
            <a
              href="https://github.com/Swaroop-Acharya/realm-chat"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 hover:text-foreground"
            >
              <Github className="h-4 w-4" />
              <span>Drop a star</span>
            </a>
          </footer>
        )}

        {(showPrivacy || showTerms) && !connected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-md rounded-lg bg-background border p-4 sm:p-6 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  {showPrivacy ? "Privacy Policy" : "Terms & Conditions"}
                </h2>
                <Button variant="ghost" size="icon" onClick={() => { setShowPrivacy(false); setShowTerms(false); }}>
                  ✕
                </Button>
              </div>
              <div className="text-sm text-muted-foreground space-y-2 max-h-[60vh] overflow-y-auto">
                <p>This is a demo modal. Add your {showPrivacy ? "privacy policy" : "terms"} content here.</p>
              </div>
              <div className="mt-4 flex justify-end">
                <Button onClick={() => { setShowPrivacy(false); setShowTerms(false); }}>Close</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default App;
