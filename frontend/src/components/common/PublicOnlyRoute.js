import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spinner } from "../ui";

// Redirect already-authenticated users away from /login & /register.
export default function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <Spinner center size="lg" />;
  if (isAuthenticated) return <Navigate to="/app/dashboard" replace />;
  return children;
}
