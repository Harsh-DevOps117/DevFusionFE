import { io, Socket } from "socket.io-client";

// Ensure this matches your backend PORT
const SOCKET_URL = "http://16.171.200.75";

export const socket: Socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true, // <--- CHANGED THIS TO TRUE
  transports: ["websocket", "polling"], // Added polling fallback just in case websocket gets blocked
});

// Add these helpful logs so you never have to guess if it's connected again
socket.on("connect", () => {
  console.log("🟢 [Socket] Connected to Backend successfully! ID:", socket.id);
});

socket.on("connect_error", (err) => {
  console.error("🔴 [Socket] Connection Error:", err.message);
});
