import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export const GuestNavbar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-3 sticky top-0 z-50">
        <div className="flex justify-between items-center">

          {/* LOGO */}
          <h1 className="text-xl font-bold text-blue-500">
            ChillSpace
          </h1>

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex gap-6 items-center font-medium">

            <li>
              <Link to="/user/home" className="hover:text-blue-500">
                Home
              </Link>
            </li>

            <li>
              <Link to="/user/properties" className="hover:text-blue-500">
                Properties
              </Link>
            </li>

            <li>
              <Link to="/user/bookings" className="hover:text-blue-500">
                My Bookings
              </Link>
            </li>

            <li>
              <Link to="/user/profile" className="hover:text-blue-500">
                Profile
              </Link>
            </li>

            <li>
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>
            </li>

          </ul>

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden text-xl"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>

        </div>

        {/* MOBILE MENU */}
        {isOpen && (
          <ul className="md:hidden flex flex-col mt-4 gap-3 font-medium">

            <li>
              <Link to="/user/home">Home</Link>
            </li>

            <li>
              <Link to="/user/properties">Properties</Link>
            </li>

            <li>
              <Link to="/user/bookings">My Bookings</Link>
            </li>

            <li>
              <Link to="/user/profile">Profile</Link>
            </li>

            <li>
              <button
                onClick={logoutHandler}
                className="bg-red-500 text-white px-4 py-1 rounded-lg w-fit"
              >
                Logout
              </button>
            </li>

          </ul>
        )}

      </nav>

      {/* PAGE CONTENT */}
      <div className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    </>
  );
};