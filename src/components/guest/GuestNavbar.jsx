// Frontend/chillspace/src/components/guest/GuestNavbar.jsx
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/user/home", icon: Home },
  { name: "Search", href: "/user/search", icon: Search },
  { name: "Bookings", href: "/user/bookings", icon: Calendar },
  { name: "Profile", href: "/user/profile", icon: User }
];

export const GuestNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, [location.pathname]);

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex flex-1 items-center justify-between">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-semibold text-blue-600">
                  ChillSpace
                </h1>
              </div>
              <div className="hidden sm:flex sm:space-x-4 justify-end flex-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`inline-flex items-center px-3 py-2 border-b-2 text-sm transition-colors ${
                        isActive
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              {isLoggedIn ? (
                <button
                  onClick={logoutHandler}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2 text-base ${
                      isActive
                        ? "bg-blue-50 border-l-4 border-blue-500 text-blue-700"
                        : "border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
              
              {isLoggedIn ? (
                <button
                  onClick={logoutHandler}
                  className="flex w-full items-center px-4 py-2 text-base border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex w-full items-center px-4 py-2 text-base border-l-4 border-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                >
                  <User className="h-5 w-5 mr-3" />
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-20">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                About
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Newsroom
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Hosting
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    List your property
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Host resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-sm text-gray-400 text-center">
              © 2026 ChillSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};