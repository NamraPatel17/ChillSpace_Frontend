import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Search, MoreVertical, UserCheck, UserX } from "lucide-react";
import axios from "axios";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    users: [],
    stats: { total: 0, activeHosts: 0, suspended: 0 }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const res = await axios.get("/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Failed to load global users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading platform users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage hosts and guests on your platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button>Add New User</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Hosts</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.activeHosts}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.suspended}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="mt-4 sm:mt-0 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Joined</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.role === "Host" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant={user.status === "Active" ? "default" : "destructive"}
                        className={user.status === "Active" ? "bg-green-100 text-green-800 border-green-200" : ""}
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {user.role === "Host" ? `${user.properties} properties` : `${user.bookings} bookings`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{user.joined}</span>
                    </td>
                    <td className="py-4 px-4">
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="py-6 text-center text-sm text-gray-500">No users found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
