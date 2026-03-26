import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Home, MapPin, Star, ShieldAlert, ShieldCheck, Eye, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

export default function AdminProperties() {
  const [data, setData] = useState({
    properties: [],
    stats: { total: 0, active: 0, underReview: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Custom Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, isLoading: false });

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("/admin/properties", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load global properties", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.patch(`/properties/${id}/status`, { status: !currentStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Property ${!currentStatus ? 'activated' : 'suspended'}`);
      fetchProperties();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Property",
      message: "Are you sure you want to delete this property forever? This action is permanent and cannot be reversed.",
      isLoading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isLoading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.delete(`/properties/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success("Property deleted successfully");
          fetchProperties();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, isLoading: false });
        } catch (err) {
          toast.error("Failed to delete property");
          setConfirmModal(prev => ({ ...prev, isLoading: false }));
        }
      }
    });
  };

  if (loading) return <div className="p-6">Loading properties...</div>;

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={confirmModal.isLoading}
        variant={confirmModal.title.toLowerCase().includes("delete") ? "danger" : "primary"}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Property Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all property listings on the platform
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
              <Home className="h-8 w-8 text-gray-900" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Listings</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.active}</p>
              </div>
              <Home className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.properties.length > 0 ? data.properties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div 
              className="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative bg-cover bg-center"
              style={property.image ? { backgroundImage: `url(${property.image})` } : {}}
            >
              <Badge variant="secondary" className="absolute top-3 right-3 bg-white text-gray-900 shadow-sm">
                {property.status}
              </Badge>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 max-w-full truncate" title={property.title}>
                  {property.title}
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{property.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 max-w-[60%] truncate">Host: {property.host}</span>
                  <div className="flex items-center flex-shrink-0">
                    <Star className="h-4 w-4 text-gray-900 fill-yellow-400" />
                    <span className="text-sm ml-1">{property.rating}</span>
                  </div>
                </div>
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <div className="flex-1">
                        <p className="text-lg font-semibold text-gray-900">{property.price}</p>
                        <p className="text-xs text-gray-500">{property.bookings} bookings</p>
                      </div>
                      
                      <CustomDropdown 
                        items={[
                          {
                            label: "View Details",
                            icon: Eye,
                            onClick: () => navigate(`/user/properties/${property.id}`)
                          },
                          {
                            label: property.status === 'Active' ? "Suspend Listing" : "Activate Listing",
                            icon: property.status === 'Active' ? ShieldAlert : ShieldCheck,
                            onClick: () => handleStatusToggle(property.id, property.status === 'Active')
                          },
                          {
                            label: "Delete Property",
                            icon: Trash2,
                            variant: "danger",
                            onClick: () => handleDelete(property.id)
                          }
                        ]}
                      />
                    </div>
              </div>
            </CardContent>
          </Card>
        )) : (
          <p className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-6 text-gray-500">
            No properties found on the platform yet.
          </p>
        )}
      </div>
    </div>
  );
}
