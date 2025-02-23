import React, { useState } from "react";
import "./Chatbox.css";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import { useSelector, useDispatch } from "react-redux";
import { FaBars, FaUsers, FaSun, FaMoon } from "react-icons/fa";
import { toggleTheme } from "../reduxStore/ActionCreator";
import { FaSignOutAlt } from "react-icons/fa";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/chat-sphere.png";
import axios from "axios";

const Chatbox = ({ setCreateGroup }) => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [sender, setSender] = useState(user?._id || null);
  const [chatMessages, setChatMessages] = useState([]);
  const darkMode = useSelector((state) => state.theme);
  const [toggleSidebar, setToggleSidebar] = useState(window.innerWidth > 768);
  const [selectedReceiver, setSelectedReceiver] = useState(null);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    navigate("/login");
  };

  const openChatHandler = async (receiver) => {
    setSelectedReceiver(receiver);

    if (!sender) {
      console.error("Sender ID is missing");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/fetch-chat-messages",
        {
          sender,
          receiver: receiver._id,
        }
      );
      console.log("Chat messages fetched:", data);
      setChatMessages(data);
    } catch (error) {
      console.error("Error fetching chat messages:", error);
    }
  };

  return (
    <div className={`chatbox-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="hamburger-container">
        <FaBars
          className="icon"
          title="Toggle Sidebar"
          onClick={() => setToggleSidebar(!toggleSidebar)}
        />
        <FaUsers
          className="icon"
          title="Create Group"
          onClick={() => setCreateGroup(true)}
        />
        {darkMode ? (
          <FaSun
            className="icon"
            title="Light Mode"
            onClick={handleToggleTheme}
          />
        ) : (
          <FaMoon
            className="icon"
            title="Dark Mode"
            onClick={handleToggleTheme}
          />
        )}
        <FaSignOutAlt className="icon logout" title="Logout" onClick={logout} />
      </div>

      <div
        className={
          toggleSidebar
            ? "left-sidebar-container open"
            : "left-sidebar-container close"
        }
      >
        <Sidebar openChatHandler={openChatHandler} />
      </div>
      {selectedReceiver ? (
        <div className="right-chat-area-container">
          <ChatArea
            selectedReceiver={selectedReceiver}
            setChatMessages={setChatMessages}
            chatMessages={chatMessages}
          />
        </div>
      ) : (
        <div className="right-chat-area-container logo-container">
          <img src={Logo} alt="Chat Sphere Logo" />
        </div>
      )}
    </div>
  );
};

export default Chatbox;
