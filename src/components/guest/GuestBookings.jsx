import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";

import axios from "axios";

const statusConfig = {
  confirmed: { color: "bg-green-100 text-green-800", icon: CheckCircle },
  completed: { color: "bg-gray-100 text-blue-800", icon: CheckCircle },
  cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function GuestBookings() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [bookings, setBookings] = useState({ upcoming: [], past: [], cancelled: [] });
  const [isLoading, setIsLoading] = useState(true);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/bookings/${bookingId}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Move booking from upcoming to cancelled in local state
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
    } catch (err) {
      alert("Failed to cancel booking. Please try again.");
    }
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
            property: b.propertyId.title || "Unknown Property",
            location: b.propertyId.location || "Unknown Location",
            checkIn: new Date(b.checkInDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            checkOut: new Date(b.checkOutDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            guests: 2, // Hardcoded fallback; Guests count not tracked individually by node Backend currently
            total: b.totalPrice || 0,
            status: (b.bookingStatus || "Confirmed").toLowerCase(),
            image: b.propertyId.images?.[0] || "",
            refundAmount: b.totalPrice || 0, // Fallback for cancelled tracking
            reviewSubmitted: false, // Fallback
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">
          View and manage all your reservations
        </p>
      </div>

      <div className="space-y-6">
        {/* Custom Tabs Navigation (Replacement for missing shadcn Tabs) */}
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
          {bookings[activeTab]?.map((booking) => (
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
                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1.5">
                          {booking.property}
                        </h3>
                        <p className="text-gray-500 flex items-center text-sm font-medium">
                          <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0 text-gray-400" />
                          {booking.location}
                        </p>
                      </div>
                      <Badge className={`px-3 py-1 font-semibold border-0 ${statusConfig[booking.status]?.color || "bg-gray-100 text-gray-800"}`}>
                        <span className="flex items-center gap-1.5">
                          {statusConfig[booking.status]?.icon && React.createElement(statusConfig[booking.status].icon, { className: "h-3.5 w-3.5" })}
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
                            ${booking.refundAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 font-medium mt-1">
                            Original Cost: ${booking.total.toLocaleString()}
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

                      {/* Action Buttons based on Tab */}
                      <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                        <Link to={`/user/properties/${booking.id}`} className="w-full sm:w-auto">
                          <Button variant="outline" className="w-full font-semibold px-6 border-gray-300 hover:bg-gray-50">View Property</Button>
                        </Link>
                        {activeTab === "upcoming" && (
                          <Button variant="destructive" className="w-full sm:w-auto font-semibold px-6" onClick={() => handleCancelBooking(booking.id)}>Cancel Booking</Button>
                        )}
                        {activeTab === "past" && !booking.reviewSubmitted && (
                          <Button className="w-full sm:w-auto bg-gray-900 hover:black text-black font-semibold px-6">Write Review</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {(!bookings[activeTab] || bookings[activeTab].length === 0) && (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-200 border-dashed">
              <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">No {activeTab} bookings</h3>
              <p className="text-gray-500 mt-2 max-w-sm mx-auto">You don't have any {activeTab} reservations logged in the system at the moment.</p>
              {activeTab === "upcoming" && (
                <Link to="/user/search">
                  <Button className="mt-6 bg-gray-900 hover:black text-black font-semibold px-8 shadow-md hover:shadow-lg transition-all rounded-full">
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
