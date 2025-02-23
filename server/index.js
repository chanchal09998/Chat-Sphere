// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { Server } from "socket.io";
import router from "./Routes/Routes.js";
import {
  sendGroupMessage,
  sendMessage,
} from "./Controllers/SendMessageController.js";

// Load environment variables
dotenv.config();

// Initialize the app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use("/api", router);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Sample route to test server
app.get("/", (req, res) => {
  res.send("Welcome to the Chat App server!");
});

// Start the server on port 8080
const port = process.env.PORT || 8080;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// **Socket.IO Logic**
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a chat room (Room ID is provided from frontend)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room ${roomId}`);
  });

  // Send Message to a specific room
  socket.on("sendMessage", ({ roomId, sender, message }) => {
    if (!roomId || !sender || !message) {
      console.error("❌ Invalid message data");
      return;
    }

    const messageData = {
      roomId,
      sender,
      message,
      createdAt: new Date().toISOString(), // Add timestamp here
    };

    // Send message to everyone in the room EXCEPT the sender
    socket.broadcast.to(roomId).emit("receiveMessage", messageData);
    console.log(`📩 Message sent to room ${roomId}:`, message);
  });

  // Handle group messages
  socket.on("sendGroupMessage", ({ roomId, sender, message }) => {
    if (!roomId || !sender || !message) {
      console.error("❌ Invalid group message data");
      return;
    }

    const messageData = {
      roomId,
      sender,
      message,
      createdAt: new Date().toISOString(),
    };

    // Send message to everyone in the room EXCEPT the sender
    socket.broadcast.to(roomId).emit("receiveGroupMessage", messageData);
    console.log(`📩 Group Message sent to room ${roomId}:`, message);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
