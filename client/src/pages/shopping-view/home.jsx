"use strict";

import { Button } from "@/components/ui/button";
import { logoutUser } from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function ShoppingHome() {
  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  // handle logout
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // call the thunk properly
      navigate("/auth/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      <div>Shopping view home</div>
      <Button onClick={handleLogout}>Logout</Button>
    </div>
  );
}

export default ShoppingHome;
