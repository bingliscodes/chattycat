import { io } from "socket.io-client";

export const createConnection = (name, roomId = null) => {
  // create the socket connection with socket server
  return new Promise((resolve) => {
    const socket = io(import.meta.env.VITE_SERVER_URL);
    socket.on("connect", () => {
      socket.emit("join", {
        roomId: roomId || socket.id,
        name,
        userId: socket.id,
      });
      console.log(`You connected with id: ${socket.id}`);
    });
    resolve(socket);
  });
};
