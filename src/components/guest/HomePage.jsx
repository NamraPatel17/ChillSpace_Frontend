import React from "react";
import { Link } from "react-router-dom";
import { Search, MapPin, Star, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const featuredProperties = [
  {
    id: 1,
    title: "Luxury Beach Villa",
    location: "Malibu, California",
    price: 450,
    rating: 4.9,
    reviews: 127,
    image:
      "https://images.unsplash.com/photo-1772398539093-fc7b4a6b1bfc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWFjaCUyMHZpbGxhJTIwdmFjYXRpb24lMjByZW50YWx8ZW58MXx8fHwxNzczNzIxOTczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    title: "Mountain Cabin Retreat",
    location: "Aspen, Colorado",
    price: 325,
    rating: 4.8,
    reviews: 89,
    image:
      "https://images.unsplash.com/photo-1769021488077-3a921b227daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtb3VudGFpbiUyMGNhYmlufGVufDF8fHx8MTc3MzcyMTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    title: "Downtown Loft",
    location: "New York, NY",
    price: 275,
    rating: 4.7,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1526547050953-b9fe7299eb69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb3dudG93biUyMGNpdHklMjBhcGFydG1lbnQlMjBsb2Z0fGVufDF8fHx8MTc3MzcyMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 4,
    title: "Lakeside Cottage",
    location: "Lake Tahoe, Nevada",
    price: 200,
    rating: 4.9,
    reviews: 93,
    image:
      "https://images.unsplash.com/photo-1684602766513-7d0694cd5bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlc2lkZSUyMGNvdHRhZ2UlMjBob21lfGVufDF8fHx8MTc3MzcyMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  }
];

const popularDestinations = [
  { name: "Miami Beach", properties: 234 },
  { name: "Los Angeles", properties: 456 },
  { name: "New York City", properties: 567 },
  { name: "San Francisco", properties: 289 },
  { name: "Seattle", properties: 198 },
  { name: "Austin", properties: 176 }
];

export const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Perfect Vacation Rental
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Discover unique places to stay around the world
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Where are you going?"
                  className="flex-1 outline-none text-gray-900"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3 border-b md:border-b-0 md:border-r border-gray-200">
                <input
                  type="text"
                  placeholder="Check-in - Check-out"
                  className="flex-1 outline-none text-gray-900"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-3">
                <input
                  type="text"
                  placeholder="Guests"
                  className="flex-1 outline-none text-gray-900"
                />
              </div>
              <Link to="/user/properties">
                <Button size="lg" className="w-full md:w-auto">
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Featured Properties
            </h2>
            <p className="mt-1 text-gray-600">
              Handpicked properties for your next getaway
            </p>
          </div>
          <Link to="/user/properties">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProperties.map((property) => (
            <Link
              key={property.id}
              to={`/user/properties/${property.id}`}
              className="block"
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm font-medium">
                        {property.rating}
                      </span>
                      <span className="ml-1 text-sm text-gray-500">
                        ({property.reviews})
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-semibold text-gray-900">
                        ${property.price}
                      </span>
                      <span className="text-sm text-gray-500">/night</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularDestinations.map((destination) => (
              <Link
                key={destination.name}
                to={`/user/properties?location=${encodeURIComponent(
                  destination.name
                )}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-gray-900">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {destination.properties} properties
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-semibold text-gray-900 text-center mb-12">
          Why Choose ChillSpace
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
            <p className="text-gray-600">
              Find the perfect property with our advanced search filters
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Star className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
            <p className="text-gray-600">
              Read authentic reviews from real travelers
            </p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
            <p className="text-gray-600">
              Get competitive rates with no hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};