import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  MapPin, Star, Users, Bed, Bath, Wifi, Car, Waves, Home,
  Calendar, Shield, MessageCircle, CheckCircle, ChevronLeft, ChevronRight, ChevronDown
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { CustomSelect } from "../ui/custom-select";
import { DatePicker } from "../ui/datepicker";

// Removes dummy reviews block completely

export const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [guests, setGuests] = useState();

  const guestId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

  const fetchProperty = async () => {
    try {
      const [propRes, revRes] = await Promise.all([
        axios.get(`/properties/${id}`),
        axios.get(`/reviews/property/${id}`)
      ]);
      setProperty(propRes.data);
      setReviews(revRes.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load property details");
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const getNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const inDate = new Date(checkInDate);
    const outDate = new Date(checkOutDate);
    const diff = outDate - inDate;
    if (diff <= 0) return 0;
    return diff / (1000 * 60 * 60 * 24);
  };

  const handleBooking = async () => {
    if (!guestId) {
      toast.error("Please login to book a reservation");
      navigate("/login")
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select both check-in and check-out dates");
      return;
    }

    const nights = getNights();
    if (nights <= 0) {
      toast.error("Check-out must cleanly follow check-in time");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("/bookings", {
        propertyId: id,
        guestId: guestId,
        checkInDate: checkInDate,
        checkOutDate: checkOutDate,
        totalPrice: (property.pricePerNight * nights) + 500 // including service fee
      });

      if (res.status === 201) {
        toast.success("Booking created successfully 🎉");
        setTimeout(() => navigate("/user/bookings"), 1500)
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Booking failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading property details...</p>
      </div>
    );
  }

  const nights = getNights();
  const basePrice = nights * (property.pricePerNight || 0);
  const serviceFee = 500; // Static mockup fee
  const totalPrice = basePrice > 0 ? basePrice + serviceFee : 0;

  const reviewCount = reviews.length;
  const averageRating = reviewCount > 0 
    ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviewCount).toFixed(1) 
    : (property.rating > 0 ? property.rating.toFixed(1) : "New");

  const images = property.images?.length > 0 
    ? property.images 
    : ["https://images.unsplash.com/photo-1772398539093-fc7b4a6b1bfc?q=80&w=1080"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const amenityIconMap = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
    if (lower.includes("pool") || lower.includes("swim")) return Waves;
    if (lower.includes("parking") || lower.includes("car")) return Car;
    if (lower.includes("kitchen")) return Home;
    return CheckCircle; // Fallback
  };

  const amenities = property.amenities?.length > 0 ? property.amenities.map(a => ({ name: a, icon: amenityIconMap(a) })) : [
    { icon: Wifi, name: "High-speed WiFi" },
    { icon: Waves, name: "Private Pool" },
    { icon: Car, name: "Free Parking" },
    { icon: Home, name: "Full Kitchen" }
  ];

  const hostName = property.hostId?.fullName || "Host Member";
  const hostInitial = hostName.charAt(0).toUpperCase();

  const mockHouseRules = [
    "Check-in: 3:00 PM - 10:00 PM",
    "Check-out: 11:00 AM",
    "No smoking inside",
    "No parties or events",
    "Pets allowed with prior approval"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1.5" />
            <span className="text-gray-900">{averageRating}</span>
            <span className="text-gray-500 ml-1 leading-none underline cursor-pointer hover:text-gray-700 transition">
              ({reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-1.5 text-gray-900" />
            <span className="underline cursor-pointer hover:text-black transition">{property.location}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery Carousel */}
      <div className="mb-8 rounded-xl overflow-hidden shadow-sm border border-gray-100/50 relative">
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] w-full group flex items-center justify-center bg-gray-100">
          <ImageWithFallback
            src={images[currentImageIndex]}
            alt={`${property.title} view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {images.length > 1 && (
            <>
              {/* Previous Button */}
              <button 
                onClick={prevImage}
                className="absolute left-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              
              {/* Next Button */}
              <button 
                onClick={nextImage}
                className="absolute right-4 p-2 rounded-full bg-white/80 hover:bg-white text-gray-800 shadow-md backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                {images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`transition-all rounded-full ${idx === currentImageIndex ? "bg-white w-2.5 h-2.5 shadow-sm" : "bg-white/50 w-2 h-2"}`}
                  />
                ))}
              </div>
            </>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="order-2 lg:order-1 lg:col-span-2 space-y-10">
          {/* Property Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-5 tracking-tight">Property Details</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center text-gray-800 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Users className="h-4 w-4 text-gray-900 mr-2" />
                <span className="font-medium text-sm">
                  {property.maxGuests || 8} guests max
                </span>
              </div>
              <div className="flex items-center text-gray-800 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Bed className="h-4 w-4 text-gray-900 mr-2" />
                <span className="font-medium text-sm">
                  {property.bedrooms || property.maxGuests/2 || 4} bedrooms
                </span>
              </div>
              <div className="flex items-center text-gray-800 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                <Bath className="h-4 w-4 text-gray-900 mr-2" />
                <span className="font-medium text-sm">
                  {property.bathrooms || 3} bathrooms
                </span>
              </div>
            </div>
            
            <div className="h-[1px] bg-gray-200 my-8 w-full" />
            
            <p className="text-gray-700 leading-relaxed text-[15px]">
              {property.description || "Experience living in this stunning comfortable property. Featuring spacious areas, natural light, and elegant furnishings. Perfect for families or groups seeking an unforgettable vacation. The open-concept living space is fully equipped with modern amenities and everything you need for a restful stay."}
            </p>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-semibold mb-5 tracking-tight">Amenities</h2>
            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
              {amenities.map((amenity, index) => (
                <div key={index} className="flex items-center opacity-90 hover:opacity-100 transition">
                  <amenity.icon className="h-6 w-6 text-gray-700 mr-4 font-light stroke-[1.5]" />
                  <span className="text-gray-800 font-medium">{amenity.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* House Rules */}
          <div>
            <h2 className="text-2xl font-semibold mb-5 tracking-tight">House Rules</h2>
            <ul className="space-y-4">
              {mockHouseRules.map((rule, index) => (
                <li key={index} className="flex items-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-900 mr-4" />
                  <span className="text-gray-700">{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-[1px] bg-gray-200 w-full" />

          {/* Guest Reviews */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 tracking-tight">Guest Reviews</h2>
            
            {reviewCount === 0 ? (
              <p className="text-gray-500 italic">No reviews yet for this property. Be the first to stay and review!</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 4).map((review) => {
                  const guestName = review.guestId?.fullName || "Guest User";
                  return (
                    <Card key={review._id} className="shadow-none border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-[8px]">
                          <div className="flex items-center">
                            <div className="h-10 w-10 mr-3 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-700">
                              {guestName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 text-[14px] leading-tight mb-[2px]">
                                {guestName}
                              </p>
                              <p className="text-[12px] text-gray-500">
                                {new Date(review.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(review.rating || 5)].map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 text-yellow-400 fill-current ml-[2px]"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-[14px] mt-3 leading-relaxed">
                          {review.comment}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
            
            {reviewCount > 4 && (
              <Button variant="outline" className="mt-4 text-sm font-medium border-gray-300">
                Show all {reviewCount} reviews
              </Button>
            )}
          </div>

          {/* Host Info */}
          <Card className="shadow-none border border-gray-200 mt-8 mb-4">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-tight">Hosted by</h2>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <div className="h-12 w-12 mr-3 rounded-full bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-700">
                    {hostInitial}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 flex items-center text-[15px]">
                      {hostName}
                      <Shield className="h-4 w-4 text-gray-800 ml-1.5" />
                    </p>
                    <p className="text-[12px] text-gray-500">
                      Member since 2026
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => {
                    if (!guestId) {
                      toast.error("Please login to message the host");
                      navigate("/login");
                      return;
                    }
                    if (!property.hostId?._id) return;
                    navigate("/user/messages", { 
                      state: { 
                        hostId: property.hostId._id, 
                        hostName: property.hostId.fullName || "Host"
                      } 
                    });
                  }}
                  variant="outline" 
                  className="text-sm border-gray-300 h-9 font-medium px-4"
                >
                  <MessageCircle className="h-4 w-4 mr-2 text-gray-500" />
                  Contact Host
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card */}
        <div className="order-1 lg:order-2 lg:col-span-1">
          <Card className="sticky top-24 shadow-none border border-gray-200 rounded-lg">
            <CardContent className="p-6">
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-[28px] font-semibold text-gray-900 tracking-tight">
                    ${property.pricePerNight}
                  </span>
                  <span className="text-gray-600 ml-1 text-[15px] font-medium">/night</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <DatePicker
                  value={checkInDate}
                  onChange={setCheckInDate}
                  placeholder="Check in"
                  className="w-full"
                />
                
                <DatePicker
                  value={checkOutDate}
                  onChange={setCheckOutDate}
                  placeholder="Check out"
                  className="w-full"
                />
                
                <div className="border border-gray-300 rounded-md p-3">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-500 mr-2 flex-shrink-0" />
                    <input
                      type="number"
                      min="1"
                      max={property?.maxGuests || 10}
                      value={guests || ""}
                      onChange={(e) => setGuests(e.target.value)}
                      className="flex-1 text-gray-900 font-medium outline-none bg-transparent cursor-pointer w-full"
                      placeholder="Guests"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleBooking}
                disabled={loading}
                className="w-full py-6 text-[15px] font-semibold bg-black hover:bg-gray-900 text-white rounded-md mb-4" 
              >
                 {loading ? "Confirming..." : "Reserve"}
              </Button>

              <p className="text-center text-[13px] text-gray-500 font-medium mb-6">
                You won't be charged yet
              </p>

              {nights > 0 && (
                <>
                  <div className="space-y-3 text-[14px]">
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">
                        ${property.pricePerNight} x {nights} nights
                      </span>
                      <span className="text-gray-900">
                        ${basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 underline">Service fee</span>
                      <span className="text-gray-900">${serviceFee.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-[1px] bg-gray-200 my-4 w-full" />
                  <div className="flex justify-between font-bold text-[16px]">
                    <span>Total</span>
                    <span>${totalPrice.toLocaleString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};