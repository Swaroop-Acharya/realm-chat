import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function App() {
  socket.on("hello", (arg) => {
    console.log(arg);
  });
  return (
    <>
      <h1 className="red underline ">Hi Swaroop</h1>
    </>
  );
}

export default App;
