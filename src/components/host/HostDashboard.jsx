import { DollarSign, Home, Calendar, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HostDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We will fetch real data from our backend API here
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        // We will call our /hosts/analytics endpoint
        const res = await axios.get("/hosts/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Temporarily map the backend data to the UI structure
        setStats([
          {
            name: "Total Earnings",
            value: `$${res.data.totalEarnings || 0}`,
            change: "from completed bookings",
            icon: DollarSign,
            color: "bg-green-600",
          },
          {
            name: "Active Properties",
            value: res.data.totalProperties || 0,
            change: "managed by you",
            icon: Home,
            color: "bg-indigo-600",
          },
          {
            name: "Bookings",
            value: res.data.totalBookings || 0,
            change: "across all time",
            icon: Calendar,
            color: "bg-amber-500",
          },
          {
            name: "Confirmed",
            value: res.data.statusBreakdown?.Confirmed || 0,
            change: "ready for check-in",
            icon: TrendingUp,
            color: "bg-sky-500",
          },
        ]);
        
        // We will map actual recent bookings here once the backend supports returning them
        setRecentBookings(res.data.recentBookings || []);
        
      } catch (error) {
        console.error("Failed to fetch host analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard data...</div>;
  }

  // Fallback if stats failed to load completely
  const metricsToRender = stats || [
    { name: "Total Earnings", value: "$0", change: "", icon: DollarSign, color: "bg-green-600" },
    { name: "Active Properties", value: "0", change: "", icon: Home, color: "bg-indigo-600" },
    { name: "Bookings", value: "0", change: "", icon: Calendar, color: "bg-amber-500" },
    { name: "Confirmed", value: "0", change: "", icon: TrendingUp, color: "bg-sky-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome back! Here's what's happening with your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricsToRender.map((stat) => (
          <div
            key={stat.name}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-green-600">{stat.change}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Bookings
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBookings.length === 0 ? (
              <div className="p-6 text-sm text-gray-500">No recent bookings found.</div>
            ) : (
              recentBookings.map((booking) => (
                <div key={booking.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {booking.property}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Guest: {booking.guest}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {booking.checkIn} - {booking.checkOut}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {booking.amount}
                      </p>
                      <span
                        className={`inline-flex mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                          booking.status === "Confirmed"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Actions
            </h2>
          </div>
          <div className="p-6 flex flex-col gap-4">
            <Link to="/host/properties/add" className="w-full text-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Add New Property
            </Link>

            <Link to="/host/bookings" className="w-full text-center px-4 py-3 bg-white text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium">
              View All Bookings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
