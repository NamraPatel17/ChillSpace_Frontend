import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";

const statusConfig = {
  pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
  "in-progress": { color: "bg-blue-100 text-blue-800", icon: MessageSquare },
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

  useEffect(() => {
    const fetchDisputes = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/disputes", {
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
  }, []);

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
          <select className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
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
              <div className="p-3 rounded-lg bg-blue-50">
                <AlertCircle className="h-6 w-6 text-blue-600" />
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
                          {dispute.id}
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
                        <span>Guest: {dispute.guest}</span>
                        <span>•</span>
                        <span>Host: {dispute.host}</span>
                        <span>•</span>
                        <span>{dispute.property}</span>
                        <span>•</span>
                        <span>{dispute.date}</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {dispute.status === "pending" && (
                        <Button size="sm">Take Action</Button>
                      )}
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
