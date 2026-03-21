import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "Pending":
      return <Clock className="h-4 w-4" />;
    case "Completed":
      return <CheckCircle className="h-4 w-4" />;
    case "Cancelled":
      return <XCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-gray-100 text-blue-800";
    case "Pending":
      return "bg-yellow-100 text-yellow-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function AdminBookings() {
  const [data, setData] = useState({ bookings: [], stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, completed: 0 } });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load global bookings", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-6">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Booking Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage all bookings on the platform
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-gray-900" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.cancelled}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-in</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Check-out</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.length > 0 ? data.bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <span className="text-sm font-medium text-gray-900">{booking._id.substring(booking._id.length - 8).toUpperCase()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-900">{booking.guestId?.fullName || "Unknown"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{booking.propertyId?.title || "Unknown"}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-semibold text-gray-900">${booking.totalPrice}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(booking.bookingStatus)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" className="py-4 px-4 text-center text-gray-500">No bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
