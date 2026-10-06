import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuth } from "../../services/auth";

export default function ProtectedRoute({ role }) {
  const location = useLocation();
  const auth = getAuth();

  if (!auth) {
    return (
      <Navigate
        to={role === "admin" ? "/admin/login" : "/staff/login"}
        replace
        state={{ from: location }}
      />
    );
  }

  if (auth.role !== role) {
    return <Navigate to={`/${auth.role}/dashboard`} replace />;
  }

  return <Outlet />;
}