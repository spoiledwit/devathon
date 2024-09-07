import { Server as SocketIOServer } from "socket.io";
let io = null;

export const userSockets = {};

export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    // User connection
    socket.on("user_connected", (data) => {
      const userId = data;
      userSockets[userId] = socket.id;
      console.log(`User ${userId} connected with socket ID ${socket.id}`);
      // User joins their own room to facilitate personal status updates
      socket.join(`user_${userId}`);
      // Notify others in the user's room that they are now online
      io.to(`user_${userId}`).emit("user_status", { userId, isOnline: true });
    });

    socket.on("subscribe_to_user", (data) => {
      // leave all previous rooms
      // socket.leaveAll();
      const userId = data;
      const socketId = userSockets[userId];
      socket.join(`user_${userId}`);
      // immediately send user status
      socket.emit("user_status", {
        userId,
        isOnline: !!socketId,
      });
    });

    // Handling disconnect event
    socket.on("disconnect", () => {
      let disconnectedUserId = null;
      for (const userId in userSockets) {
        if (userSockets[userId] === socket.id) {
          disconnectedUserId = userId;
          console.log(`User ${userId} disconnected`);
          delete userSockets[userId];
          break;
        }
      }
      // Notify others in the user's room that they are now offline
      if (disconnectedUserId) {
        io.to(`user_${disconnectedUserId}`).emit("user_status", {
          userId: disconnectedUserId,
          isOnline: false,
        });
        socket.leaveAll();
      }
    });

    socket.on("send_message", (data) => {
      const { sender, contentType, text, conversationId, to, image } = data;
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      let message;
      if (data.contentType === "text") {
        message = {
          conversationId,
          sender,
          _id: Math.random().toString(36).substr(2, 9),
          content: {
            contentType,
            text: text ? text : " ",
            image,
          },
          createdAt,
          updatedAt,
        };
        console.log("message", message);
        console.log(userSockets);
        console.log(userSockets[to]);
        if (userSockets[to]) {
          io.to(userSockets[to]).emit("receive_message", message);
        }
      }
    });

    socket.on("user_typing", (data) => {
      const { userId, conversationId, isTyping, to } = data;
      if (userSockets[to]) {
        io.to(userSockets[to]).emit("user_typing", {
          userId,
          conversationId,
          isTyping,
        });
      }
    });

    socket.on("printUsers", () => {
      console.log(userSockets);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};