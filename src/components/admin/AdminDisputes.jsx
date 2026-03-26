import { MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, CheckSquare, Search, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomSelect } from "../../components/ui/custom-select";
import { toast } from "react-toastify";
import { CustomDropdown } from "../../components/ui/CustomDropdown";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "in-progress": { color: "bg-gray-100 text-blue-800", icon: MessageSquare },
  resolved: { color: "bg-green-100 text-green-800", icon: CheckCircle },
};

const priorityConfig = {
  high: "bg-red-100 text-red-800",
  medium: "bg-orange-100 text-orange-800",
  low: "bg-gray-100 text-gray-800",
};

export default function AdminDisputes() {
  const [data, setData] = useState({ disputes: [], stats: { pending: 0, inProgress: 0, resolved: 0 } });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get(`/disputes/admin?status=${statusFilter}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load global disputes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDisputes();
  }, [statusFilter]);

  const updateDisputeStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/disputes/admin/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refresh list
      const res = await axios.get(`/disputes/admin?status=${statusFilter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
      toast.success("Dispute status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading disputes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">Disputes</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage and resolve disputes between hosts and guests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CustomSelect
            options={[
              { value: "all", label: "All Status" },
              { value: "pending", label: "Pending" },
              { value: "in-progress", label: "In Progress" },
              { value: "resolved", label: "Resolved" }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
            className="w-40"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-50">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-50">
                <AlertCircle className="h-6 w-6 text-gray-900" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.resolved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disputes List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Disputes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.disputes.length > 0 ? data.disputes.map((dispute) => {
              const StateObj = statusConfig[dispute.status] || statusConfig["pending"];
              const StatusIcon = StateObj.icon;
              return (
                <div
                  key={dispute.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          ID: {dispute.id.slice(-6)}
                        </span>
                        <Badge
                          className={StateObj.color}
                        >
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {dispute.status}
                        </Badge>
                        <Badge className={priorityConfig[dispute.priority] || priorityConfig['low']}>
                          {dispute.priority}
                        </Badge>
                      </div>
                      <h3 className="font-medium text-gray-900 mb-1">
                        {dispute.issue}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {dispute.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>By: {dispute.guest} ({dispute.guestEmail})</span>
                        <span>•</span>
                        <span>Against: {dispute.host}</span>
                        <span>•</span>
                        <span>{dispute.property}</span>
                        <span>•</span>
                        <span>{dispute.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center ml-4">
                      <CustomDropdown
                        items={[
                          ...(dispute.status === "pending" ? [{
                            label: "Investigate",
                            icon: Search,
                            onClick: () => updateDisputeStatus(dispute.id, "in-progress")
                          }] : []),
                          ...(dispute.status !== "resolved" ? [{
                            label: "Resolve Dispute",
                            icon: CheckSquare,
                            onClick: () => updateDisputeStatus(dispute.id, "resolved")
                          }] : []),
                          {
                            label: "View Listing",
                            icon: Eye,
                            onClick: () => {} // Placeholder
                          }
                        ]}
                      />
                    </div>
                  </div>
                </div>
              );
            }) : (
              <p className="text-center text-sm text-gray-500 py-4">No critical disputes to review right now.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
