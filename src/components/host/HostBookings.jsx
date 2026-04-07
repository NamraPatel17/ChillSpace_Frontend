import { Search, Star, AlertTriangle, MoreVertical, CheckCircle, XCircle, ShieldCheck } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomSelect } from "../ui/custom-select";
import { CustomDropdown } from "../ui/CustomDropdown";
import PageLoader from "../ui/PageLoader";

export default function HostBookings() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ total: 0, confirmed: 0, pending: 0, cancelled: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [period, setPeriod] = useState("all"); // all | 15d | 1m | 3m

  const fetchBookings = async (activePeriod) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const periodMap = { "15d": "last15", "1m": "lastMonth", "3m": "last3Months" };
      const apiPeriod = periodMap[activePeriod] || "";
      const url = apiPeriod ? `/hosts/bookings?period=${apiPeriod}` : "/hosts/bookings";
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data.bookings || []);
      if (res.data.stats) setStats(res.data.stats);
    } catch (error) {

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(period);
  }, [period]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/bookings/${id}/status`, { bookingStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`);
      fetchBookings(period);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      if (statusFilter !== "All" && b.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !b.property?.toLowerCase().includes(q) &&
          !b.guest?.toLowerCase().includes(q) &&
          !String(b.id)?.toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [bookings, search, statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":  return "bg-green-100 text-green-700";
      case "Confirmed":  return "bg-indigo-100 text-indigo-700";
      case "Pending":    return "bg-amber-100 text-amber-800";
      case "Cancelled":  return "bg-red-100 text-red-700";
      default:           return "bg-gray-100 text-gray-800";
    }
  };

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ bookingId: "", rating: 5, reviewText: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeData, setDisputeData] = useState({ bookingId: "", reason: "Property condition", description: "" });
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  const handleRateGuest = (bookingId) => {
    setReviewData({ bookingId, rating: 5, reviewText: "" });
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/reviews/guest", reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review submitted successfully!");
      setIsReviewModalOpen(false);
      fetchBookings(); // Refresh the list so the Rated button disappears immediately
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRaiseDispute = (bookingId) => {
    setDisputeData({ bookingId, reason: "Property condition", description: "" });
    setIsDisputeModalOpen(true);
  };

  const submitDispute = async () => {
    if (!disputeData.description.trim()) {
      toast.warning("Description is required");
      return;
    }
    setIsSubmittingDispute(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/disputes", disputeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Dispute raised successfully. Support will review it.");
      setIsDisputeModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise dispute.");
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  if (loading) return <PageLoader variant="table" />;

  const statuses = ["All", "Confirmed", "Pending", "Cancelled", "Completed"];
  const periods = [
    { key: "all", label: "All Time" },
    { key: "15d", label: "Last 15 Days" },
    { key: "1m", label: "Last Month" },
    { key: "3m", label: "Last 3 Months" },
  ];

  return (
    <div className="space-y-6">
      {/* Rate Guest Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-0 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-indigo-600 fill-current" />
                Rate Guest Experience
              </h2>
              <button 
                onClick={() => setIsReviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 rounded-full p-1"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Overall Rating</label>
                <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`transition-all duration-200 focus:outline-none hover:scale-110 ${
                        reviewData.rating >= star 
                          ? "text-amber-400" 
                          : "text-gray-200 hover:text-amber-200"
                      }`}
                    >
                      <Star className={`w-8 h-8 ${reviewData.rating >= star ? "fill-current" : ""}`} />
                    </button>
                  ))}
                  <span className="ml-3 font-medium text-gray-600 text-sm">
                    {reviewData.rating} out of 5
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Write a Review</label>
                <textarea
                  value={reviewData.reviewText}
                  onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
                  placeholder="Share details about the guest's communication, cleanliness, and adherence to house rules..."
                  rows={4}
                  className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-400 resize-none bg-gray-50/50"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setIsReviewModalOpen(false)} 
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={submitReview} 
                  disabled={isSubmittingReview || !reviewData.reviewText.trim()} 
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-sm"
                >
                  {isSubmittingReview ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Raise Dispute</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason</label>
                <CustomSelect
                  options={[
                    "Property condition",
                    "Host behaviour",
                    "Refund issue",
                    "Safety concern",
                    "Other"
                  ]}
                  value={disputeData.reason}
                  onChange={(val) => setDisputeData({ ...disputeData, reason: val })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={disputeData.description}
                  onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                  rows={4}
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsDisputeModalOpen(false)} className="flex-1 px-4 py-2 border rounded">Cancel</button>
                <button onClick={submitDispute} disabled={isSubmittingDispute} className="flex-1 bg-red-600 text-white rounded">
                  {isSubmittingDispute ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-600">Manage all your property bookings</p>
      </div>

      {/* Filters omitted for brevity... */}
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
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="mt-1 text-2xl font-semibold text-sky-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-amber-500">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="mt-1 text-2xl font-semibold text-red-500">{stats.cancelled}</p>
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
                {["Booking ID", "Property", "Guest", "Check-in", "Check-out", "Amount", "Status", "Actions"].map(h => (
                  <th key={h} className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${h === "Actions" ? "text-right" : "text-left"}`}>{h}</th>
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
                    <div className="flex items-center gap-1.5">
                      <div className="text-sm font-semibold text-gray-900">{booking.guest}</div>
                      {booking.guestVerified && (
                        <div className="flex items-center text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded border border-green-100 font-bold uppercase tracking-tight">
                          <ShieldCheck className="w-3 h-3 mr-0.5" />
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">{booking.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.checkOut}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <CustomDropdown 
                      items={[
                        ...(booking.status === "Pending" ? [
                          {
                            label: "Confirm Booking",
                            icon: CheckCircle,
                            onClick: () => handleUpdateStatus(booking.id, "Confirmed")
                          },
                          {
                            label: "Cancel Booking",
                            icon: XCircle,
                            variant: "danger",
                            onClick: () => handleUpdateStatus(booking.id, "Cancelled")
                          }
                        ] : []),
                        ...(booking.status === "Confirmed" ? [
                          {
                            label: "Mark Completed",
                            icon: ShieldCheck,
                            onClick: () => handleUpdateStatus(booking.id, "Completed")
                          }
                        ] : []),
                        ...(booking.status === "Completed" && !booking.isRatedByHost ? [{
                          label: "Rate Guest",
                          icon: Star,
                          onClick: () => handleRateGuest(booking.id)
                        }] : []),
                        {
                          label: "Report Issue",
                          icon: AlertTriangle,
                          variant: "danger",
                          onClick: () => handleRaiseDispute(booking.id)
                        }
                      ]}
                    />
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
