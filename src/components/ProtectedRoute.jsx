import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const role = localStorage.getItem("role") || sessionStorage.getItem("role");

  // If user is not logged in at all, redirect strictly to Login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user is logged in but doesn't have the correct authorization level
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Gracefully fallback to their actual designated dashboard based on their real role
    if (role === "Admin") return <Navigate to="/admin" replace />;
    if (role === "Host") return <Navigate to="/host" replace />;
    return <Navigate to="/user/home" replace />; // Default fallback for Guests
  }

  // If fully authorized, render the requested secure component
  return children;
};

export default ProtectedRoute;
