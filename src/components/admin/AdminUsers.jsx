import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Search, MoreVertical, UserCheck, UserX, X, ShieldCheck, AlertTriangle, UserPlus, Trash2, Eye } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { CustomDropdown } from "../../components/ui/CustomDropdown";
import { CustomSelect } from "../../components/ui/custom-select";
import { ConfirmationModal } from "../../components/ui/ConfirmationModal";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState({
    users: [],
    stats: { total: 0, activeHosts: 0, suspended: 0 }
  });
  const [loading, setLoading] = useState(true);
  
  // Confirmation Modal State
  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });

  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ fullName: "", email: "", password: "", role: "Guest" });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      setAddError(null);
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.post("/users/register", addForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("User created successfully");
      fetchUsers();
      setShowAddModal(false);
      setAddForm({ fullName: "", email: "", password: "", role: "Guest" });
    } catch (err) {
      setAddError(err.response?.data?.message || "Failed to create user.");
      toast.error("User creation failed");
    } finally {
      setAddLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleVerifyUser = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      title: "Verify User",
      message: `Are you sure you want to verify ${userName}? This will allow them to host properties.`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/admin/users/${userId}/verify`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`User ${userName} verified successfully!`);
          fetchUsers();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          toast.error("Failed to verify user.");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleSuspendUser = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      title: "Suspend User",
      message: `Suspended users cannot log in or manage bookings. Suspend ${userName}?`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/admin/users/${userId}/suspend`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.info(`User ${userName} suspended.`);
          fetchUsers();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          toast.error("Failed to suspend user.");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleUnsuspendUser = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      title: "Reactivate User",
      message: `Reactiving ${userName} will restore their access to the platform.`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/admin/users/${userId}/unsuspend`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`User ${userName} reactivated.`);
          fetchUsers();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          toast.error("Failed to reactivate user.");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const handleDeleteUser = (userId, userName) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Account",
      message: `Are you sure you want to permanently delete ${userName}? This action is irreversible.`,
      loading: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, loading: true }));
        try {
          const token = localStorage.getItem("token") || sessionStorage.getItem("token");
          await axios.put(`/admin/users/${userId}/delete`, {}, {
            headers: { Authorization: `Bearer ${token}` }
          });
          toast.success(`User ${userName} deleted.`);
          fetchUsers();
          setConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null, loading: false });
        } catch (err) {
          toast.error("Failed to delete user.");
          setConfirmModal(prev => ({ ...prev, loading: false }));
        }
      }
    });
  };

  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading platform users...</div>;

  return (
    <div className="space-y-6">
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        isLoading={confirmModal.loading}
        variant={confirmModal.title.toLowerCase().includes("delete") || confirmModal.title.toLowerCase().includes("suspend") ? "danger" : "primary"}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-gray-900">User Management</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage hosts and guests on your platform
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Add New User
          </Button>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Create New Account</h3>
              <button onClick={() => { setShowAddModal(false); setAddError(null); }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            {addError && <p className="text-sm text-red-600 mb-4 bg-red-50 p-3 rounded-lg border border-red-100">{addError}</p>}
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="addFullName">Full Name</Label>
                <Input id="addFullName" required value={addForm.fullName} onChange={e => setAddForm(p => ({...p, fullName: e.target.value}))} placeholder="Jane Doe" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addEmail">Email Address</Label>
                <Input id="addEmail" type="email" required value={addForm.email} onChange={e => setAddForm(p => ({...p, email: e.target.value}))} placeholder="jane@example.com" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addPassword">Secure Password</Label>
                <Input id="addPassword" type="password" required value={addForm.password} onChange={e => setAddForm(p => ({...p, password: e.target.value}))} placeholder="Min. 6 characters" className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="addRole">Account Role</Label>
                <CustomSelect
                  options={[
                    { label: "Guest", value: "Guest" },
                    { label: "Host", value: "Host" },
                    { label: "Admin", value: "Admin" }
                  ]}
                  value={addForm.role}
                  onChange={(val) => setAddForm(p => ({...p, role: val}))}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={() => { setShowAddModal(false); setAddError(null); }}>Cancel</Button>
                <Button type="submit" className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white" disabled={addLoading}>{addLoading ? "Processing..." : "Create User"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Users", value: data.stats.total, icon: UserPlus, color: "text-gray-900", bg: "bg-gray-50" },
          { label: "Active Hosts", value: data.stats.activeHosts, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Suspended", value: data.stats.suspended, icon: UserX, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                   <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle>All User Accounts</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-72 rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">User</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Activity</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Joined</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-indigo-50/30 transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        variant="outline" 
                        className={
                          user.role === "Admin" ? "bg-purple-100 text-purple-800 border-0 font-bold" :
                          user.role === "Host" ? "bg-blue-100 text-blue-800 border-0 font-bold" :
                          "bg-gray-100 text-gray-800 border-0 font-bold"
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1.5">
                        <Badge variant={user.verified ? "success" : "secondary"} className="border-0">
                          {user.verified ? "Verified" : "Unverified"}
                        </Badge>
                        {user.status === "Suspended" && (
                          <Badge className="bg-amber-100 text-amber-800 border-0 font-bold">
                            Suspended
                          </Badge>
                        )}
                        {user.status === "Deleted" && (
                          <Badge className="bg-gray-900 text-white border-0 font-bold">
                            Deleted
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xs font-bold text-gray-900">
                          {user.role === "Host" ? user.properties : user.bookings}
                        </span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          {user.role === "Host" ? "Properties" : "Bookings"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-xs text-gray-500 font-medium">{user.joined}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <CustomDropdown 
                        items={[
                          {
                            label: user.status === "Suspended" ? "Activate User" : "Suspend User",
                            icon: user.status === "Suspended" ? UserCheck : UserX,
                            onClick: () => user.status === "Suspended" 
                              ? handleUnsuspendUser(user.id, user.name) 
                              : handleSuspendUser(user.id, user.name)
                          },
                          {
                            label: "Delete User",
                            icon: Trash2,
                            variant: "danger",
                            onClick: () => handleDeleteUser(user.id, user.name)
                          }
                        ]}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="py-12 text-center text-sm text-gray-400 font-medium italic">No users matching search criteria...</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
