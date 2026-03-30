import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, Star } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { toast } from "react-toastify";
import axios from "axios";
import { CustomSelect } from "../ui/custom-select";

const statusConfig = {
  confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  completed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
  pending: { color: "bg-amber-100 text-amber-800", icon: Clock },
};

export default function GuestBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });
  const [isLoading, setIsLoading] = useState(true);

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });

  const closeConfirmModal = () => setConfirmModal({ ...confirmModal, isOpen: false });

  const handleCancelBooking = (bookingId) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel Booking",
      message: "Are you sure you want to cancel this reservation? This action cannot be undone.",
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/bookings/${bookingId}/cancel`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setBookings(prev => {
            const cancelled = prev.upcoming.find(b => b.id === bookingId);
            if (!cancelled) return prev;
            const updated = { ...cancelled, status: "cancelled" };
            return {
              ...prev,
              upcoming: prev.upcoming.filter(b => b.id !== bookingId),
              cancelled: [updated, ...prev.cancelled]
            };
          });
          toast.success("Booking cancelled successfully");
          closeConfirmModal();
        } catch (err) {
          toast.error("Failed to cancel booking. Please try again.");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");
        if (!token || !userId) {
          setIsLoading(false);
          return;
        }

        const res = await axios.get(`/bookings/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const rawBookings = res.data;
        const formatted = { upcoming: [], past: [], cancelled: [] };

        rawBookings.forEach(b => {
          if (!b.propertyId) return; // Skip invalid bindings
          
          const bookingObj = {
            id: b._id,
            propertyId: b.propertyId._id, // Store propertyId correctly
            property: b.propertyId.title || "Unknown Property",
            location: b.propertyId.location || "Unknown Location",
            checkIn: new Date(b.checkInDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            checkOut: new Date(b.checkOutDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            guests: 2, 
            total: b.totalPrice || 0,
            status: (b.bookingStatus || "Confirmed").toLowerCase(),
            image: b.propertyId.images?.[0] || "",
            refundAmount: b.totalPrice || 0, 
            reviewSubmitted: b.isReviewed || false,
            rawCheckIn: new Date(b.checkInDate),
            rawCheckOut: new Date(b.checkOutDate)
          };

          const status = bookingObj.status;
          const now = new Date();

          if (status === "cancelled") {
            formatted.cancelled.push(bookingObj);
          } else if (status === "completed" || bookingObj.rawCheckOut < now) {
            formatted.past.push(bookingObj);
          } else {
            formatted.upcoming.push(bookingObj);
          }
        });

        formatted.upcoming.sort((a,b) => a.rawCheckIn - b.rawCheckIn);
        formatted.past.sort((a,b) => b.rawCheckOut - a.rawCheckOut);
        formatted.cancelled.sort((a,b) => b.rawCheckIn - a.rawCheckIn);

        setBookings(formatted);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const tabs = [
    { id: "upcoming", label: `Upcoming (${bookings.upcoming.length})` },
    { id: "past", label: `Past (${bookings.past.length})` },
    { id: "cancelled", label: `Cancelled (${bookings.cancelled.length})` },
  ];

  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeData, setDisputeData] = useState({ bookingId: "", reason: "Property condition", description: "" });
  const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);

  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewData, setReviewData] = useState({ propertyId: "", bookingId: "", rating: 5, reviewText: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleRateProperty = (propertyId, bookingId) => {
    setReviewData({ propertyId, bookingId, rating: 5, reviewText: "" });
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!reviewData.reviewText.trim()) {
      toast.warning("Please write a review comment.");
      return;
    }
    setIsSubmittingReview(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/reviews", reviewData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Review submitted successfully!");
      setIsReviewModalOpen(false);
      setReviewData({ propertyId: "", bookingId: "", rating: 5, reviewText: "" });
      
      // Update local state to hide button across specific mapped component bounds natively
      setBookings(prev => {
        const past = prev.past.map(b => b.id === reviewData.bookingId ? { ...b, reviewSubmitted: true } : b);
        return { ...prev, past };
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleRaiseDispute = (bookingId) => {
    setDisputeData({ ...disputeData, bookingId });
    setIsDisputeModalOpen(true);
  };

  const submitDispute = async () => {
    if (!disputeData.description.trim()) {
      toast.warning("Please provide a description of the issue.");
      return;
    }
    setIsSubmittingDispute(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/disputes", disputeData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Dispute raised successfully. Our support team will review it.");
      setIsDisputeModalOpen(false);
      setDisputeData({ bookingId: "", reason: "Property condition", description: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise dispute.");
    } finally {
      setIsSubmittingDispute(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-300">
             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
             </div>
             <h3 className="text-xl font-bold text-gray-900 mb-2">{confirmModal.title}</h3>
             <p className="text-gray-500 text-sm leading-relaxed mb-6">{confirmModal.message}</p>
             <div className="flex gap-3">
               <Button variant="outline" className="flex-1 rounded-xl" onClick={closeConfirmModal} disabled={confirmModal.loading}>Cancel</Button>
               <Button className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white" onClick={confirmModal.onConfirm} disabled={confirmModal.loading}>
                 {confirmModal.loading ? "Processing..." : "Confirm"}
               </Button>
             </div>
           </div>
        </div>
      )}

      {/* Dispute Modal */}
      {isDisputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Report an Issue</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <CustomSelect
                  options={[
                    "Property condition",
                    "Host behaviour",
                    "Incorrect listing",
                    "Refund issue",
                    "Safety concern",
                    "Other"
                  ]}
                  value={disputeData.reason}
                  onChange={(val) => setDisputeData({ ...disputeData, reason: val })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={disputeData.description}
                  onChange={(e) => setDisputeData({ ...disputeData, description: e.target.value })}
                  placeholder="Describe the issue in detail..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsDisputeModalOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submitDispute} disabled={isSubmittingDispute}>
                  {isSubmittingDispute ? "Submitting..." : "Submit Report"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rate Your Stay</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= reviewData.rating ? "text-amber-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                <textarea
                  value={reviewData.reviewText}
                  onChange={(e) => setReviewData({ ...reviewData, reviewText: e.target.value })}
                  placeholder="Tell others about your experience..."
                  rows={4}
                  className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setIsReviewModalOpen(false)}>Cancel</Button>
                <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" onClick={submitReview} disabled={isSubmittingReview}>
                  {isSubmittingReview ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">
          View and manage all your reservations
        </p>
      </div>

      <div className="space-y-6">
        {/* Custom Tabs Navigation */}
        <div className="inline-flex h-10 items-center justify-start sm:justify-center rounded-md bg-gray-100 p-1 text-gray-500 w-full sm:w-auto overflow-x-auto overflow-y-hidden shadow-inner">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-6 py-1.5 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-white text-gray-950 shadow flex-1 sm:flex-none"
                  : "hover:text-gray-900 hover:bg-gray-200/50 flex-1 sm:flex-none"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content rendering */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="text-center py-20 font-medium text-gray-500">Loading your bookings...</div>
          ) : (
            bookings[activeTab]?.map((booking) => (
              <Card key={booking.id} className="overflow-hidden hover:shadow-lg transition-all border-0 shadow-md">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Property Image */}
                    <div className="md:w-72 h-56 flex-shrink-0 relative group">
                      <ImageWithFallback
                        src={booking.image}
                        alt={booking.property}
                        className="w-full h-full object-cover md:rounded-l-xl transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 md:rounded-l-xl" />
                    </div>
                    
                    {/* Property Details */}
                    <div className="flex-1 p-6 flex flex-col bg-white">
                      <div className="flex items-start justify-between mb-5 flex-col sm:flex-row gap-4 sm:gap-0">
                        <div>
                          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1.5 line-clamp-1">
                            {booking.property}
                          </h3>
                          <p className="text-gray-500 flex items-center text-sm font-medium">
                            <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />
                            {booking.location}
                          </p>
                        </div>
                        <Badge variant="custom" className={`px-3 py-1 font-semibold border-0 ${statusConfig[booking.status.toLowerCase()]?.color || "bg-gray-100 text-gray-800"}`}>
                          <span className="flex items-center gap-1.5">
                            {statusConfig[booking.status.toLowerCase()]?.icon && React.createElement(statusConfig[booking.status.toLowerCase()].icon, { className: "h-3.5 w-3.5" })}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </Badge>
                      </div>
  
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        <div className="flex items-center text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                          <Calendar className="h-4 w-4 text-gray-800 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Check-in</p>
                            <p className="font-semibold text-gray-900">{booking.checkIn}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100">
                          <Calendar className="h-4 w-4 text-gray-800 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Check-out</p>
                            <p className="font-semibold text-gray-900">{booking.checkOut}</p>
                          </div>
                        </div>
                        <div className="flex items-center text-sm bg-gray-50/80 p-3 rounded-lg border border-gray-100 col-span-2 sm:col-span-1">
                          <Clock className="h-4 w-4 text-gray-800 mr-2 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Guests</p>
                            <p className="font-semibold text-gray-900">{booking.guests}</p>
                          </div>
                        </div>
                      </div>
  
                      <div className="mt-auto flex flex-col sm:flex-row sm:items-end justify-between pt-5 border-t border-gray-100 gap-4">
                        {activeTab === "cancelled" ? (
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Refund Amount</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${booking.total.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600 font-medium mt-1">
                              Processed successfully
                            </p>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Price</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${booking.total.toLocaleString()}
                            </p>
                          </div>
                        )}
  
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                          <Link to={`/user/properties/${booking.propertyId}`} className="w-full sm:w-auto">
                            <Button variant="outline" className="w-full font-semibold px-6 border-gray-300 hover:bg-gray-50 shadow-sm">View Property</Button>
                          </Link>
                          <Button variant="outline" className="w-full sm:w-auto font-semibold px-6 border-red-200 text-red-600 hover:bg-red-50 shadow-sm" onClick={() => handleRaiseDispute(booking.id)}>Report Issue</Button>
                          {activeTab === "upcoming" && (
                            <Button variant="destructive" className="w-full sm:w-auto font-semibold px-6 shadow-md" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</Button>
                          )}
                          {activeTab === "past" && !booking.reviewSubmitted && (
                            <Button className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white font-semibold px-6 shadow-md" onClick={() => handleRateProperty(booking.propertyId, booking.id)}>Write Review</Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
          
          {!isLoading && (!bookings[activeTab] || bookings[activeTab].length === 0) && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
              <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No {activeTab} bookings</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">You don't have any {activeTab} reservations logged in the system at the moment.</p>
              {activeTab === "upcoming" && (
                <Link to="/user/search">
                  <Button className="mt-6 bg-gray-900 hover:black text-white font-semibold px-8 shadow-md hover:shadow-lg transition-all rounded-full">
                    Start Exploring
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
