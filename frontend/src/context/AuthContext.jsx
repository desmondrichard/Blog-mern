import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

export const authContext = createContext();

const AuthContext = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const response = await api.get("/auth/me");

        setUser(response.data.user);
      } catch (error) {
        console.log(error.response?.data?.message);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  return (
    <authContext.Provider value={{ user, setUser, authLoading }}>
      {children}
    </authContext.Provider>
  );
};

export default AuthContext;
