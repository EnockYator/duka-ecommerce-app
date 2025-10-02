"use strict";

import { Navigate, useLocation } from "react-router-dom";

function CheckAuth({ isAuthenticated, user, children }) {
  const location = useLocation();
  const path = location.pathname;

  // --- CASE 1: Not authenticated (guest) ---
  if (!isAuthenticated) {
    // If trying to access admin routes → block
    if (path.startsWith("/admin")) {
      return <Navigate to="/unauth-page" />;
    }

    // If trying to access shop (customer-only) → go to login
    if (path.startsWith("/shop")) {
      return <Navigate to="/auth/login" />;
    }

    // Guest can access auth routes (/auth/login, /auth/register)
    // Guest can access public routes (/home, /about, etc.)
    return <>{children}</>;
  }

  // --- CASE 2: Authenticated as Admin ---
  if (user?.role === "admin") {
    // Admin should not be in auth pages or public pages → send to dashboard
    if (path.startsWith("/auth")) {
      return <Navigate to="/admin/dashboard" />;
    }

    // Admin should not use shop → redirect to dashboard
    if (path.startsWith("/shop")) {
      return <Navigate to="/admin/dashboard" />;
    }

    // Admin routes are fine
    return <>{children}</>;
  }

  // --- CASE 3: Authenticated as Customer (non-admin) ---
  if (user?.role !== "admin") {
    // Customers cannot access admin
    if (path.startsWith("/admin")) {
      return <Navigate to="/unauth-page" />;
    }

    // Customers shouldn’t be in auth after login
    if (path.startsWith("/auth")) {
      return <Navigate to="/shop/home" />;
    }

    // Customers can use shop
    return <>{children}</>;
  }

  // fallback
  return <>{children}</>;
}

export default CheckAuth;
