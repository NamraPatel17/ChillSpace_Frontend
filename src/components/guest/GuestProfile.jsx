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
  Star,
  Camera,
  Loader2,
  ArrowLeft
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
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [hostReviews, setHostReviews] = useState([]);
  
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
    },
    paymentMethod: {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: ""
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
            },
            paymentMethod: {
              ...prev.paymentMethod,
              ...(res.data.paymentMethod || {})
            }
          }));
        }

        const reviewsRes = await axios.get("/reviews/me/guest", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (reviewsRes.data) {
          setHostReviews(reviewsRes.data);
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
    if (id.startsWith("payment_")) {
      const paymentField = id.split("_")[1];
      setProfile(prev => ({
        ...prev,
        paymentMethod: {
          ...prev.paymentMethod,
          [paymentField]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [id]: value
      }));
    }
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post("/users/profile/photo", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      setProfile(prev => ({
        ...prev,
        profilePicture: res.data.profilePicture
      }));
      
      toast.success("Profile photo updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("document", file);

    setUploadingDoc(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const res = await axios.post("/users/verification/document", formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data" 
        }
      });
      
      setProfile(prev => ({
        ...prev,
        verificationStatus: false,
        verificationPending: true
      }));
      
      toast.success("Document securely uploaded and queued for Admin review!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload verification document");
    } finally {
      setUploadingDoc(false);
    }
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

  const joinDate = profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-GB') : "Recently";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 mb-4 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>
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
                <div className="relative group mb-4">
                  <Avatar className="h-24 w-24 bg-gray-100 flex items-center justify-center border-4 border-white shadow-sm overflow-hidden">
                    {profile.profilePicture ? (
                      <img 
                        src={profile.profilePicture} 
                        alt={profile.fullName} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-semibold text-gray-700">
                        {getInitials(profile.fullName)}
                      </span>
                    )}
                  </Avatar>
                  
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer overflow-hidden z-10">
                    {uploadingPhoto ? (
                      <Loader2 className="w-6 h-6 animate-spin text-white" />
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoUpload} 
                      disabled={uploadingPhoto}
                    />
                  </label>
                </div>
                
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
        <div className="lg:col-span-2 min-w-0 w-full">
          <Tabs defaultValue="personal" className="space-y-6 w-full">
            <div className="w-full overflow-x-auto">
              <TabsList className="flex h-auto gap-1 p-1 min-w-max">
                <TabsTrigger value="personal" className="py-2 px-3 whitespace-nowrap flex-shrink-0 text-sm">Personal</TabsTrigger>
                <TabsTrigger value="payment" className="py-2 px-3 whitespace-nowrap flex-shrink-0 text-sm">Payment</TabsTrigger>
                <TabsTrigger value="notifications" className="py-2 px-3 whitespace-nowrap flex-shrink-0 text-sm">Notifications</TabsTrigger>
                <TabsTrigger value="security" className="py-2 px-3 whitespace-nowrap flex-shrink-0 text-sm">Security</TabsTrigger>
                <TabsTrigger value="reviews" className="py-2 px-3 whitespace-nowrap flex-shrink-0 text-sm">Reviews</TabsTrigger>
              </TabsList>
            </div>

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
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="payment_nameOnCard">Name on Card</Label>
                      <Input
                        id="payment_nameOnCard"
                        type="text"
                        value={profile.paymentMethod?.nameOnCard || ""}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment_cardNumber">Card Number</Label>
                      <Input
                        id="payment_cardNumber"
                        type="text"
                        value={profile.paymentMethod?.cardNumber || ""}
                        onChange={handleChange}
                        placeholder="•••• •••• •••• ••••"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="payment_expiryDate">Expiry Date</Label>
                        <Input
                          id="payment_expiryDate"
                          type="text"
                          value={profile.paymentMethod?.expiryDate || ""}
                          onChange={handleChange}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_cvv">CVV</Label>
                        <Input
                          id="payment_cvv"
                          type="password"
                          value={profile.paymentMethod?.cvv || ""}
                          onChange={handleChange}
                          placeholder="•••"
                        />
                      </div>
                    </div>
                  </div>

                  <Button onClick={saveProfile} disabled={saving} className="w-full bg-black hover:bg-gray-800 mt-4">
                    {saving ? "Saving..." : "Save Payment Method"}
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
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-2 sm:mb-0">
                          <Shield className="h-5 w-5 text-gray-700" />
                          <div>
                            <p className="font-medium text-gray-900">Government Identity Verification</p>
                            <p className="text-sm text-gray-600">
                              {profile.verificationStatus 
                                ? "Your identity has been fully verified by an administrator." 
                                : profile.verificationPending
                                  ? "Document submitted. Pending administrative review."
                                  : "Please upload a government-issued ID to certify your profile."}
                            </p>
                          </div>
                        </div>
                        
                        {!profile.verificationStatus && (
                          <div className="relative mt-2 sm:mt-0">
                            <Button variant="outline" size="sm" disabled={uploadingDoc} className="relative z-0 overflow-hidden bg-white hover:bg-gray-100">
                              {uploadingDoc ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Camera className="h-4 w-4 mr-2" />
                              )}
                              Upload ID Scan
                              <input 
                                type="file" 
                                accept="image/*,application/pdf" 
                                className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" 
                                onChange={handleDocumentUpload} 
                                disabled={uploadingDoc}
                                title="Upload ID Document"
                              />
                            </Button>
                          </div>
                        )}
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

            {/* Host Reviews on Guest */}
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>What Hosts Are Saying About You</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {hostReviews.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                      <Star className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p>You don't have any reviews from hosts yet.</p>
                      <p className="text-sm mt-1">Complete a stay to start building your reputation!</p>
                    </div>
                  ) : (
                    hostReviews.map((review) => (
                      <div key={review._id} className="p-5 border border-gray-200 rounded-xl bg-white shadow-sm space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 bg-indigo-100 flex items-center justify-center overflow-hidden">
                              {review.hostReviewer?.profilePicture ? (
                                <img src={review.hostReviewer.profilePicture} alt={review.hostReviewer.fullName} className="h-full w-full object-cover" />
                              ) : (
                                <span className="text-indigo-700 font-semibold">
                                  {review.hostReviewer?.fullName ? review.hostReviewer.fullName.charAt(0).toUpperCase() : "H"}
                                </span>
                              )}
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">{review.hostReviewer?.fullName || "A Host"}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString('en-GB')}
                                {review.propertyId && ` • Stayed at ${review.propertyId.title}`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md border border-amber-100">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3.5 w-3.5 ${i < review.rating ? "text-amber-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line bg-gray-50 p-3 rounded-lg">
                          "{review.reviewText}"
                        </p>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
