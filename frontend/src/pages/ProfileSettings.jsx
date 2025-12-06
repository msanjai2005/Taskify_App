import React, { useState, useContext, useEffect } from "react";
import {
  Edit2,
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { MdDelete } from "react-icons/md";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

const ProfileSettings = () => {
  const { backendurl, isLoading, setIsLoading, userData, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    createdAt: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
  });
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name || "",
        email: userData.email || "",
        createdAt: userData.createdAt
          ? new Date(userData.createdAt).toLocaleDateString()
          : "",
      });
      setEditData({
        name: userData.name || "",
        email: userData.email || "",
      });
    }
  }, [userData]);

  const handleEditClick = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData({
      name: user.name,
      email: user.email,
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const validateProfile = () => {
    if (!editData.name.trim()) {
      return "Name is required";
    }
    if (!editData.email.trim()) {
      return "Email is required";
    }
    if (!/\S+@\S+\.\S+/.test(editData.email)) {
      return "Please enter a valid email";
    }
    return "";
  };

  const validatePassword = () => {
    if (!passwordData.currentPassword) {
      return "Current password is required";
    }
    if (!passwordData.newPassword) {
      return "New password is required";
    }
    if (passwordData.newPassword.length < 6) {
      return "New password must be at least 6 characters";
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return "New passwords do not match";
    }
    return "";
  };

  const handleSaveProfile = async () => {
    const validationError = validateProfile();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.put(
        `${backendurl}/api/user/profile`,
        { name: editData.name, email: editData.email },
        { withCredentials: true }
      );

      if (res.data.success) {
        setUser({
          ...user,
          name: editData.name,
          email: editData.email,
        });

        if (userData) {
          setUserData({
            ...userData,
            name: editData.name,
            email: editData.email,
          });
        }

        setIsEditing(false);
        setSuccess("Profile updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile");
    }

    setIsLoading(false);
  };

  const handleSavePassword = async () => {
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await axios.put(
        `${backendurl}/api/user/change-password`,
        passwordData,
        { withCredentials: true }
      );

      if (res.data.success) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setShowPasswordSection(false);
        setSuccess("Password changed successfully!");
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to change password");
    }

    setIsLoading(false);
  };

  const handleCancelPassword = () => {
    setShowPasswordSection(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.delete(`${backendurl}/api/user/delete-profile`, {
        withCredentials: true,
      });

      if (res.data.success) {
        window.location.reload();
        setError("");
        navigate("/");
      }
    } catch (error) {
      setError(error?.response?.data?.message || "Error deleting account");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen pt-5">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-2">
          <div className="flex justify-between gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              My Profile
            </h1>
            <button
              onClick={handleDelete}
              className="w-37 px-2 py-2 text-red-500 bg-[#ffd7d7] font-semibold flex justify-center items-center gap-1 rounded-xl cursor-pointer hover:bg-[#fcbbbb]  transition"
            >
              {isLoading?(<Loading size="w-7 h-7" color="white"/>):(<div className=" font-semibold flex justify-center items-center gap-1 rounded-xl cursor-pointer transition">
                <MdDelete />
                Delete Account
              </div>)}
              
            </button>
          </div>
          <p className="text-gray-600 mt-1">
            Manage your personal information and password
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          {/* Header with Edit Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <UserIcon size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-gray-500 text-sm">Personal Information</p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEditClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={18} />
                <span className="font-medium">Edit</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 cursor-pointer text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Check size={18} />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name Field */}
            <div className="pb-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-lg text-gray-800">{user.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="pb-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <p className="text-lg text-gray-800">{user.email}</p>
                </div>
              )}
            </div>

            {/* Read-only Fields */}
            <div className="pb-6 border-b border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Created
              </label>
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-400" />
                <p className="text-gray-800">
                  {user.createdAt || "Not available"}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    userData?.isVerified ? "bg-green-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span className="text-gray-800">
                  {userData?.isVerified ? "Verified" : "Not Verified"}
                </span>
              </div>
              {!userData?.isVerified && (
                <p className="text-sm text-gray-500 mt-1">
                  Please verify your email address to access all features
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Lock size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Change Password
                </h2>
                <p className="text-gray-500 text-sm">
                  Update your account password
                </p>
              </div>
            </div>

            {!showPasswordSection ? (
              <button
                onClick={() => setShowPasswordSection(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={18} />
                <span className="font-medium">Change</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancelPassword}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSavePassword}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
                >
                  <Check size={18} />
                  <span>Save</span>
                </button>
              </div>
            )}
          </div>

          {showPasswordSection && (
            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("current")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.current ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("new")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.new ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                  >
                    {showPassword.confirm ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
