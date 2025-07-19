import React from "react";
import { Navigate } from "react-router-dom";

// Check if token exists in localStorage
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return !!token; // returns true if token exists, false otherwise
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
