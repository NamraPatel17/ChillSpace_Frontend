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

  const handleAction = async (verificationId, action) => {
    setProcessingId(verificationId);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.patch(`/admin/verifications/${action}`, { verificationId }, {
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
              <div key={user.verificationId} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm flex flex-col lg:grid lg:grid-cols-12">
                
                {/* User Info & Actions - 5 columns on desktop */}
                <div className="p-6 lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 bg-gray-100 flex items-center justify-center border-2 border-white shadow-sm">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt="Profile" className="h-full w-full object-cover rounded-full" />
                        ) : (
                          <span className="text-lg font-semibold text-gray-600">{getInitials(user.name)}</span>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-bold text-gray-900 truncate">{user.name}</h3>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                        {user.role}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-0.5">Submitted</p>
                        <p className="text-xs font-semibold text-gray-700">{user.submittedAt}</p>
                      </div>
                      <div className="p-2.5 bg-gray-50 rounded-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-0.5">ID</p>
                        <p className="text-xs font-mono text-gray-700 truncate">{user.id.slice(-8)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 mt-6 lg:mt-0">
                    <Button 
                      onClick={() => handleAction(user.verificationId, "approve")}
                      disabled={processingId === user.verificationId}
                      className="bg-green-600 hover:bg-green-700 text-white flex-1 h-10 text-xs font-bold"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-2" />
                      Approve Identity
                    </Button>
                    <Button 
                      onClick={() => handleAction(user.verificationId, "reject")}
                      disabled={processingId === user.verificationId}
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50 flex-1 h-10 text-xs font-bold"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-2" />
                      Reject Scan
                    </Button>
                  </div>
                </div>

                {/* Document Viewer - 7 columns on desktop */}
                <div className="lg:col-span-7 bg-gray-50 flex items-center justify-center relative min-h-[250px] lg:h-[350px]">
                  {user.documentUrl.toLowerCase().endsWith(".pdf") ? (
                    <iframe 
                      src={`${user.documentUrl}#toolbar=0`} 
                      className="w-full h-full" 
                      title="ID Document" 
                    />
                  ) : (
                    <div className="relative w-full h-full group bg-gray-900/5">
                      <img 
                        src={user.documentUrl} 
                        alt="Gov ID Scan" 
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4 text-center">
                        <p className="text-white text-xs font-medium">Original Document Scan</p>
                        <a 
                          href={user.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="px-4 py-2 bg-white text-gray-900 rounded-full text-xs font-bold shadow-xl hover:bg-indigo-50 transition-colors"
                        >
                          View Full Resolution
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
