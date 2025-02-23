import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Chatbox from "./Chatbox";
import CreateGroupComponent from "./CreateGroupComponent";
import "./Home.css";

const Home = () => {
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : {};
  const [createGroup, setCreateGroup] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    // Check token and user details in cookies
    const token = Cookies.get("authToken");
    const user = Cookies.get("user");

    if (!token || !user) {
      console.error("Token not found or expired. Redirecting to login page...");
      navigate("/login");
    } else {
      console.log("Token:", token);
      console.log("User Information:", JSON.parse(user)); // Parse the user details
    }
  }, [navigate]);

  return (
    <div>
      <Chatbox setCreateGroup={setCreateGroup} />
      {createGroup ? (
        <div className="center-div-for-group">
          <CreateGroupComponent
            setCreateGroup={setCreateGroup}
            currentUser={user}
          />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Home;
