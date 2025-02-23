import React, { useEffect, useState } from "react";
import DefaultChats from "./DefaultChats";
import "./Sidebar.css";
import { FaTimes, FaComments } from "react-icons/fa";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import SearchedUsers from "./SearchedUsers";
import axios from "axios";
import { toast } from "react-hot-toast";
import ChatArea from "./ChatArea";

const Sidebar = ({ openChatHandler }) => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const [sender, setSender] = useState(user._id);
  const darkMode = useSelector((state) => state.theme);
  const [searchInput, setSearchInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [defaultChats, setDefaultChats] = useState([]);
  const currentUser = Cookies.get("user")
    ? JSON.parse(Cookies.get("user"))
    : { name: "Guest" };

  // Search users function
  const searchUsersFunc = async () => {
    try {
      const { data } = await axios.post(
        "https://chat-sphere-6khc.onrender.com/api/search-application-users",
        { searchQuery: searchInput, userId: currentUser._id }
      );

      setSearchedUsers(data);
      console.log(data);
    } catch (error) {
      console.error("Error searching users and groups:", error);
      toast.error("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    if (searchInput.trim() !== "") {
      searchUsersFunc();
    } else {
      setSearchedUsers([]);
    }
  }, [searchInput]);

  // Fetch default chats
  const fetchDefaultChats = async () => {
    if (!sender) return;

    try {
      const { data } = await axios.get(
        `https://chat-sphere-6khc.onrender.com/api/fetch-default-chats?sender=${sender}`
      );
      setDefaultChats(data);
      console.log(data);
    } catch (error) {
      console.log("Error fetching messages:", error.response || error.message);
      toast.error("Error fetching default chats");
    }
  };

  // Call fetchDefaultChats only when sender is set
  useEffect(() => {
    if (sender) {
      fetchDefaultChats();
    }
  }, [sender, searchInput]);

  return (
    <div className={`sidebar ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Logo */}
      <div className="logo">
        <FaComments />
        <span className="current-user-name">{currentUser.name}</span>
      </div>

      {/* Search Users */}
      <div className="search-users">
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          className="search-name"
          placeholder="Search users..."
        />
        <FaTimes className="cancel-icon" onClick={() => setSearchInput("")} />
      </div>

      {/* Display Chats */}
      <div className="display-chats">
        {searchedUsers.length > 0
          ? searchedUsers.map((user, index) => (
              <SearchedUsers
                key={index}
                user={user}
                openChatHandler={openChatHandler}
              />
            ))
          : defaultChats.map((chat, index) => (
              <DefaultChats
                key={index}
                chat={chat}
                openChatHandler={openChatHandler}
              />
            ))}
      </div>
    </div>
  );
};

export default Sidebar;
