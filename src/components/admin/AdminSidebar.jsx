import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export const AdminSidebar = () => {

  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">

      {/* SIDEBAR */}
      <div
        className={`bg-gray-900 text-white transition-all duration-300 
        ${isOpen ? "w-64 p-5" : "w-16 p-3"} flex flex-col`}
      >

        {/* TOGGLE BUTTON */}
        <button
          className="mb-6 text-white text-xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

        {/* MENU */}
        <ul className="space-y-4 font-medium flex-1">

          <li>
            <Link to="/admin/dashboard" className="flex items-center gap-3 hover:text-blue-400">
              <span>📊</span>
              {isOpen && <span>Dashboard</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/users" className="flex items-center gap-3 hover:text-blue-400">
              <span>👤</span>
              {isOpen && <span>Users</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/properties" className="flex items-center gap-3 hover:text-blue-400">
              <span>🏠</span>
              {isOpen && <span>Properties</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/bookings" className="flex items-center gap-3 hover:text-blue-400">
              <span>📅</span>
              {isOpen && <span>Bookings</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/reviews" className="flex items-center gap-3 hover:text-blue-400">
              <span>⭐</span>
              {isOpen && <span>Reviews</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/payments" className="flex items-center gap-3 hover:text-blue-400">
              <span>💳</span>
              {isOpen && <span>Payments</span>}
            </Link>
          </li>

          <li>
            <Link to="/admin/settings" className="flex items-center gap-3 hover:text-blue-400">
              <span>⚙️</span>
              {isOpen && <span>Settings</span>}
            </Link>
          </li>

        </ul>

        {/* LOGOUT */}
        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 bg-red-500 px-3 py-2 rounded hover:bg-red-600"
        >
          <span>🚪</span>
          {isOpen && <span>Logout</span>}
        </button>

      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>

    </div>
  );
};