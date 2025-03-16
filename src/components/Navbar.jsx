import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate("/"); // 
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Complaint Management</h1>
      
      <div className="flex gap-4">
        {user?.userType === "user" && (
          <>
            <Link to="/users/complaintStatus" className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600">
              Complaint Status
            </Link>
            <Link to="/users/registerComplaint" className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600">
              Register Complaint
            </Link>
          </>
        )}
        {user && (
          <button
            onClick={handleLogout}
            className="bg-red-500 px-4 py-2 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
