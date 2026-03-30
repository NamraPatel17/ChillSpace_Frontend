import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Star, TrendingUp, Users, Calendar } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DatePicker } from "../ui/datepicker";
import { CustomSelect } from "../ui/custom-select";
import axios from "axios";

export const Home = () => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [liveDestinations, setLiveDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchCheckIn, setSearchCheckIn] = useState("");
  const [searchCheckOut, setSearchCheckOut] = useState("");
  const [searchGuests, setSearchGuests] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveProperties = async () => {
      try {
        const res = await axios.get("/properties");
        if (res.data && res.data.length > 0) {
           // Show at most 8 properties on the homepage for a 2-line layout
           setFeaturedProperties(res.data.slice(0, 8));

           // Dynamically generate Popular Destinations from the database!
           const cityMap = {};
           res.data.forEach(p => {
             const loc = p.location;
             if (loc) {
               if (!cityMap[loc]) {
                 cityMap[loc] = { 
                   name: loc, 
                   count: 0
                 };
               }
               cityMap[loc].count += 1;
             }
           });
           const sortedCities = Object.values(cityMap).sort((a,b) => b.count - a.count).slice(0, 6);
           setLiveDestinations(sortedCities);
        }
      } catch (error) {
        console.error("Failed to load featured properties from API", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLiveProperties();
  }, []);

  const propertiesToRender = featuredProperties;

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.append('location', searchLocation.trim());
    if (searchCheckIn) params.append('checkIn', searchCheckIn);
    if (searchCheckOut) params.append('checkOut', searchCheckOut);
    if (searchGuests) params.append('guests', searchGuests);
    
    navigate(`/user/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div 
        className="relative text-white py-32 md:py-48"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop')", 
          backgroundSize: "cover", 
          backgroundPosition: "center" 
        }}
      >
        {/* Dark overlay for better text readability and moody aesthetic */}
        <div className="absolute inset-0 bg-black/40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <div className="text-left mb-10 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-semibold mb-4 drop-shadow-2xl leading-tight tracking-tight text-white">
              Explore your place <br/> to stay
            </h1>
          </div>

          {/* Redesigned Search Bar - Translucent Dark Pill Layout */}
          <div className="max-w-5xl bg-[#1e1e1e]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-2 flex flex-col md:flex-row items-center gap-2 border border-white/20">
            
            {/* Location Pill */}
            <div className="flex-[1.2] flex items-center px-6 py-4 bg-[#2a2a2a]/60 hover:bg-[#333333]/80 transition-colors rounded-full w-full">
              <Search className="h-5 w-5 text-gray-400 mr-3 shrink-0" />
              <input
                type="text"
                id="searchLocation"
                name="searchLocation"
                autoComplete="off"
                placeholder="Stavanger, Norway"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 outline-none text-white bg-transparent placeholder-gray-400 text-base [&:-webkit-autofill]:[transition-delay:9999s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
              />
            </div>

            {/* Dates Pill */}
            <div className="flex-[1.5] flex items-center px-5 py-4 bg-[#2a2a2a]/60 hover:bg-[#333333]/80 transition-colors rounded-full w-full gap-2">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0 mr-1" />
              <DatePicker
                value={searchCheckIn}
                onChange={setSearchCheckIn}
                placeholder="Check in"
                variant="dark"
                showIcon={false}
                className="w-1/2 flex-1 !h-auto !py-0"
              />
              <DatePicker
                value={searchCheckOut}
                onChange={setSearchCheckOut}
                placeholder="Checkout"
                variant="dark"
                showIcon={false}
                className="w-1/2 flex-1 !h-auto !py-0"
              />
            </div>

            {/* Guests Pill */}
            <div className="flex-[0.8] flex items-center px-4 py-1.5 bg-[#2a2a2a]/60 hover:bg-[#333333]/80 transition-colors rounded-full w-full">
              <Users className="h-5 w-5 text-gray-400 mr-1 shrink-0 ml-2" />
              <CustomSelect
                variant="dark"
                options={Array.from({ length: 10 }, (_, i) => ({ 
                  label: `${i + 1} ${i === 0 ? 'Guest' : 'Guests'}`, 
                  value: (i + 1).toString() 
                }))}
                value={searchGuests}
                onChange={setSearchGuests}
                placeholder="Guests"
                className="border-0 shadow-none h-auto"
              />
            </div>

            {/* Search Button */}
            <Button 
              size="lg" 
              className="w-full md:w-auto !rounded-full !bg-[#d2a679] hover:!bg-[#c19568] !text-black font-semibold text-lg px-10 py-7 transition-all active:scale-95 shadow-lg flex-shrink-0 border-0" 
              onClick={handleSearch}
            >
              Search
            </Button>
            
          </div>
        </div>
      </div>

      {/* Featured Properties (LIVE DATA ENABLED) */}
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
          <Link to="/user/search">
            <Button variant="outline">View All</Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="text-center py-10 text-gray-500">Loading premium spaces...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertiesToRender.map((property) => (
              <Link 
                key={property._id || property.id} 
                to={`/user/properties/${property._id || property.id}`}
                className="block"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full border border-gray-200 flex flex-col">
                  <div className="relative h-48 bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={(property.images && property.images.length > 0) ? property.images[0] : property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 flex items-center line-clamp-1">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      {property.location}
                    </p>
                    <div className="mt-auto pt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        {property.rating > 0 ? (
                          <>
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium">
                              {Number(property.rating).toFixed(1)}
                            </span>
                          </>
                        ) : (
                          <>
                            <Star className="h-4 w-4 text-gray-300" />
                            <span className="ml-1 text-sm font-medium text-gray-500">
                              New
                            </span>
                          </>
                        )}
                        {property.reviewsCount > 0 && (
                          <span className="ml-1 text-sm text-gray-500">
                            ({property.reviewsCount} reviews)
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-gray-900">
                          ${property.pricePerNight || property.price}
                        </span>
                        <span className="text-sm text-gray-500">/night</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Popular Destinations */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {liveDestinations.map((destination) => (
              <Link
                key={destination.name}
                to={`/user/search?location=${encodeURIComponent(
                  destination.name
                )}`}
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <h3 className="font-medium text-gray-900 truncate">
                      {destination.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {destination.count} {destination.count === 1 ? 'property' : 'properties'}
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-900" />
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