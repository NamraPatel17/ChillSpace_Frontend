import { Users, Home, Calendar, IndianRupee, TrendingUp, ArrowUp } from "lucide-react";
import PageLoader from "../ui/PageLoader";
import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      activeListings: 0,
      totalBookings: 0,
      revenue: 0
    },
    changes: {
      users:    { value: "0.0", direction: "neutral" },
      listings: { value: "0.0", direction: "neutral" },
      bookings: { value: "0.0", direction: "neutral" },
      revenue:  { value: "0.0", direction: "neutral" }
    },
    performance: { satisfaction: 0 },
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/analytics", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setDashboardData(res.data);
        }
      } catch (err) {

      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Helper: format change badge
  const changeLabel = (ch) => {
    if (!ch || ch.direction === "neutral") return { label: "0.0% vs last month", up: null };
    return {
      label: `${ch.value}% vs last month`,
      up: ch.direction === "up"
    };
  };

  const ch = dashboardData.changes || {};

  const stats = [
    {
      name: "Total Users",
      value: dashboardData.stats.totalUsers.toLocaleString(),
      change: changeLabel(ch.users),
      icon: Users,
      color: "text-gray-900",
      bgColor: "bg-gray-50",
    },
    {
      name: "Active Listings",
      value: dashboardData.stats.activeListings.toLocaleString(),
      change: changeLabel(ch.listings),
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      name: "Total Bookings",
      value: dashboardData.stats.totalBookings.toLocaleString(),
      change: changeLabel(ch.bookings),
      icon: Calendar,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      name: "Platform Revenue",
      value: `₹${dashboardData.stats.revenue.toLocaleString()}`,
      change: changeLabel(ch.revenue),
      icon: IndianRupee,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  if (loading) return <PageLoader variant="dashboard" />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {stat.change.up === null ? (
                  <span className="text-gray-400 ml-1">{stat.change.label}</span>
                ) : stat.change.up ? (
                  <>
                    <ArrowUp className="h-4 w-4 text-green-600" />
                    <span className="text-green-600 ml-1">{stat.change.label}</span>
                  </>
                ) : (
                  <>
                    <ArrowUp className="h-4 w-4 text-red-500 rotate-180" />
                    <span className="text-red-500 ml-1">{stat.change.label}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dashboardData.recentActivity.length > 0 ? dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.property}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              )) : (
                <p className="text-sm text-gray-500">No recent activity detected.</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Occupancy Rate</span>
                <span className="text-sm font-semibold text-gray-900">{dashboardData.performance.occupancy || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-900 h-2 rounded-full" style={{ width: `${dashboardData.performance.occupancy || 0}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">{dashboardData.performance.satisfaction}/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${(Number(dashboardData.performance.satisfaction) / 5) * 100}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-semibold text-gray-900">{dashboardData.performance.responseTime || 0} hrs</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${Math.min(100, Math.max(0, 100 - (dashboardData.performance.responseTime || 0) * 10))}%` }}></div>
              </div>

              <div className="flex items-center justify-between mt-6">
                <span className="text-sm text-gray-600">Revenue Growth</span>
                <span className="text-sm font-semibold text-gray-900">+{dashboardData.performance.revenueGrowth || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${Math.min(100, dashboardData.performance.revenueGrowth || 0)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
