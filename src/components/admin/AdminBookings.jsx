import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Calendar, CheckCircle, Clock, XCircle, MoreVertical, Eye, AlertTriangle, ShieldCheck, ShieldAlert, X } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";
import PageLoader from "../../components/ui/PageLoader";

const getStatusColor = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Completed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "Confirmed": return <CheckCircle className="h-3 w-3 mr-1" />;
    case "Pending": return <Clock className="h-3 w-3 mr-1" />;
    case "Completed": return <CheckCircle className="h-3 w-3 mr-1" />;
    case "Cancelled": return <XCircle className="h-3 w-3 mr-1" />;
    default: return null;
  }
};

export default function AdminBookings() {
  const [data, setData] = useState({ 
    bookings: [], 
    stats: { total: 0, confirmed: 0, pending: 0, cancelled: 0, completed: 0 } 
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });

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
      toast.error("Failed to load platform bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = (id, newStatus) => {
    
    const isDestructive = newStatus === "Cancelled";
    
    setConfirmModal({
      isOpen: true,
      title: `${newStatus} Booking`,
      message: `Are you sure you want to change this booking status to ${newStatus}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/admin/bookings/${id}/status`, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
          fetchBookings();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to update status");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  if (loading) return <PageLoader variant="table" />;

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={confirmModal.loading}
        variant={confirmModal.title.toLowerCase().includes("cancel") ? "danger" : "primary"}
      />

      <div>
        <h2 className="text-3xl font-semibold text-gray-900">Booking Management</h2>
        <p className="mt-1 text-sm text-gray-500">
          Monitor and manage all reservations on the platform
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Total Bookings", value: data.stats.total, icon: Calendar, color: "text-gray-900" },
          { label: "Confirmed", value: data.stats.confirmed, icon: CheckCircle, color: "text-green-600" },
          { label: "Pending", value: data.stats.pending, icon: Clock, color: "text-yellow-600" },
          { label: "Completed", value: data.stats.completed, icon: CheckCircle, color: "text-blue-600" },
          { label: "Cancelled", value: data.stats.cancelled, icon: XCircle, color: "text-red-600" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
             <CardTitle>Global Bookings</CardTitle>
             <p className="text-xs text-gray-400 font-medium">Click on 3-dots to manage actions</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Booking ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Guest</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Property</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Dates</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.bookings.length > 0 ? data.bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        #{booking._id.substring(booking._id.length - 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{booking.guestId?.fullName || "Private Guest"}</p>
                        <p className="text-xs text-gray-500">{booking.guestId?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600 line-clamp-1">{booking.propertyId?.title || "Property N/A"}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <div className="flex flex-col">
                        <span>{new Date(booking.checkInDate).toLocaleDateString('en-GB')}</span>
                        <span className="text-[10px] text-gray-400">to {new Date(booking.checkOutDate).toLocaleDateString('en-GB')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm font-bold text-gray-900">₹{booking.totalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className={`${getStatusColor(booking.bookingStatus)} border-0 shadow-sm`}>
                        <span className="flex items-center text-[10px] uppercase tracking-wider font-bold">
                          {getStatusIcon(booking.bookingStatus)}
                          {booking.bookingStatus}
                        </span>
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <CustomDropdown 
                        items={[
                          {
                            label: "View Listing",
                            icon: Eye,
                            onClick: () => navigate(`/user/properties/${booking.propertyId?._id}`)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="py-10 text-center text-gray-400">No system bookings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
