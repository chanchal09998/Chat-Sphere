// routes/authRouter.js
import express from "express";
import { login, signup } from "../Controllers/AuthControllers.js";
import {
  searchIUsersForGroups,
  searchUsers,
} from "../Controllers/SearchUsersController.js";
import { createGroup } from "../Controllers/CreateGroupController.js";
import {
  sendGroupMessage,
  sendMessage,
} from "../Controllers/SendMessageController.js";
import { fetchChats } from "../Controllers/FetchChatsController.js";
import { fetchMessages } from "../Controllers/fetchMessagesController.js";

const router = express.Router();

// Signup route
router.post("/signup", signup);

// Login route
router.post("/login", login);

// search-users
router.post("/search-application-users", searchUsers);

// search-users-for-group
router.post("/search-application-users-for-group", searchIUsersForGroups);

// create-group
router.post("/create-group", createGroup);

// send-message
router.post("/send-message", sendMessage);

// send-message
router.post("/send-group-message", sendGroupMessage);

// fetch-chats
router.get("/fetch-default-chats", fetchChats);

// fetch chat and group messages
router.post("/fetch-chat-messages", fetchMessages);

export default router;
