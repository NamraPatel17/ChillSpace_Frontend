import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { MapPin, Star, Filter, Grid, List, ChevronDown, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { DatePicker } from "../ui/datepicker";
import axios from "axios";
import { toast } from "react-toastify";
import { CustomSelect } from "../ui/custom-select";

export default function SearchPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedBedrooms, setSelectedBedrooms] = useState("Any");
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState("Recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating: High to Low"];
  
  // URL Param Initializations
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchLocation, setSearchLocation] = useState(searchParams.get("location") || "");
  const [searchCheckIn, setSearchCheckIn] = useState(searchParams.get("checkIn") || "");
  const [searchCheckOut, setSearchCheckOut] = useState(searchParams.get("checkOut") || "");
  const [searchGuests, setSearchGuests] = useState(searchParams.get("guests") || "");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        
        // Search Inputs
        if (searchLocation.trim()) params.append("location", searchLocation.trim());
        if (searchCheckIn) params.append("checkIn", searchCheckIn);
        if (searchCheckOut) params.append("checkOut", searchCheckOut);
        if (searchGuests) params.append("guests", searchGuests);
        
        // Price parsing
        params.append("minPrice", priceRange[0]);
        params.append("maxPrice", priceRange[1]);
        
        if (selectedTypes.length > 0) {
          params.append("propertyType", selectedTypes.join(","));
        }
        
        if (selectedBedrooms !== "Any") {
          params.append("minBedrooms", selectedBedrooms.replace("+", ""));
        }
        
        if (selectedAmenities.length > 0) {
          params.append("amenities", selectedAmenities.join(","));
        }

        const res = await axios.get(`/properties?${params.toString()}`);
        
        // Handle sorting natively
        let sortedData = [...res.data];
        if (sortBy === "Price: Low to High") sortedData.sort((a, b) => a.pricePerNight - b.pricePerNight);
        if (sortBy === "Price: High to Low") sortedData.sort((a, b) => b.pricePerNight - a.pricePerNight);
        if (sortBy === "Rating: High to Low") sortedData.sort((a, b) => b.rating - a.rating);

        setProperties(sortedData);
      } catch (err) {
        toast.error("Failed to load properties from database");
      } finally {
        setLoading(false);
      }
    };
    
    // Slight debounce for slider
    const delayDebounceFn = setTimeout(() => {
      fetchProperties();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [priceRange, selectedTypes, selectedBedrooms, selectedAmenities, sortBy, searchLocation, searchCheckIn, searchCheckOut, searchGuests]);

  const toggleType = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };
  
  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]);
  };
  
  const clearFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedTypes([]);
    setSelectedBedrooms("Any");
    setSelectedAmenities([]);
    setSortBy("Recommended");
    setSearchLocation("");
    setSearchCheckIn("");
    setSearchCheckOut("");
    setSearchGuests("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>

              {/* Location */}
              <div className="mb-6">
                <Label className="mb-3 block">Location</Label>
                <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-gray-900">
                  <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                  <input
                    type="text"
                    id="filterLocation"
                    name="filterLocation"
                    placeholder="City, region, or zip"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-900 w-full"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="mb-6">
                <Label className="mb-3 block">Dates</Label>
                <div className="flex flex-col gap-3">
                  <DatePicker
                    value={searchCheckIn}
                    onChange={setSearchCheckIn}
                    placeholder="Check in"
                  />
                  <DatePicker
                    value={searchCheckOut}
                    onChange={setSearchCheckOut}
                    placeholder="Check out"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="mb-6">
                <Label className="mb-3 block text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Guests</Label>
                <CustomSelect
                  options={Array.from({ length: 15 }, (_, i) => ({ 
                    label: `${i + 1} ${i === 0 ? 'Guest' : 'Guests'}`, 
                    value: (i + 1).toString() 
                  }))}
                  value={searchGuests}
                  onChange={setSearchGuests}
                  placeholder="Any guests"
                />
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="mb-4 block">Price Range</Label>
                <Slider
                  id="priceSlider"
                  name="priceRange"
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={1000}
                  step={10}
                  className="mb-2"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Property Type */}
              <div className="mb-6">
                <Label className="mb-3 block">Property Type</Label>
                <div className="space-y-2">
                  {["House", "Apartment", "Villa", "Cabin", "Cottage"].map(
                    (type) => (
                      <div key={type} className="flex items-center">
                        <Checkbox 
                          id={`type-${type.replace(/\s+/g, '-')}`} 
                          name={`type-${type.replace(/\s+/g, '-')}`} 
                          checked={selectedTypes.includes(type)}
                          onCheckedChange={() => toggleType(type)}
                        />
                        <label
                          htmlFor={`type-${type.replace(/\s+/g, '-')}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {type}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Bedrooms */}
              <div className="mb-6">
                <Label className="mb-3 block">Bedrooms</Label>
                <div className="flex flex-wrap gap-2">
                  {["Any", "1+", "2+", "3+", "4+"].map((bed) => (
                    <Button
                      key={bed}
                      variant={selectedBedrooms === bed ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedBedrooms(bed)}
                      className="flex-1 min-w-[3rem] px-2 text-xs"
                    >
                      {bed}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <Label className="mb-3 block">Amenities</Label>
                <div className="space-y-2">
                  {["WiFi", "Pool", "Parking", "Kitchen", "Pet Friendly"].map(
                    (amenity) => (
                      <div key={amenity} className="flex items-center">
                        <Checkbox 
                          id={`amenity-${amenity.replace(/\s+/g, '-')}`} 
                          name={`amenity-${amenity.replace(/\s+/g, '-')}`} 
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <label
                          htmlFor={`amenity-${amenity.replace(/\s+/g, '-')}`}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {amenity}
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Results */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 sm:gap-4 mb-6">
            <div className="flex-1 min-w-0">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 mb-2 transition-colors group"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
                Back
              </button>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                {properties.length} Properties Found
              </h2>
              <p className="text-sm text-gray-600 mt-1 hidden sm:block">
                Based on your search criteria
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <CustomSelect
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
                className="w-36 sm:w-48"
              />
              <div className="hidden sm:flex border border-gray-300 rounded-lg overflow-hidden bg-white">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="!rounded-none !border-0 !shadow-none !m-0 !h-full"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <div className="w-[1px] bg-gray-200" />
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="!rounded-none !border-0 !shadow-none !m-0 !h-full"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {loading ? (
             <div className="text-center py-20 text-gray-500">Loading properties from database...</div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property._id} to={`/user/properties/${property._id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <ImageWithFallback
                        src={property.images?.[0] || "https://images.unsplash.com/photo-1769021488077-3a921b227daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtb3VudGFpbiUyMGNhYmlufGVufDF8fHx8MTc3MzcyMTk3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                        alt={property.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.location}</span>
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        {property.bedrooms || 1} beds • {property.bathrooms || 1} baths •{" "}
                        {property.maxGuests || 2} guests
                      </p>
                      <div className="flex items-center justify-between">
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
                            ₹{property.pricePerNight}
                          </span>
                          <span className="text-sm text-gray-500">/night</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => (
                <Link key={property._id} to={`/user/properties/${property._id}`} className="block">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-64 h-48 flex-shrink-0">
                        <ImageWithFallback
                          src={property.images?.[0] || "https://images.unsplash.com/photo-1684602766513-7d0694cd5bd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYWtlc2lkZSUyMGNvdHRhZ2UlMjBob21lfGVufDF8fHx8MTc3MzcyMTk3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-1">
                              {property.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 flex items-center">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              {property.location}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                              {property.bedrooms || 1} beds • {property.bathrooms || 1}{" "}
                              baths • {property.maxGuests || 2} guests
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {property.amenities?.slice(0, 4).map((amenity) => (
                                <span
                                  key={amenity}
                                  className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700"
                                >
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="flex items-center mb-2 justify-end">
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
                            <div>
                              <span className="text-2xl font-semibold text-gray-900">
                                ₹{property.pricePerNight}
                              </span>
                              <span className="text-sm text-gray-500">
                                /night
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
