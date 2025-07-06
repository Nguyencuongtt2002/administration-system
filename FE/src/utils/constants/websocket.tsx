import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initSocket = (token: string) => {
  socket = io("http://localhost:8080", {
    auth: {
      Authorization: `Bearer ${token}`,
    },
  });

  return socket;
};

export const getSocket = () => socket;
