import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CustomDropdown } from "../ui/CustomDropdown";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import PageLoader from "../ui/PageLoader";
import { toast } from "react-toastify";
import { MoreVertical, Star, MapPin, Trash2, Eye, ShieldAlert, ShieldCheck, Plus, Edit } from "lucide-react";

export default function HostProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, propertyId: null, propertyName: "" });

  const handleDelete = async () => {
    const { propertyId } = deleteModal;
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`/properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProperties(prev => prev.filter(p => p.id !== propertyId));
      toast.success("Property deleted successfully");
      setDeleteModal({ isOpen: false, propertyId: null, propertyName: "" });
    } catch (err) {
      toast.error("Failed to delete property");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/hosts/properties", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setProperties(res.data || []);
      } catch (error) {
        console.error("Properties Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <PageLoader variant="cards" />;
  }

  return (
    <div className="space-y-6">
      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Property"
        message={`Are you sure you want to delete "${deleteModal.propertyName}"? This action cannot be undone.`}
        confirmText="Delete"
        isLoading={loading && deleteModal.isOpen}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Properties</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your vacation rental listings
          </p>
        </div>
        <Link to="/host/properties/add" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 shadow-sm">
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
            className="relative bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
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
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">
                      {property.name}
                    </h3>
                    <CustomDropdown
                      items={[
                        {
                          label: "Edit Property",
                          icon: Edit,
                          onClick: () => navigate(`/host/properties/edit/${property.id}`)
                        },
                        {
                          label: "Delete Property",
                          icon: Trash2,
                          variant: "danger",
                          onClick: () => setDeleteModal({ isOpen: true, propertyId: property.id, propertyName: property.name })
                        }
                      ]}
                    />
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1 line-clamp-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    {property.location}
                  </div>
                </div>
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

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-600">Bookings</p>
                  <p className="font-semibold text-gray-900">{property.bookings}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
