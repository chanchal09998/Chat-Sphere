import React, { useEffect, useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux";
import "./ChatArea.css";
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:8080");

const ChatArea = ({ selectedReceiver, setChatMessages, chatMessages }) => {
  console.log("selected receiver", selectedReceiver);

  // Retrieve user information from cookies
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const darkMode = useSelector((state) => state.theme);
  const [sendMessage, setSendMessage] = useState("");
  const [sender] = useState(user._id);
  const [receiver, setReceiver] = useState({});
  const [roomId, setRoomId] = useState("");
  const chatEndRef = useRef(null);

  // Effect to update the receiver and generate the correct room ID
  useEffect(() => {
    if (!selectedReceiver || !selectedReceiver._id) return;

    setReceiver(selectedReceiver);
    const generatedRoomId =
      selectedReceiver.type === "group"
        ? selectedReceiver._id
        : [sender, selectedReceiver._id].sort().join("_");

    console.log("✅ [Room ID] Generated Room ID:", generatedRoomId);
    setRoomId(generatedRoomId);

    // Leave the previous room before joining a new one
    if (roomId) {
      socket.emit("leaveRoom", roomId);
    }

    setTimeout(() => {
      socket.emit("joinRoom", generatedRoomId);
    }, 100);
  }, [selectedReceiver, sender]);

  // Effect to auto-scroll to the latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Function to send a private message
  const sendMessageFunc = async () => {
    console.log("📨 sendMessageFunc called");
    if (!receiver._id) {
      toast.error("Receiver not selected");
      return;
    }

    if (!roomId) {
      console.warn("⚠️ Room ID is not set, message not sent.");
      return;
    }

    const messageData = {
      sender: { _id: sender, name: user.name },
      receiver: { _id: receiver._id, name: receiver.name },
      message: sendMessage,
      createdAt: new Date().toISOString(),
      roomId,
    };

    console.log("📤 Emitting socket event: sendMessage", messageData);
    socket.emit("sendMessage", messageData);

    try {
      await axios.post("http://localhost:8080/api/send-message", {
        sender,
        receiver: receiver._id,
        message: sendMessage,
      });
      setChatMessages((prev) => [...prev, messageData]);
      setSendMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.log(error);
      toast.error("Error sending message");
    }
  };

  // Function to send a group message
  const sendGroupMessageFunc = async () => {
    console.log("📨 sendGroupMessageFunc called");
    if (!receiver._id) {
      toast.error("Group not selected");
      return;
    }

    const messageData = {
      sender: { _id: sender, name: user.name },
      receiver: { _id: receiver._id, name: receiver.name },
      message: sendMessage,
      createdAt: new Date().toISOString(),
      roomId,
    };

    console.log("📤 Emitting socket event: sendGroupMessage", messageData);
    socket.emit("sendGroupMessage", messageData);

    try {
      await axios.post("http://localhost:8080/api/send-group-message", {
        sender,
        group: receiver._id,
        message: sendMessage,
      });
      setChatMessages((prev) => [...prev, messageData]);
      setSendMessage("");
      toast.success("Message sent");
    } catch (error) {
      console.log(error);
      toast.error("Error sending group message");
    }
  };

  // Handler function to determine message type and send accordingly
  const sendMessageHandler = () => {
    console.log("sendMessageHandler executed");
    if (!sendMessage.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    if (receiver.type === "group") {
      sendGroupMessageFunc();
    } else {
      sendMessageFunc();
    }
  };

  // Effect to handle receiving messages via socket
  useEffect(() => {
    const handleReceiveMessage = (messageData) => {
      if (messageData.roomId === roomId) {
        setChatMessages((prev) => [...prev, messageData]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("receiveGroupMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("receiveGroupMessage", handleReceiveMessage);
    };
  }, [roomId]); // Runs again if roomId changes

  return (
    <div className={`chat-area-container ${darkMode ? "dark" : ""}`}>
      <div className="user-info">
        <FaUser className="profile-icon" />
        <p className="user-name">{receiver?.name || "Select a receiver"}</p>
      </div>
      <div className="chat-area">
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${
              msg.sender._id === sender ? "sent" : "received"
            }`}
          >
            <p className="sender-name">{msg.sender.name}</p>
            <p className="message-content">{msg.message}</p>
            <p className="message-time">
              {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="send-message-container">
        <input
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          type="text"
          className="message-input"
          placeholder="Type a message..."
        />
        <button className="send-button" onClick={sendMessageHandler}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
