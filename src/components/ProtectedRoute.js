import React from 'react';
import { Navigate } from 'react-router-dom';
const userRole = localStorage.getItem("role").slice(0);

function ProtectedRoute({ children, role }) {


  if (userRole !== "ADMIN") {
    return <Navigate to="/dumps" />;
  }
  return children;
}

export default ProtectedRoute;