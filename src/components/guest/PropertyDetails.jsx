// Frontend/chillspace/src/components/guest/PropertyDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import {
  MapPin,
  Star,
  Users,
  Bed,
  Bath,
  Wifi,
  Car,
  Waves,
  Home,
  Calendar,
  Shield,
  MessageCircle
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const reviewsData = [
  {
    id: 1,
    author: "John D.",
    rating: 5,
    date: "March 2026",
    comment:
      "Absolutely stunning property! The views were incredible and the house was even better than the photos."
  },
  {
    id: 2,
    author: "Emily R.",
    rating: 5,
    date: "February 2026",
    comment:
      "Perfect vacation spot. The location is unbeatable and the amenities were top-notch."
  },
  {
    id: 3,
    author: "Michael S.",
    rating: 4,
    date: "January 2026",
    comment:
      "Great place for a family vacation. Very spacious and well-equipped."
  }
];

export const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [loading, setLoading] = useState(false);

  // TODO: replace with real logged-in user id storage
  const guestId = localStorage.getItem("userId");

  const fetchProperty = async () => {
    try {
      const res = await axios.get(`/property/${id}`);
      setProperty(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load property");
    }
  };

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      toast.error("Please login again");
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    const nights = getNights();
    if (nights <= 0) {
      toast.error("Check-out must be after check-in");
      return;
    }

    const totalPrice = nights * (property?.pricePerNight || 0);

    try {
      setLoading(true);
      const res = await axios.post("/booking", {
        propertyId: id,
        guestId,
        checkInDate,
        checkOutDate,
        totalPrice
      });

      if (res.status === 201) {
        toast.success("Booking created successfully 🎉");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Booking failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!property) {
    return <div className="p-6">Loading...</div>;
  }

  const nights = getNights();
  const totalPrice = nights * (property.pricePerNight || 0);

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0]
      : "https://picsum.photos/800/400";

  const galleryImages =
    property.images && property.images.length > 1
      ? property.images.slice(1, 5)
      : [mainImage, mainImage, mainImage, mainImage];

  // Map simple amenities strings to icons for nicer UI
  const amenityIconMap = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
    if (lower.includes("pool")) return Waves;
    if (lower.includes("parking")) return Car;
    if (lower.includes("kitchen")) return Home;
    return Home;
  };

  const amenitiesForUI = (property.amenities || []).map((name) => ({
    icon: amenityIconMap(name),
    name
  }));

  const hostName = property.hostName || "Host";
  const hostInitial = hostName.charAt(0).toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {property.rating > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
              <span className="font-medium">
                {property.rating.toFixed(1)}
              </span>
              <span className="text-gray-600 ml-1">(Guest rating)</span>
            </div>
          )}
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            {property.location}
          </div>
        </div>
      </div>

      {/* Images Gallery */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="md:row-span-2">
            <ImageWithFallback
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover min-h-[400px]"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            {galleryImages.map((img, i) => (
              <ImageWithFallback
                key={i}
                src={img}
                alt={`${property.title} ${i + 1}`}
                className="w-full h-48 object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property Details */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Property Details</h2>
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">
                  {property.maxGuests
                    ? `${property.maxGuests} guests`
                    : "Guests"}
                </span>
              </div>
              <div className="flex items-center">
                <Bed className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Bedrooms</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-gray-700">Bathrooms</span>
              </div>
            </div>
            <hr className="my-6 border-gray-200" />
            <p className="text-gray-700 leading-relaxed">
              {property.description ||
                "A comfortable stay with all the essentials for your trip."}
            </p>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
            {amenitiesForUI.length === 0 ? (
              <p className="text-gray-600">Amenities information not provided.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {amenitiesForUI.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <amenity.icon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="text-gray-700">{amenity.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* House Rules (simple placeholder) */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">House Rules</h2>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">
                  Check-in and check-out times will be shared after booking.
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">
                  Please respect neighbors and keep noise to a minimum.
                </span>
              </li>
            </ul>
          </div>

          {/* Guest Reviews (static sample) */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Guest Reviews</h2>
            <div className="space-y-4">
              {reviewsData.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <div className="h-10 w-10 mr-3 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                          {review.author.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {review.author}
                          </p>
                          <p className="text-sm text-gray-600">
                            {review.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Host Info (simple) */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Hosted by</h2>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-16 w-16 mr-4 rounded-full bg-gray-200 flex items-center justify-center text-lg font-semibold">
                    {hostInitial}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 flex items-center">
                      {hostName}
                      <Shield className="h-4 w-4 text-blue-600 ml-2" />
                    </p>
                    <p className="text-sm text-gray-600">
                      Verified host
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Host
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Card (template style + real booking) */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-semibold text-gray-900">
                    ₹{property.pricePerNight}
                  </span>
                  <span className="text-gray-600 ml-1">/night</span>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                    <input
                      type="date"
                      placeholder="Check-in"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 text-gray-600 mr-2" />
                    <input
                      type="date"
                      placeholder="Check-out"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>
                <div className="border border-gray-300 rounded-lg p-3">
                  <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 text-gray-600 mr-2" />
                    <input
                      type="text"
                      placeholder="Guests"
                      className="flex-1 outline-none"
                    />
                  </div>
                </div>
              </div>

              <Button
                className="w-full mb-4"
                size="lg"
                onClick={handleBooking}
                disabled={loading}
              >
                {loading ? "Booking..." : "Reserve"}
              </Button>

              <p className="text-center text-sm text-gray-600 mb-4">
                You won't be charged yet
              </p>

              <hr className="my-4 border-gray-200" />

              <div className="space-y-2 text-sm">
                {nights > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ₹{property.pricePerNight} × {nights} night(s)
                    </span>
                    <span className="text-gray-900">
                      ₹{totalPrice}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="text-gray-900">₹500</span>
                </div>
                <hr className="my-2 border-gray-200" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{totalPrice + 500}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};