import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Signup.css"; // Import external CSS for styling
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      // Perform validation
      if (!name || !email || !password) {
        toast.error("Please fill in all fields.");
        return;
      }

      // Check password strength (minimum 6 characters)
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
      }

      setLoading(true); // Set loading state

      // Call the API to submit the form data
      const response = await axios.post("http://localhost:8080/api/signup", {
        name,
        email,
        password,
      });

      // Handle the success response
      if (response.status === 201) {
        toast.success("Registration successful!");
        // Redirect to login page
        navigate("/login");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Error during registration, please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={submitHandler} className="signup-form">
        <div className="form-group">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
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
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
