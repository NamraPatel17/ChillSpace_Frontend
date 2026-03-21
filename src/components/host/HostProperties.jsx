import { Plus, MapPin, Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/hosts/properties", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProperties(res.data || []);
      } catch (error) {
        console.error("Failed to fetch host properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="p-6">Loading properties...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Properties</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your vacation rental listings
          </p>
        </div>
        <Link to="/host/properties/add" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 bg-gray-900 text-white hover:bg-black">
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </Link>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-full text-center py-10 text-gray-500">
             You haven't added any properties yet. Click "Add Property" to get started!
          </div>
        ) : properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Image */}
            <div className="relative h-48 bg-gray-100">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-full ${
                  property.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {property.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1 line-clamp-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {property.location}
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div>
                  <p className="text-2xl font-semibold text-gray-900">
                    {property.price}
                    <span className="text-sm text-gray-600 font-normal">
                      /night
                    </span>
                  </p>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  ⭐ {property.rating > 0 ? property.rating.toFixed(1) : "New"}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Bookings</p>
                  <p className="font-semibold text-gray-900">
                    {property.bookings}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Views</p>
                  <p className="font-semibold text-gray-900">
                    {property.views}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="flex items-center justify-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
