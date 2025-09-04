import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { authAPI, requestsAPI, quotesAPI } from "../services/api";
import {
  Camera,
  Edit3,
  Save,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Trash2,
  User,
  Mail,
  Phone,
  BookOpen,
  ChevronRight,
  LogOut,
  Briefcase,
  DollarSign,
  Package,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  X,
} from "lucide-react";

const ProfilePage = () => {
  const { currentUser, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    darkMode: false,
  });
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [profileImage, setProfileImage] = useState(
    currentUser?.photoURL || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [userRequests, setUserRequests] = useState([]);
  const [userQuotes, setUserQuotes] = useState([]);
  const [vendorQuotes, setVendorQuotes] = useState([]);
  const [stats, setStats] = useState({
    requests: 0,
    quotesReceived: 0,
    acceptedQuotes: 0,
    quotesSubmitted: 0,
    acceptedSubmissions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Check user role
  const isVendor = currentUser?.role === "vendor";
  const isUser = !isVendor;

  useEffect(() => {
    fetchUserData();
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError("");

      if (isUser) {
        // Fetch user requests and quotes received
        const [requestsResponse, quotesResponse] = await Promise.all([
          requestsAPI.getMyRequests(),
          quotesAPI.getUserQuotes(),
        ]);

        setUserRequests(requestsResponse.data?.data || []);
        setUserQuotes(quotesResponse.data?.data || []);

        // Calculate stats for customer
        setStats({
          requests: requestsResponse.data?.data?.length || 0,
          quotesReceived: quotesResponse.data?.data?.length || 0,
          acceptedQuotes:
            quotesResponse.data?.data?.filter((q) => q.status === "accepted")
              .length || 0,
          quotesSubmitted: 0,
          acceptedSubmissions: 0,
        });
      } else if (isVendor) {
        // Fetch vendor quotes submitted
        const quotesResponse = await quotesAPI.getMyQuotes();
        setVendorQuotes(quotesResponse.data?.data || []);

        // Calculate stats for vendor
        setStats({
          requests: 0,
          quotesReceived: 0,
          acceptedQuotes: 0,
          quotesSubmitted: quotesResponse.data?.data?.length || 0,
          acceptedSubmissions:
            quotesResponse.data?.data?.filter((q) => q.status === "accepted")
              .length || 0,
        });
      }
    } catch (err) {
      setError("Failed to load user data");
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferencesChange = (preference) => {
    setPreferences((prev) => ({
      ...prev,
      [preference]: !prev[preference],
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      // Update profile via API
      const response = await authAPI.updateProfile({
        name: formData.name,
        phone: formData.phone,
      });

      // Update context with new user data
      if (response.data.success) {
        updateUser(response.data.user);
        setIsEditing(false);
        setSuccess("Profile updated successfully");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      setError("Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const response = await authAPI.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        setIsChangingPassword(false);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setSuccess("Password changed successfully");
        setTimeout(() => setSuccess(""), 3000);
        setError("");
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      setError(
        "Failed to change password. Please check your current password."
      );
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      try {
        // Create form data for file upload
        const formData = new FormData();
        formData.append("profileImage", file);

        // Upload image to server
        const response = await authAPI.uploadProfileImage(formData);

        if (response.data.success) {
          setProfileImage(response.data.imageUrl);
          // Update user context with new image
          updateUser({ ...currentUser, photoURL: response.data.imageUrl });
          setSuccess("Profile image updated successfully");
          setTimeout(() => setSuccess(""), 3000);
        }
      } catch (err) {
        setError("Failed to upload image");
        console.error("Error uploading image:", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const response = await authAPI.deleteAccount();
        if (response.data.success) {
          logout();
        }
      } catch (err) {
        setError("Failed to delete account");
        console.error("Error deleting account:", err);
      }
    }
  };

  // Reusable UI Components
  const Card = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {children}
    </div>
  );

  const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
  }) => (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
        variant === "primary"
          ? "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      } ${className}`}
    >
      {children}
    </button>
  );

  const Input = ({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
    disabled = false,
  }) => (
    <div className={`mb-4 ${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
    </div>
  );

  const Toggle = ({ enabled, setEnabled, label }) => (
    <div className="flex items-center justify-between mb-4">
      <span className="text-gray-700 text-sm font-medium">{label}</span>
      <div
        onClick={() => setEnabled(!enabled)}
        className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
          enabled ? "bg-teal-500" : "bg-gray-300"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
            enabled ? "translate-x-6" : ""
          }`}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#1a4a52] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-700 hover:text-red-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-700 hover:text-green-900"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Profile Header Section */}
        <Card className="mb-6 flex flex-col md:flex-row items-center text-black">
          <div className="relative mb-4 md:mb-0 md:mr-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="h-12 w-12 text-gray-400" />
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-teal-500 text-white p-1 rounded-full cursor-pointer"
            >
              <Camera className="h-5 w-5" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">
              {currentUser?.name || "User"}
            </h2>
            <p className="text-gray-600">{currentUser?.email}</p>
            <div className="mt-1">
              <span className="bg-teal-100 text-teal-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {isVendor ? "Vendor" : "User"}
              </span>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-black">
          {/* Profile Information Section */}
          <Card>
            <div className="flex justify-between items-center mb-4 text-black">
              <h2 className="text-xl font-bold">Profile Information</h2>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>

            <form onSubmit={handleSaveProfile}>
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={true}
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Optional"
              />
            </form>
          </Card>

          {/* Security Section */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Security</h2>

            {!isChangingPassword ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Lock className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-500">
                        Last changed 2 months ago
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setIsChangingPassword(true)}>
                    Change Password
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="mb-6">
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button type="submit">Update Password</Button>
                  <Button
                    variant="secondary"
                    onClick={() => setIsChangingPassword(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <Toggle
              label="Two-Factor Authentication"
              enabled={twoFactorAuth}
              setEnabled={setTwoFactorAuth}
            />
          </Card>

          {/* Settings Section */}
          <Card>
            <h2 className="text-xl font-bold mb-4">Settings</h2>

            <Toggle
              label="Email Notifications"
              enabled={preferences.emailNotifications}
              setEnabled={() => handlePreferencesChange("emailNotifications")}
            />

            <Toggle
              label="Dark Mode"
              enabled={preferences.darkMode}
              setEnabled={() => handlePreferencesChange("darkMode")}
            />

            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Account Management</h3>
              <div className="flex flex-col space-y-2">
                <Button variant="secondary" className="w-full">
                  Export My Data
                </Button>
                <Button
                  variant="secondary"
                  className="w-full bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={handleDeleteAccount}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Account
                </Button>
                <Button variant="secondary" className="w-full" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* BookQuest Specific Section */}
          <Card>
            <h2 className="text-xl font-bold mb-4">My BookQuest Activity</h2>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-8 w-8 animate-spin text-teal-500" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Package className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {stats.requests}
                    </p>
                    <p className="text-sm text-gray-500">Requests</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {isUser ? stats.quotesReceived : stats.quotesSubmitted}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isUser ? "Quotes Received" : "Quotes Submitted"}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="h-5 w-5 text-teal-600" />
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      {isUser
                        ? stats.acceptedQuotes
                        : stats.acceptedSubmissions}
                    </p>
                    <p className="text-sm text-gray-500">Accepted</p>
                  </div>

                  {isVendor && (
                    <div className="bg-gray-50 p-4 rounded-lg text-center">
                      <div className="bg-teal-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Briefcase className="h-5 w-5 text-teal-600" />
                      </div>
                      <p className="text-xl font-bold text-gray-900">
                        {
                          vendorQuotes.filter((q) => q.status === "pending")
                            .length
                        }
                      </p>
                      <p className="text-sm text-gray-500">Pending</p>
                    </div>
                  )}
                </div>

                <Button className="w-full mb-4">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {isUser ? "View My Requests" : "Vendor Dashboard"}
                </Button>

                {isUser && (
                  <Button variant="secondary" className="w-full">
                    Create New Request
                  </Button>
                )}
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
