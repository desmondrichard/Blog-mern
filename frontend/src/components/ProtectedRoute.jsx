import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, authLoading } = useContext(authContext);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />; //if there is a separate /login then put it here instead.
  }

  // admin only routes:
  if (allowedRoles && !allowedRoles.includes(user.usertype)) {
    return <Navigate to="/posts" />;
  }

  return children;
};

export default ProtectedRoute;
