import { io } from "socket.io-client";

const baseUrl = (import.meta.env.VITE_API_URL || "").replace("/api", "");

const socket = io(baseUrl, {
  transports: ["websocket"],
});

export default socket;