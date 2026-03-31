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
import axios from "axios";

const navigation = [
  { name: "Home", href: "/user/home", icon: Home },
  { name: "Search", href: "/user/search", icon: Search },
  { name: "Bookings", href: "/user/bookings", icon: Calendar },
  { name: "Messages", href: "/user/messages", icon: MessageSquare },
  { name: "Profile", href: "/user/profile", icon: User }
];

export const GuestNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState({ fullName: "", profilePicture: "" });

  useEffect(() => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      axios.get("/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        if (res.data) {
          setUserProfile({
            fullName: res.data.fullName || "",
            profilePicture: res.data.profilePicture || ""
          });
        }
      }).catch(() => {});
    } else {
      setUserProfile({ fullName: "", profilePicture: "" });
    }
  }, [location.pathname]);

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    navigate("/");
  };

  const isHome = location.pathname.includes('/home') || location.pathname === '/' || location.pathname === '/user';
  
  const navRootClass = isHome 
    ? "absolute top-0 w-full z-50 bg-transparent" 
    : "bg-white shadow-sm sticky top-0 z-50 transition-colors";

  const brandTextColor = isHome ? "text-white drop-shadow-md" : "text-gray-900";
  const activeLinkColor = isHome ? "text-white border-white drop-shadow-md" : "text-gray-900 border-gray-900";
  const inactiveLinkColor = isHome ? "text-gray-200 border-transparent hover:border-white/50 hover:text-white drop-shadow" : "text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700";
  const buttonStyle = isHome ? "bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border-white/30" : "bg-gray-900 hover:bg-black text-white border-transparent";

  return (
    <div className={`min-h-screen ${isHome ? 'bg-transparent' : 'bg-white'}`}>
      {/* Desktop Navigation */}
      <nav className={navRootClass}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center sm:hidden mr-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 -ml-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
            <div className="flex flex-1 items-center sm:justify-start h-full">
              <div className="flex-shrink-0 flex items-center absolute left-1/2 -translate-x-1/2 sm:static sm:translate-x-0 sm:left-auto pt-1">
                <h1 className={`text-2xl font-bold tracking-tight ${brandTextColor}`}>
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
                      className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium transition-colors mt-2 ${
                        isActive ? activeLinkColor : inactiveLinkColor
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
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full shadow-sm transition-colors ${buttonStyle}`}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-full shadow-sm transition-colors ${buttonStyle}`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 bg-white shadow-2xl absolute w-full left-0 z-50 pb-2">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2 text-base font-medium ${
                      isActive
                        ? "bg-gray-100 border-l-4 border-gray-900 text-gray-900"
                        : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                  <Link to="/how-it-works" className="text-sm text-gray-600 hover:text-gray-900">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link to="/newsroom" className="text-sm text-gray-600 hover:text-gray-900">
                    Newsroom
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Support
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/help-center" className="text-sm text-gray-600 hover:text-gray-900">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Hosting
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/host/properties/add" className="text-sm text-gray-600 hover:text-gray-900">
                    List your property
                  </Link>
                </li>
                <li>
                  <Link to="/host-resources" className="text-sm text-gray-600 hover:text-gray-900">
                    Host resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
                Legal
              </h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of Service
                  </Link>
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