import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Shield, ShieldCheck, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Avatar } from "../../components/ui/avatar";

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.get("/admin/verifications", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.pendingVerifications) {
        setVerifications(res.data.pendingVerifications);
      }
    } catch (err) {
      toast.error("Failed to load verification queue");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVerifications();
  }, []);

  const handleAction = async (userId, documentId, action) => {
    setProcessingId(documentId);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.patch(`/admin/verifications/${userId}/${action}`, { documentId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Identity verification ${action}d successfully`);
      fetchVerifications();
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to ${action} document`);
    } finally {
      setProcessingId(null);
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  if (loading) return <div className="p-6">Loading verification queue...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <Shield className="h-8 w-8 text-indigo-600" />
          Identity Verification Center
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review securely uploaded Government ID documents to approve Host and Guest identities.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-3xl font-bold text-amber-600">{verifications.length}</p>
            </div>
            <ShieldAlert className="h-10 w-10 text-amber-200" />
          </CardContent>
        </Card>
      </div>

      {/* Verification Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Action Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {verifications.length > 0 ? verifications.map((user) => (
              <div key={user.documentId} className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col md:flex-row gap-6">
                
                {/* User Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 bg-gray-100 flex items-center justify-center border">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover rounded-full" />
                      ) : (
                        <span className="text-xl font-semibold text-gray-600">{getInitials(user.name)}</span>
                      )}
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto bg-gray-50 text-gray-700">
                      {user.role}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <p className="font-medium text-gray-500">Submission Date</p>
                      <p className="text-gray-900">{user.submittedAt}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-500">System Trace ID</p>
                      <p className="text-gray-900 font-mono text-xs mt-0.5">{user.id}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button 
                      onClick={() => handleAction(user.id, user.documentId, "approve")}
                      disabled={processingId === user.documentId}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Identity
                    </Button>
                    <Button 
                      onClick={() => handleAction(user.id, user.documentId, "reject")}
                      disabled={processingId === user.documentId}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 flex-1 flex"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Scan
                    </Button>
                  </div>
                </div>

                {/* Document Viewer (Cloudinary Asset) */}
                <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative min-h-[300px]">
                  {user.documentUrl.toLowerCase().endsWith(".pdf") ? (
                    <iframe 
                      src={`${user.documentUrl}#toolbar=0`} 
                      className="w-full h-full min-h-[400px]" 
                      title="ID Document" 
                    />
                  ) : (
                    <div className="relative w-full h-full group">
                      <img 
                        src={user.documentUrl} 
                        alt="Gov ID Scan" 
                        className="w-full h-full object-contain bg-gray-900/5 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <a href={user.documentUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white text-gray-900 rounded-md text-sm font-medium shadow-lg hover:bg-gray-50">
                          View Full Resolution (New Tab)
                        </a>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200 border-dashed">
                <ShieldCheck className="h-12 w-12 mx-auto text-green-500 mb-3" />
                <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                <p className="text-gray-500 mt-1">There are no pending Government ID verifications in the queue.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
