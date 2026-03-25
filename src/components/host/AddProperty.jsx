import { useState } from "react";
import { ArrowLeft, Upload, X, Plus, Check, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";
import { Checkbox } from "../../components/ui/checkbox";
import { CustomSelect } from "../../components/ui/custom-select";
import axios from "axios";

export default function AddProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    propertyType: "",
    maxGuests: 1,
    description: "",
    street: "",
    city: "",
    country: "",
    location: "",
    pricePerNight: "",
    amenities: []
  });

  // Track raw File objects for upload
  const [imageFiles, setImageFiles] = useState([]);

  // Base state steps
  const steps = [
    { number: 1, title: "Basic Info", description: "Property details" },
    { number: 2, title: "Location", description: "Address & map" },
    { number: 3, title: "Amenities", description: "Features & facilities" },
    { number: 4, title: "Photos", description: "Property images" },
    { number: 5, title: "Pricing", description: "Rates & availability" },
  ];

  // Adjusted to match Mongoose enum exactly
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

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const toggleAmenity = (id) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(id)
        ? prev.amenities.filter((a) => a !== id)
        : [...prev.amenities, id]
    }));
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
      if (imageFiles.length + newFiles.length > 5) {
        alert("Maximum 5 images allowed");
        return;
      }
      // Create preview URLs
      const fileObjects = newFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      setImageFiles(prev => [...prev, ...fileObjects]);
    }
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const publishProperty = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const userId = localStorage.getItem("userId") || sessionStorage.getItem("userId");

      const payload = new FormData();
      payload.append("hostId", userId);
      payload.append("title", formData.title);
      payload.append("propertyType", formData.propertyType);
      payload.append("maxGuests", formData.maxGuests);
      payload.append("description", formData.description);
      payload.append("street", formData.street);
      payload.append("city", formData.city);
      payload.append("country", formData.country);
      // Combine into location string for search/display compatibility
      const combinedLocation = [formData.city, formData.country].filter(Boolean).join(", ");
      payload.append("location", combinedLocation || formData.city);
      payload.append("pricePerNight", formData.pricePerNight);
      
      // Append amenities array
      formData.amenities.forEach(a => payload.append("amenities", a));
      
      // Append images efficiently
      imageFiles.forEach(file => {
        payload.append("images", file);
      });

      const res = await axios.post("/properties", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 201) {
        navigate("/host/properties");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to publish property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/host/properties"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Add New Property
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              List your property on ChillSpace
            </p>
          </div>
        </div>
      </div>

      {error && (
         <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center justify-between">
            {error}
         </div>
      )}

      {/* Progress Steps */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 overflow-x-auto">
        <div className="flex items-center min-w-max md:min-w-0 justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    currentStep > step.number
                      ? "bg-green-600 border-green-600"
                      : currentStep === step.number
                      ? "bg-indigo-600 border-indigo-600"
                      : "bg-white border-gray-300"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        currentStep === step.number
                          ? "text-white"
                          : "text-gray-400"
                      }`}
                    >
                      {step.number}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep > step.number
                        ? "text-green-600"
                        : currentStep === step.number
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500 max-w-[100px]">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 min-w-[30px] ${
                    currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Information
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Name *</Label>
                  <Input
                    id="title"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.title}
                    placeholder="e.g., Luxury Beach Villa with Ocean View"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <CustomSelect
                    options={propertyTypes}
                    value={formData.propertyType}
                    onChange={(val) => setFormData(prev => ({...prev, propertyType: val}))}
                    placeholder="Select property type"
                  />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="maxGuests">Max Guests *</Label>
                    <Input id="maxGuests" type="number" min="1" onChange={handleInputChange} value={formData.maxGuests} placeholder="1" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    rows={6}
                    onChange={handleInputChange}
                    value={formData.description}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder="Describe your property, highlight unique features, nearby attractions, and what makes it special..."
                  />
                  <p className="text-xs text-gray-500">
                    Minimum 100 characters recommended
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Location
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address / Area *</Label>
                  <Input
                    id="street"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.street}
                    placeholder="e.g., 123 Ocean Drive, Beachfront"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      onChange={handleInputChange}
                      value={formData.city}
                      placeholder="e.g., Miami"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      type="text"
                      onChange={handleInputChange}
                      value={formData.country}
                      placeholder="e.g., United States"
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  Your full address is used to describe the property to guests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Amenities */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Amenities
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Select all amenities available at your property
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {amenitiesList.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <Checkbox id={amenity.id} checked={formData.amenities.includes(amenity.id)} onCheckedChange={() => toggleAmenity(amenity.id)} />
                    <label
                      htmlFor={amenity.id}
                      className="flex items-center flex-1 cursor-pointer"
                    >
                      <span className="text-2xl mr-3">{amenity.icon}</span>
                      <span className="text-sm font-medium text-gray-900">
                        {amenity.label}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Photos */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Property Photos
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Upload up to 5 high-quality photos. The first photo will be the cover image.
              </p>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageUpload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-sm font-medium text-gray-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG max 5 photos
                  </p>
                </label>
              </div>

              {/* Uploaded Images Grid */}
              {imageFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Uploaded Photos ({imageFiles.length} / 5)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imageFiles.map((file, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group"
                      >
                        <img
                          src={file.preview}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-gray-900 text-white text-xs px-2 py-1 rounded">
                            Cover Photo
                          </div>
                        )}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 5: Pricing */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Pricing Details
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricePerNight">Base Price Per Night *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="pricePerNight"
                        type="number"
                        min="0"
                        step="1"
                        onChange={handleInputChange}
                        value={formData.pricePerNight}
                        placeholder="100"
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Almost there!
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Review all your information. If you're happy, hit Publish Property below to list it live on ChillSpace immediately!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1 || loading}
          >
            Previous
          </Button>
          <div className="flex items-center space-x-3">
            {currentStep < 5 ? (
              <Button
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              >
                Next Step
              </Button>
            ) : (
              <Button onClick={publishProperty} disabled={loading}>
                {loading ? "Publishing..." : "Publish Property"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
