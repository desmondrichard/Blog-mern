import React, { useState, useContext, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";
import { authContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { user, authLoading } = useContext(authContext);

  useEffect(() => {
    if (!authLoading && user) {
      if (user.usertype === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/posts");
      }
    }
  }, [user, authLoading, navigate]);

  // Called after successful registration
  const handleRegisterSuccess = () => {
    setShowRegister(false);
  };

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="homeContainer">
      <div className="homeCard">
        {/* Toggle Buttons */}
        <div className="authToggle">
          <button
            className={`authToggleButton ${!showRegister ? "active" : ""}`}
            onClick={() => setShowRegister(false)}
          >
            Login
          </button>

          <button
            className={`authToggleButton ${showRegister ? "active" : ""}`}
            onClick={() => setShowRegister(true)}
          >
            Register
          </button>
        </div>

        {/* Display Form */}
        <div className="homeForm">
          {showRegister ? (
            <Register onRegisterSuccess={handleRegisterSuccess} />
          ) : (
            <Login />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
