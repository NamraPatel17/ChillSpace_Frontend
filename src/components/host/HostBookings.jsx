import { Search } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [period, setPeriod] = useState("all"); // all | 15d | 1m | 3m

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/hosts/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data.bookings || []);
        if (res.data.stats) setStats(res.data.stats);
      } catch (error) {
        console.error("Failed to fetch host bookings", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const now = new Date();
    const daysMap = { "15d": 15, "1m": 30, "3m": 90 };
    const cutoffDays = daysMap[period];
    const cutoff = cutoffDays ? new Date(now.getTime() - cutoffDays * 24 * 60 * 60 * 1000) : null;

    return bookings.filter(b => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.property?.toLowerCase().includes(q) &&
          !b.guest?.toLowerCase().includes(q) &&
          !b.id?.toLowerCase().includes(q)
        ) return false;
      }
      if (cutoff) {
        const checkIn = new Date(b.checkIn);
        if (isNaN(checkIn) || checkIn < cutoff) return false;
      }
      return true;
    });
  }, [bookings, search, statusFilter, period]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-amber-100 text-amber-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <div className="p-6">Loading host bookings...</div>;

  const statuses = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];
  const periods = [
    { key: "all", label: "All Time" },
    { key: "15d", label: "Last 15 Days" },
    { key: "1m", label: "Last Month" },
    { key: "3m", label: "Last 3 Months" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage all your property bookings</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property, guest, or booking ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Status filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Period quick-select */}
          <div className="flex items-center gap-2 flex-wrap ml-auto">
            {periods.map(p => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  period === p.key
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="mt-1 text-2xl font-semibold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Results count */}
      {(search || statusFilter !== "All" || period !== "all") && (
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium text-gray-900">{filteredBookings.length}</span> of {bookings.length} bookings
        </p>
      )}

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Booking ID", "Property", "Guest", "Check-in", "Check-out", "Nights", "Amount", "Status"].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-sm text-gray-500 text-center">
                    No bookings match your filters.
                  </td>
                </tr>
              ) : filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.id?.slice(-6)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.property}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.guest}</div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.nights}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
