import { User, Bell, CreditCard, Shield, Globe, Save, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { CustomSelect } from "../../components/ui/custom-select";

export default function HostSettings() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    language: "English",
    bio: "",
    notificationPreferences: {
      email: true,
      sms: true,
      bookings: true,
      reviews: true,
      marketing: false
    },
    payoutMethod: {
      bankName: "",
      accountName: "",
      accountNumber: "",
      routingNumber: ""
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Profile");
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
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
            payoutMethod: {
              ...prev.payoutMethod,
              ...(res.data.payoutMethod || {})
            }
          }));
        }
      } catch (error) {
        console.error("Failed to fetch profile settings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handlePayoutChange = (e) => {
    const { id, value } = e.target;
    setProfile(prev => ({
      ...prev,
      payoutMethod: {
        ...prev.payoutMethod,
        [id]: value
      }
    }));
  };

  const handleCheckboxChange = (id) => {
    setProfile(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [id]: !prev.notificationPreferences[id]
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
      showToast("success", "Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save profile settings", error);
      showToast("error", "Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-1">
            <button 
              onClick={() => setActiveTab("Profile")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'Profile' ? 'text-white bg-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <User className="h-5 w-5 mr-3" />
              Profile
            </button>
            <button 
              onClick={() => setActiveTab("Notifications")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'Notifications' ? 'text-white bg-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <Bell className="h-5 w-5 mr-3" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab("Payout")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg ${activeTab === 'Payout' ? 'text-white bg-gray-900' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <CreditCard className="h-5 w-5 mr-3" />
              Payout Methods
            </button>
            <button className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
              <Shield className="h-5 w-5 mr-3" />
              Security
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Settings */}
          <div className={activeTab === 'Profile' ? "block" : "hidden"}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-900">
                      {getInitials(profile.fullName)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{profile.fullName}</p>
                    <p className="text-xs text-gray-500">
                      Standard profile avatar
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Full Name</label>
                    <input
                      id="fullName"
                      type="text"
                      value={profile.fullName}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={profile.email}
                      disabled
                      className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm ring-offset-background text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number</label>
                    <input
                      id="phoneNumber"
                      type="tel"
                      value={profile.phoneNumber || ""}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter your phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="language" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Language</label>
                    <CustomSelect
                      options={["English", "Spanish", "French", "German"]}
                      value={profile.language}
                      onChange={(val) => setProfile(prev => ({...prev, language: val}))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={profile.bio || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
                    placeholder="Tell guests about yourself..."
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={saveProfile} disabled={saving} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-black h-10 px-4 py-2">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className={activeTab === 'Notifications' ? "block" : "hidden"}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Notification Preferences
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="email" checked={profile.notificationPreferences.email} onChange={() => handleCheckboxChange('email')} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <div className="flex-1">
                    <label htmlFor="email" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Receive email updates about bookings and messages
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="sms" checked={profile.notificationPreferences.sms} onChange={() => handleCheckboxChange('sms')} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <div className="flex-1">
                    <label htmlFor="sms" className="text-sm font-medium text-gray-900 cursor-pointer">
                      SMS Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Get text messages for urgent updates
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="bookings" checked={profile.notificationPreferences.bookings} onChange={() => handleCheckboxChange('bookings')} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <div className="flex-1">
                    <label htmlFor="bookings" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Booking Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Alerts for new bookings and cancellations
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="reviews" checked={profile.notificationPreferences.reviews} onChange={() => handleCheckboxChange('reviews')} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <div className="flex-1">
                    <label htmlFor="reviews" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Review Notifications
                    </label>
                    <p className="text-sm text-gray-600">
                      Get notified when guests leave reviews
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <input type="checkbox" id="marketing" checked={profile.notificationPreferences.marketing} onChange={() => handleCheckboxChange('marketing')} className="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                  <div className="flex-1">
                    <label htmlFor="marketing" className="text-sm font-medium text-gray-900 cursor-pointer">
                      Marketing Communications
                    </label>
                    <p className="text-sm text-gray-600">
                      Receive tips and promotional offers
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={saveProfile} disabled={saving} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-gray-900 text-white hover:bg-black disabled:opacity-50 h-10 px-4 py-2">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          </div>

          {/* Payout Settings */}
          <div className={activeTab === 'Payout' ? "block" : "hidden"}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Payout Configuration
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="bankName" className="text-sm font-medium leading-none">Bank Name</label>
                    <input
                      id="bankName"
                      type="text"
                      value={profile.payoutMethod?.bankName || ""}
                      onChange={handlePayoutChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="e.g. Chase Bank"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="accountName" className="text-sm font-medium leading-none">Account Holder Name</label>
                    <input
                      id="accountName"
                      type="text"
                      value={profile.payoutMethod?.accountName || ""}
                      onChange={handlePayoutChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter legal name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="accountNumber" className="text-sm font-medium leading-none">Account Number</label>
                    <input
                      id="accountNumber"
                      type="text"
                      value={profile.payoutMethod?.accountNumber || ""}
                      onChange={handlePayoutChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter account number"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="routingNumber" className="text-sm font-medium leading-none">Routing Number (Optional)</label>
                    <input
                      id="routingNumber"
                      type="text"
                      value={profile.payoutMethod?.routingNumber || ""}
                      onChange={handlePayoutChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      placeholder="Enter routing number"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-4 flex gap-3 text-sm text-gray-600">
                  <CreditCard className="h-5 w-5 text-gray-500 shrink-0 mt-0.5" />
                  <p>
                    Earnings are disbursed on the 1st and 15th of every month. 
                    Please double-check your account details to avoid payment delays.
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={saveProfile} disabled={saving} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-gray-900 text-white hover:bg-black h-10 px-4 py-2">
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? "Saving..." : "Save Payout Info"}
                </button>
              </div>
            </div>
          </div>


          
        </div>
      </div>
    </div>
  );
}
