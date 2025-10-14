"use strict";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { logoutUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function ShoppingHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-8">
        <Skeleton className="h-8 w-40 rounded-md" /> {/* Logo */}
        <Button
          onClick={handleLogout}
          className="text-sm bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Logout
        </Button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Categories */}
      <div className="flex gap-4 mb-8 overflow-x-auto">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-10 w-24 flex-shrink-0 rounded-full"
          />
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100"
          >
            <Skeleton className="h-40 w-full rounded-xl mb-4" /> {/* Image */}
            <Skeleton className="h-4 w-3/4 mb-2" /> {/* Title */}
            <Skeleton className="h-4 w-1/2 mb-4" /> {/* Price */}
            <Skeleton className="h-9 w-full rounded-md" /> {/* Button */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ShoppingHome;
