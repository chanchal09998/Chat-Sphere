import React, { useEffect, useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux"; // Import useSelector for Redux
import "./CreateGroupComponent.css";
import axios from "axios";
import toast from "react-hot-toast";

const CreateGroupComponent = ({ setCreateGroup, currentUser }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);

  // Automatically add current user as a member when the component mounts
  useEffect(() => {
    if (currentUser && members.length === 0) {
      setMembers([currentUser]);
    }
  }, [currentUser]);

  // Search users function
  const searchUsersFunc = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/search-application-users-for-group",
        { searchQuery: searchInput, userId: currentUser._id }
      );

      setSearchedUsers(data);
      console.log("searchedUsers from group");
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

  // Access darkMode state from Redux store
  const darkMode = useSelector((state) => state.theme);

  // Add a member to the group
  const addMember = (user) => {
    // Debugging: Check the current state of members and the user being added
    console.log("Current members:", members);
    console.log("User to be added:", user);

    // Check if the user is already in the members array
    const memberExists = members.some((member) => member._id === user._id);

    if (!memberExists) {
      setMembers((prevMembers) => [...prevMembers, user]);
      toast.success(`${user.name} added to the group.`);
    } else {
      toast.error(`${user.name} is already added to the group.`);
    }
  };

  // Remove a member from the group
  const removeMember = (userId) => {
    if (userId === currentUser._id) {
      toast.error("You cannot remove yourself from the group.");
      return;
    }

    setMembers(members.filter((member) => member._id !== userId));
  };

  // Create the group
  const createGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name.");
      return;
    }

    if (members.length === 0) {
      toast.error("Please add at least one member to the group.");
      return;
    }

    const groupData = {
      name: groupName,
      members,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:8080/api/create-group",
        groupData
      );

      if (data.success) {
        toast.success(`Group created with name "${groupName}"`);
      } else {
        toast.error(data.message || "Error creating the group.");
      }
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("An error occurred while creating the group.");
    }

    // Close group creation modal or reset state
    setCreateGroup(false);
  };
  return (
    <div
      className={darkMode ? "create-group-popup dark" : "create-group-popup"}
    >
      {/* Close Icon */}
      <FaTimes className="close-icon" onClick={() => setCreateGroup(false)} />

      {/* Group Name Input */}
      <div className="group-name">
        <input
          type="text"
          placeholder="Enter group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
      </div>

      {/* Display Members */}
      <div
        className={
          members.length > 0 ? "display-members true" : "display-members"
        }
      >
        {members.map((member) => (
          <div className="member-item" key={member._id}>
            <img
              src={member.profilePic}
              alt={member.name}
              className="profile-pic"
            />
            <span className="member-name">{member.name}</span>
            <FaTimes
              className="remove-member-icon"
              onClick={() => removeMember(member._id)}
            />
          </div>
        ))}
      </div>

      {/* Search Users */}
      <div className="search-users">
        <input
          type="text"
          className="search-name"
          placeholder="Search users..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div className="search-results">
        {searchInput.trim() && searchedUsers.length === 0 && (
          <div className="no-results">No users found.</div>
        )}
        {searchedUsers.map((user) => (
          <div className="search-item" key={user._id}>
            <img
              src={user.profilePic}
              alt={user.name}
              className="profile-pic"
            />
            <span className="user-name">{user.name}</span>
            <FaPlus className="add-icon" onClick={() => addMember(user)} />
          </div>
        ))}
      </div>

      {/* Create Group Button */}
      <div className="create-group-btn">
        <button onClick={createGroup}>Create Group</button>
      </div>
    </div>
  );
};

export default CreateGroupComponent;
