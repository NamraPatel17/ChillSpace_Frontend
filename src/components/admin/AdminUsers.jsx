import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Search, MoreVertical, UserCheck, UserX, X } from "lucide-react";
import axios from "axios";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    users: [],
    stats: { total: 0, activeHosts: 0, suspended: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: "", email: "", password: "", role: "Guest" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      setAddError(null);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post("/users/register", addForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Append new user to the list optimistically
      const newUser = {
        id: res.data.data?._id || Date.now(),
        name: addForm.fullName,
        email: addForm.email,
        role: addForm.role,
        verified: false,
        status: "Active",
        bookings: 0,
        properties: 0,
        joined: new Date().toLocaleDateString()
      };
      setData(prev => ({
        ...prev,
        users: [newUser, ...prev.users],
        stats: { ...prev.stats, total: prev.stats.total + 1 }
      }));
      setShowAddModal(false);
      setAddForm({ fullName: "", email: "", password: "", role: "Guest" });
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to create user.");
    } finally {
      setAddLoading(false);
    }
  };

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

  const handleVerifyUser = async (userId, userName) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/admin/users/${userId}/verify`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Immediately reflect state on frontend
      setData(prev => ({
        ...prev,
        users: prev.users.map(u => u.id === userId ? { ...u, verified: true } : u)
      }));
      import('react-toastify').then(({ toast }) => toast.success(`User ${userName} verified successfully!`));
    } catch (err) {
      import('react-toastify').then(({ toast }) => toast.error("Failed to verify user."));
    }
    setOpenMenuId(null);
  };

  const handleSuspendUser = async (userId, userName) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/admin/users/${userId}/suspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Immediately reflect state on frontend
      setData(prev => {
        const newUsers = prev.users.map(u => u.id === userId ? { ...u, status: "Suspended" } : u);
        const hostAdjustment = prev.users.find(u => u.id === userId)?.role === "Host" ? -1 : 0;
        return {
          ...prev,
          users: newUsers,
          stats: {
            ...prev.stats,
            suspended: prev.stats.suspended + 1,
            activeHosts: prev.stats.activeHosts + hostAdjustment
          }
        };
      });
      import('react-toastify').then(({ toast }) => toast.info(`User ${userName} suspended.`));
    } catch (err) {
      import('react-toastify').then(({ toast }) => toast.error("Failed to suspend user."));
    }
    setOpenMenuId(null);
  };

  const handleUnsuspendUser = async (userId, userName) => {
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/admin/users/${userId}/unsuspend`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Immediately reflect state on frontend
      setData(prev => {
        const newUsers = prev.users.map(u => u.id === userId ? { ...u, status: "Active" } : u);
        const hostAdjustment = prev.users.find(u => u.id === userId)?.role === "Host" ? 1 : 0;
        return {
          ...prev,
          users: newUsers,
          stats: {
            ...prev.stats,
            suspended: Math.max(0, prev.stats.suspended - 1),
            activeHosts: prev.stats.activeHosts + hostAdjustment
          }
        };
      });
      import('react-toastify').then(({ toast }) => toast.success(`User ${userName} reactivated.`));
    } catch (err) {
      import('react-toastify').then(({ toast }) => toast.error("Failed to reactivate user."));
    }
    setOpenMenuId(null);
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${userName}?`)) {
      setOpenMenuId(null);
      return;
    }
    
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put(`/admin/users/${userId}/delete`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Immediately reflect state on frontend
      setData(prev => {
        const newUsers = prev.users.map(u => u.id === userId ? { ...u, status: "Deleted" } : u);
        const userWasHost = prev.users.find(u => u.id === userId)?.role === "Host";
        const userWasSuspended = prev.users.find(u => u.id === userId)?.status === "Suspended";
        
        let suspendedAdj = 0;
        let hostAdj = 0;
        if (userWasSuspended) suspendedAdj = -1;
        if (userWasHost && !userWasSuspended) hostAdj = -1;

        return {
          ...prev,
          users: newUsers,
          stats: {
            ...prev.stats,
            suspended: Math.max(0, prev.stats.suspended + suspendedAdj),
            activeHosts: Math.max(0, prev.stats.activeHosts + hostAdj),
            total: prev.stats.total
          }
        };
      });
      import('react-toastify').then(({ toast }) => toast.success(`User ${userName} deleted.`));
    } catch (err) {
      import('react-toastify').then(({ toast }) => toast.error("Failed to delete user."));
    }
    setOpenMenuId(null);
  };

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
          <Button onClick={() => setShowAddModal(true)}>Add New User</Button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New User</h3>
              <button onClick={() => { setShowAddModal(false); setAddError(null); }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            {addError && <p className="text-sm text-red-600 mb-3 bg-red-50 p-2 rounded">{addError}</p>}
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="addFullName">Full Name</Label>
                <Input id="addFullName" required value={addForm.fullName} onChange={e => setAddForm(p => ({...p, fullName: e.target.value}))} placeholder="Jane Doe" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addEmail">Email</Label>
                <Input id="addEmail" type="email" required value={addForm.email} onChange={e => setAddForm(p => ({...p, email: e.target.value}))} placeholder="jane@example.com" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addPassword">Password</Label>
                <Input id="addPassword" type="password" required value={addForm.password} onChange={e => setAddForm(p => ({...p, password: e.target.value}))} placeholder="Min. 6 characters" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="addRole">Role</Label>
                <select id="addRole" value={addForm.role} onChange={e => setAddForm(p => ({...p, role: e.target.value}))} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <option value="Guest">Guest</option>
                  <option value="Host">Host</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowAddModal(false); setAddError(null); }}>Cancel</Button>
                <Button type="submit" className="flex-1" disabled={addLoading}>{addLoading ? "Creating..." : "Create User"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.total}</p>
              </div>
              <UserCheck className="h-8 w-8 text-gray-900" />
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
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === "Admin" ? "bg-purple-100 text-purple-800 border-purple-200" :
                          user.role === "Host" ? "bg-blue-100 text-blue-800 border-blue-200" :
                          "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={user.verified ? "success" : "secondary"}>
                        {user.verified ? "Verified" : "Unverified"}
                      </Badge>
                      {user.status === "Suspended" && (
                        <Badge variant="destructive" className="ml-2 bg-red-100 text-red-800 border-red-200">
                          Suspended
                        </Badge>
                      )}
                      {user.status === "Deleted" && (
                        <Badge variant="destructive" className="ml-2 bg-gray-900 text-white border-gray-950">
                          Deleted
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {user.role === "Host" ? `${user.properties} properties` : `${user.bookings} bookings`}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">{user.joined}</span>
                    </td>
                    <td className="py-4 px-4 relative">
                      <div className="flex flex-row items-center justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                        
                        {openMenuId === user.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)}></div>
                            <div className="absolute right-6 top-10 w-40 bg-white border border-gray-200 shadow-xl rounded-md z-50 py-1 overflow-hidden">
                              {user.role !== "Admin" && (
                                <>
                                  {!user.verified && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors" onClick={() => handleVerifyUser(user.id, user.name)}>
                                      Verify User
                                    </button>
                                  )}
                                  {user.status !== "Suspended" && user.status !== "Deleted" && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors" onClick={() => handleSuspendUser(user.id, user.name)}>
                                      Suspend User
                                    </button>
                                  )}
                                  {user.status === "Suspended" && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 transition-colors" onClick={() => handleUnsuspendUser(user.id, user.name)}>
                                      Unsuspend User
                                    </button>
                                  )}
                                  {user.status !== "Deleted" && (
                                    <button className="w-full text-left px-4 py-2 text-sm text-red-700 font-medium hover:bg-red-100 transition-colors border-t border-gray-100 mt-1" onClick={() => handleDeleteUser(user.id, user.name)}>
                                      Delete Account
                                    </button>
                                  )}
                                  {user.verified && user.status === "Suspended" && (
                                    <div className="px-4 py-2 text-sm text-gray-400 italic bg-gray-50 border-t border-gray-100 mt-1">Status: Suspended</div>
                                  )}
                                  {user.status === "Deleted" && (
                                    <div className="px-4 py-2 text-sm text-gray-400 italic bg-gray-50 border-t border-gray-100 mt-1">Account Deleted</div>
                                  )}
                                </>
                              )}
                              {user.role === "Admin" && (
                                <div className="px-4 py-2 text-sm text-gray-400 italic">No actions available</div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
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
