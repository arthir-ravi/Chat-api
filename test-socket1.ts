import { io, Socket } from "socket.io-client";

interface ChatMessage {
  senderId: string;
  receiverId: string;
  content: string;
}

const SOCKET_URL = "http://localhost:5000";

const USER_ID = "69047b6867ab275d08dbb554";
const RECEIVER_ID = "69047a0e52252bc07ffa82fd";

const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected with ID:", socket.id);

  socket.emit("join", USER_ID);
  console.log(`Joined as user: ${USER_ID}`);

  setTimeout(() => {
    const message: ChatMessage = {
      senderId: USER_ID,
      receiverId: RECEIVER_ID,
      content: "Welcomeee!",
    };
    socket.emit("send_message", message);
    console.log("Message sent:", message);
  }, 3000);
});

socket.on("receive_message", (msg: ChatMessage) => {
  console.log("Received:", msg);
});

socket.on("message_sent", (msg: ChatMessage) => {
  console.log("Message sent confirmation:", msg);
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
