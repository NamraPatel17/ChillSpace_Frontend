import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Upload, X, Check } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { CustomSelect } from "../../components/ui/custom-select";
import axios from "axios";

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // URLs already on Cloudinary
  const [newImageFiles, setNewImageFiles] = useState([]);   // New local File objects
  const [newImagePreviews, setNewImagePreviews] = useState([]); // Preview URLs
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    maxGuests: 1,
    description: "",
    street: "",
    city: "",
    country: "",
    pricePerNight: "",
    amenities: [],
    availabilityStatus: true,
    houseRules: "",
    checkInTime: "3:00 PM",
    checkOutTime: "11:00 AM",
    cancellationPolicy: "Flexible",
  });

  const propertyTypes = ["House", "Apartment", "Villa"];
  const amenitiesList = [
    { id: "WiFi", label: "WiFi", icon: "📶" },
    { id: "Parking", label: "Free Parking", icon: "🅿️" },
    { id: "Kitchen", label: "Kitchen", icon: "🍳" },
    { id: "TV", label: "TV", icon: "📺" },
    { id: "AC", label: "Air Conditioning", icon: "❄️" },
    { id: "Heating", label: "Heating", icon: "🔥" },
    { id: "Washer", label: "Washer", icon: "🧺" },
    { id: "Dryer", label: "Dryer", icon: "👕" },
    { id: "Pool", label: "Swimming Pool", icon: "🏊" },
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/properties/${id}`);
        const p = res.data;
        setFormData({
          title: p.title || "",
          propertyType: p.propertyType || "",
          maxGuests: p.maxGuests || 1,
          description: p.description || "",
          street: p.street || "",
          city: p.city || "",
          country: p.country || "",
          pricePerNight: p.pricePerNight || "",
          amenities: p.amenities || [],
          availabilityStatus: p.availabilityStatus !== false,
          houseRules: Array.isArray(p.houseRules) ? p.houseRules.join("\n") : (p.houseRules || ""),
          checkInTime: p.checkInTime || "3:00 PM",
          checkOutTime: p.checkOutTime || "11:00 AM",
          cancellationPolicy: p.cancellationPolicy || "Flexible",
        });
        setExistingImages(p.images || []);
      } catch (err) {
        setError("Failed to load property data.");
      } finally {
        setFetching(false);
      }
    };
    fetchProperty();
  }, [id]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  // Remove an existing Cloudinary image
  const removeExistingImage = (url) => {
    setExistingImages(prev => prev.filter(img => img !== url));
  };

  // Add new local image files
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => URL.createObjectURL(f));
    setNewImageFiles(prev => [...prev, ...files]);
    setNewImagePreviews(prev => [...prev, ...previews]);
    e.target.value = "";
  };

  // Remove a new (not-yet-uploaded) image
  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const combinedLocation = [formData.city, formData.country].filter(Boolean).join(", ");

      const payload = new FormData();
      // Append all text fields
      Object.entries({ ...formData, location: combinedLocation || formData.city }).forEach(([key, val]) => {
        if (Array.isArray(val)) {
          val.forEach(v => payload.append(key, v));
        } else {
          payload.append(key, val);
        }
      });
      // Send kept existing image URLs so backend knows which to keep
      payload.append("keepImages", JSON.stringify(existingImages));
      // Attach new files
      newImageFiles.forEach(file => payload.append("images", file));

      await axios.put(`/properties/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate("/host/properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update property.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-6 text-gray-500">Loading property details...</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link to="/host/properties" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Property</h1>
          <p className="mt-1 text-sm text-gray-600">Update your listing details</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

          <div className="space-y-2">
            <Label htmlFor="title">Property Name *</Label>
            <Input id="title" required value={formData.title} onChange={handleInputChange} placeholder="e.g., Luxury Beach Villa" />
          </div>

          <div className="space-y-2">
            <Label>Property Type *</Label>
            <CustomSelect
              options={propertyTypes}
              value={formData.propertyType}
              onChange={(val) => setFormData(prev => ({ ...prev, propertyType: val }))}
              placeholder="Select property type"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxGuests">Max Guests *</Label>
            <Input id="maxGuests" type="number" min="1" value={formData.maxGuests} onChange={handleInputChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Describe your property..."
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Location</h2>
          <div className="space-y-2">
            <Label htmlFor="street">Street Address / Area</Label>
            <Input id="street" value={formData.street} onChange={handleInputChange} placeholder="e.g., 123 Ocean Drive" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input id="city" required value={formData.city} onChange={handleInputChange} placeholder="e.g., Miami" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Input id="country" required value={formData.country} onChange={handleInputChange} placeholder="e.g., United States" />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">Current Images ({existingImages.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {existingImages.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video">
                    <img src={url} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New image previews */}
          {newImagePreviews.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2 font-medium">New Images to Upload ({newImagePreviews.length})</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {newImagePreviews.map((url, i) => (
                  <div key={i} className="relative group rounded-lg overflow-hidden border-2 border-dashed border-blue-300 aspect-video">
                    <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeNewImage(i)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleNewImages}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center justify-center text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <Upload className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">Click to add new images</span>
            <span className="text-xs mt-1">JPG, PNG, WebP — up to 5 new files</span>
          </button>
        </div>

        {/* Amenities */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {amenitiesList.map((amenity) => (
              <div key={amenity.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <Checkbox id={`edit-${amenity.id}`} checked={formData.amenities.includes(amenity.id)} onCheckedChange={() => toggleAmenity(amenity.id)} />
                <label htmlFor={`edit-${amenity.id}`} className="flex items-center flex-1 cursor-pointer">
                  <span className="text-2xl mr-3">{amenity.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{amenity.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing & Availability */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Pricing & Availability</h2>
          <div className="space-y-2">
            <Label htmlFor="pricePerNight">Price Per Night ($) *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <Input id="pricePerNight" type="number" min="0" required value={formData.pricePerNight} onChange={handleInputChange} placeholder="100" className="pl-7" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="availabilityStatus"
              checked={formData.availabilityStatus}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, availabilityStatus: !!checked }))}
            />
            <Label htmlFor="availabilityStatus" className="cursor-pointer">Property is available for booking</Label>
          </div>
        </div>

        {/* Policies & Rules */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Rules & Policies</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="checkInTime">Check-in Time</Label>
              <Input id="checkInTime" value={formData.checkInTime} onChange={handleInputChange} placeholder="3:00 PM" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="checkOutTime">Check-out Time</Label>
              <Input id="checkOutTime" value={formData.checkOutTime} onChange={handleInputChange} placeholder="11:00 AM" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <CustomSelect 
              options={["Flexible", "Moderate", "Strict"]} 
              value={formData.cancellationPolicy}
              onChange={(val) => setFormData(prev => ({...prev, cancellationPolicy: val}))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="houseRules">House Rules</Label>
            <textarea
              id="houseRules"
              rows={4}
              value={formData.houseRules}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="e.g. No smoking, No pets, etc. (New line for each rule)"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-4">
          <Link to="/host/properties">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
