import React from "react";
import { FaUser } from "react-icons/fa";
import { useSelector } from "react-redux"; // Import to access Redux store
import "./SearchedUsers.css";

const SearchedUsers = ({ user, openChatHandler }) => {
  const darkMode = useSelector((state) => state.theme); // Access dark mode state from Redux store

  return (
    <div
      className={`default-chat ${darkMode ? "dark-mode" : "light-mode"}`}
      onClick={() => openChatHandler(user)}
    >
      <div className="profile-pic">
        <FaUser />
      </div>
      <div className="name-and-message">
        <p>{user.name}</p>
      </div>
    </div>
  );
};

export default SearchedUsers;
