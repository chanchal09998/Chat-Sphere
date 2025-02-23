import React from "react";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import "./DefaultChats.css";

const DefaultChats = ({ chat, openChatHandler }) => {
  const darkMode = useSelector((state) => state.theme);
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {}; // Assuming user ID is stored in cookies
  const loggedInUserId = user?._id; // Get logged-in user ID from cookies

  const chatName =
    chat?.group || chat?.type === "group"
      ? chat?.group?.name || chat.name
      : chat?.name || "Unknown";

  const receiverId =
    chat?.group || chat?.type === "group"
      ? { _id: chat._id, name: chat.name, type: "group" }
      : { _id: chat._id, name: chat.name, type: "user" };

  const latestMessageText = chat?.latestMessage?.message || "No messages yet";

  const messageTime = chat?.latestMessage?.createdAt
    ? new Date(chat.latestMessage.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div
      className={`default-chat ${darkMode ? "dark-mode" : "light-mode"}`}
      onClick={() => {
        openChatHandler(receiverId);
      }}
    >
      <div className="profile-pic">
        <FaUser />
      </div>
      <div className="name-and-message">
        <p className="chat-name">{chatName || chat.name || "Unknown"}</p>
        <p className="latest-message">{latestMessageText}</p>
      </div>
      <div className="time">{messageTime}</div>
    </div>
  );
};

export default DefaultChats;
