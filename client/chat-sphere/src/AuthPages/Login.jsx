import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css"; // Import external CSS for styling

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Perform validation
      if (!email || !password) {
        toast.error("Please fill in both fields.");
        return;
      }

      setLoading(true); // Set loading state

      // Call the API to validate the login
      const response = await axios.post("http://localhost:8080/api/login", {
        email,
        password,
      });

      // Handle the success response

      const { token, message, user } = response.data;

      // Store the token and user details in cookies
      Cookies.set("authToken", token, { expires: 1 }); // Expires in 1 day
      Cookies.set("user", JSON.stringify(user), { expires: 1 });
      toast.success(message || "Login successful!");

      // Redirect to homepage or dashboard
      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Invalid credentials, please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={submitHandler} className="login-form">
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;
