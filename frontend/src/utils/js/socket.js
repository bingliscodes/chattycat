import { io } from "socket.io-client";

export const createConnection = (name, roomId = "chatroom-1") => {
  return new Promise((resolve, reject) => {
    const socket = io(import.meta.env.VITE_SERVER_URL);

    socket.on("connect", () => {
      console.log("🔌 [CLIENT] Connected with socket ID:", socket.id);

      // JOIN room AFTER connect
      socket.emit("join-room", roomId, (ack) => {
        console.log("✅", ack); // should log: "Joined room: chatroom-1"
      });

      // Optional: store user info if needed
      socket.userData = { name, roomId };

      resolve(socket); // Only resolve when ready
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
      reject(err);
    });

    // You can attach message listener here or in component
    socket.on("connect_error", (err) => {
      console.error("Socket connect_error:", err);
      reject(err);
    });

    socket.on("receive-message", (message) => {
      console.log("[CLIENT] Message received:", message);
    });
  });
};
