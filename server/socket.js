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
      console.log(`User ${data} connected`);
      const userId = data;
      userSockets[userId] = socket.id;
      socket.join(`user_${userId}`);
      io.to(`user_${userId}`).emit("user_status", { userId, isOnline: true });
    });

    socket.on("subscribe_to_user", (data) => {
      
      const userId = data;
      if (! typeof userId === "string") {
        return;
      }
      const socketId = userSockets[userId];
      socket.join(`user_${userId}`);
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
      console.log(data);
      let createdAt = new Date().toISOString();
      let updatedAt = new Date().toISOString();
      let message;
      if (data.contentType === "text" || data.contentType === "image") {
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