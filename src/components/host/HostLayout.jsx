import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Calendar,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ClipboardList,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/host", icon: LayoutDashboard },
  { name: "My Properties", href: "/host/properties", icon: Home },
  { name: "Calendar", href: "/host/calendar", icon: Calendar },
  { name: "Bookings", href: "/host/bookings", icon: ClipboardList },

  { name: "Earnings", href: "/host/earnings", icon: DollarSign },
  { name: "Reviews", href: "/host/reviews", icon: Star },
  { name: "Messages", href: "/host/messages", icon: MessageSquare },
  { name: "Settings", href: "/host/settings", icon: Settings },
];

export default function HostLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${
          sidebarOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        ></div>
        <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-900">ChillSpace Host</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/host" &&
                  location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-white border-r border-gray-200">
          <div className="flex items-center h-16 px-6 border-b border-gray-200">
            <span className="text-xl font-bold text-gray-900">ChillSpace Host</span>
          </div>
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== "/host" &&
                  location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                    isActive
                      ? "bg-gray-50 text-gray-900"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <Link
              to="/login"
              className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="sticky top-0 z-10 flex items-center h-16 bg-white border-b border-gray-200 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="px-4 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          <span className="text-lg font-bold text-gray-900">ChillSpace Host</span>
        </div>

        {/* Page content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
