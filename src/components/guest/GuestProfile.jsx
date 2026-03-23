import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Phone,
  Shield,
  CreditCard,
  Lock,
  LogOut,
  Save,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Separator } from "../../components/ui/separator";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useNavigate } from "react-router-dom";

export default function GuestProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    createdAt: "",
    verificationStatus: false,
    notificationPreferences: {
      email: true,
      sms: true,
      bookings: true,
      reviews: true,
      marketing: false
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
        
        const res = await axios.get("/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data) {
          setProfile(prev => ({
            ...prev,
            ...res.data,
            notificationPreferences: {
              ...prev.notificationPreferences,
              ...(res.data.notificationPreferences || {})
            }
          }));
        }
      } catch (error) {
        toast.error("Failed to load profile details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleNotificationChange = (key) => {
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [key]: !prev.notificationPreferences[key]
      }
    }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.put("/users/profile", profile, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Profile saved successfully! 🎉");
    } catch (error) {
      toast.error("Failed to save profile. Please try again.");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("role");
    
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-500 font-medium">Loading profile...</p>
      </div>
    );
  }

  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4 bg-gray-100 flex items-center justify-center">
                  <span className="text-3xl font-semibold text-gray-700">
                    {getInitials(profile.fullName)}
                  </span>
                </Avatar>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {profile.fullName || "Guest User"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">{profile.email}</p>
                <div className="flex items-center gap-2 mb-6">
                  {profile.verificationStatus ? (
                    <>
                      <Shield className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        Verified Account
                      </span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500 font-medium">
                        Unverified Account
                      </span>
                    </>
                  )}
                </div>
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-medium">{joinDate}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Settings Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="payment">Payment</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <Input 
                        id="fullName" 
                        value={profile.fullName || ""} 
                        onChange={handleChange}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 text-gray-400 mr-2" />
                      <Input
                        id="email"
                        type="email"
                        value={profile.email || ""}
                        disabled
                        className="flex-1 bg-gray-50 text-gray-500"
                        title="Emails cannot be changed directly"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={profile.phoneNumber || ""}
                        onChange={handleChange}
                        className="flex-1"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About Me</Label>
                    <textarea
                      id="bio"
                      rows={4}
                      value={profile.bio || ""}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="w-full bg-black hover:bg-gray-800">
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Payment Methods */}
            <TabsContent value="payment">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Methods</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-8 w-8 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            •••• •••• •••• 4242
                          </p>
                          <p className="text-sm text-gray-600">Expires 12/2025</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Remove</Button>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    + Add New Payment Method
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Email Updates</p>
                      <p className="text-sm text-gray-600">Receive general email notifications</p>
                    </div>
                    <Switch checked={profile.notificationPreferences.email} onCheckedChange={() => handleNotificationChange('email')} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">SMS Alerts</p>
                      <p className="text-sm text-gray-600">Receive urgent text messages</p>
                    </div>
                    <Switch checked={profile.notificationPreferences.sms} onCheckedChange={() => handleNotificationChange('sms')} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Booking Confirmations</p>
                      <p className="text-sm text-gray-600">Alerts for new bookings and cancellations</p>
                    </div>
                    <Switch checked={profile.notificationPreferences.bookings} onCheckedChange={() => handleNotificationChange('bookings')} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Review Reminders</p>
                      <p className="text-sm text-gray-600">Get notified to review your recent stays</p>
                    </div>
                    <Switch checked={profile.notificationPreferences.reviews} onCheckedChange={() => handleNotificationChange('reviews')} />
                  </div>
                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium text-gray-900">Marketing & Offers</p>
                      <p className="text-sm text-gray-600">Receive exclusive deals and tips</p>
                    </div>
                    <Switch checked={profile.notificationPreferences.marketing} onCheckedChange={() => handleNotificationChange('marketing')} />
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="w-full mt-4 bg-black hover:bg-gray-800">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Preferences"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Security & Account</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4">Account Verification</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-gray-600" />
                          <div>
                            <p className="font-medium text-gray-900">Email Address</p>
                            <p className="text-sm text-gray-600">{profile.email}</p>
                          </div>
                        </div>
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <Button onClick={handleLogout} variant="destructive" className="w-full sm:w-auto mt-2">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
