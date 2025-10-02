"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Edit2, 
  Save, 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  MapPin,
  ArrowLeft,
  Camera,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    },
    customer_id: '',
    member_since: '',
    loading: true
  });
  const [originalData, setOriginalData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiStatus, setApiStatus] = useState('checking');

  // Initialize and fetch profile data
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    const accessToken = localStorage.getItem("access_token");
    
    if (!userData || !accessToken) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchProfileData(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/auth/login";
    }
  }, []);

  // Fetch profile data from backend API
  const fetchProfileData = async (userData) => {
    if (!userData) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      
      const response = await fetch(`http://127.0.0.1:8000/api/account/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Backend API is working
        const data = await response.json();
        setApiStatus('available');
        
        const fetchedData = {
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          username: data.username || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender || '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            postal_code: data.address?.postal_code || '',
            country: data.address?.country || ''
          },
          customer_id: data.customer_id || userData.customer_id || '',
          member_since: data.member_since || 'Recently joined',
          loading: false
        };
        
        setProfileData(fetchedData);
        setOriginalData(JSON.parse(JSON.stringify(fetchedData))); // Deep copy
        
      } else if (response.status === 401) {
        // Token expired - redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
        window.location.href = "/auth/login";
      } else {
        // API endpoint not ready yet
        handleApiUnavailable(userData);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      handleApiUnavailable(userData);
    }
  };

  // Handle when API is not available
  const handleApiUnavailable = (userData) => {
    setApiStatus('unavailable');
    const fallbackData = {
      first_name: userData.first_name || '',
      last_name: userData.last_name || '',
      email: userData.email || '',
      username: userData.username || '',
      phone: '',
      date_of_birth: '',
      gender: '',
      address: {
        street: '',
        city: '',
        state: '',
        postal_code: '',
        country: ''
      },
      customer_id: userData.customer_id || '',
      member_since: 'Recently joined',
      loading: false
    };
    
    setProfileData(fallbackData);
    setOriginalData(JSON.parse(JSON.stringify(fallbackData))); // Deep copy
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Save profile changes to backend
  const handleSaveProfile = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });

    if (apiStatus === 'available') {
      // Save via API
      try {
        const accessToken = localStorage.getItem("access_token");
        
        const response = await fetch(`http://127.0.0.1:8000/api/account/profile/`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
          body: JSON.stringify(profileData),
        });

        if (response.ok) {
          const updatedData = await response.json();
          
          // Update states with server response
          const serverData = {
            ...updatedData,
            loading: false
          };
          
          setProfileData(serverData);
          setOriginalData(JSON.parse(JSON.stringify(serverData))); // Deep copy
          setEditMode(false);
          setMessage({ type: 'success', text: 'Profile updated successfully!' });
          
          // Update localStorage for basic user info
          updateLocalStorage(updatedData);
          
          // Clear success message after 3 seconds
          setTimeout(() => setMessage({ type: '', text: '' }), 3000);
          
        } else if (response.status === 401) {
          // Token expired
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          localStorage.removeItem("user_data");
          window.location.href = "/auth/login";
        } else {
          const errorData = await response.json();
          setMessage({ type: 'error', text: errorData.detail || 'Failed to update profile' });
        }
      } catch (error) {
        console.error("Error saving profile:", error);
        setMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
      }
    } else {
      // API not ready - save locally
      updateLocalStorage(profileData);
      setOriginalData(JSON.parse(JSON.stringify(profileData))); // Deep copy
      setEditMode(false);
      setMessage({ 
        type: 'success', 
        text: 'Profile updated locally! Changes will be synced when the backend API is ready.' 
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }

    setSaving(false);
  };

  // Update localStorage with basic user data
  const updateLocalStorage = (data) => {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const newUserData = {
      ...userData,
      username: data.username || userData.username,
      email: data.email || userData.email,
      first_name: data.first_name || userData.first_name,
      last_name: data.last_name || userData.last_name
    };
    localStorage.setItem("user_data", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  // Cancel editing and restore original data
  const handleCancelEdit = () => {
    setProfileData(JSON.parse(JSON.stringify(originalData))); // Deep copy
    setEditMode(false);
    setMessage({ type: '', text: '' });
  };

  // Reusable input field component
  const InputField = ({ label, field, value, type = "text", placeholder, required = false }) => (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {editMode ? (
        <input
          type={type}
          value={value || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent transition-colors"
          placeholder={placeholder}
        />
      ) : (
        <div className="px-3 py-2 bg-gray-50 rounded-lg min-h-[42px] flex items-center">
          {value ? (
            <span className="text-gray-900">{value}</span>
          ) : (
            <span className="text-gray-400 italic">{placeholder}</span>
          )}
        </div>
      )}
    </div>
  );

  // Loading state
  if (profileData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9B651] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/account"
              className="flex items-center text-gray-600 hover:text-[#F9B651] transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
          
          <div className="flex items-center space-x-3">
            {editMode ? (
              <>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={saving}
                >
                  <X size={16} className="mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    saving 
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-[#F9B651] hover:bg-[#e0a446] text-white"
                  }`}
                >
                  <Save size={16} className="mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center px-4 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* API Status Banner */}
        {apiStatus === 'unavailable' && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-start">
            <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium">Development Mode</p>
              <p className="text-sm mt-1">Profile API is under development. You can view and edit your basic info. Additional fields will be saved locally until the backend is ready.</p>
            </div>
          </div>
        )}

        {/* Success/Error Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-start ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={20} className="mr-3 mt-0.5 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <div className="space-y-8">
          
          {/* Profile Picture & Basic Info Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-[#F9B651] to-[#e0a446] rounded-full flex items-center justify-center">
                  <User size={40} className="text-white" />
                </div>
                {editMode && (
                  <button className="absolute -bottom-1 -right-1 bg-[#F9B651] p-2 rounded-full text-white hover:bg-[#e0a446] transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="First Name"
                    field="first_name"
                    value={profileData.first_name}
                    placeholder="Enter your first name"
                    required
                  />
                  <InputField
                    label="Last Name"
                    field="last_name"
                    value={profileData.last_name}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Username"
                    field="username"
                    value={profileData.username}
                    placeholder="Choose a username"
                    required
                  />
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Customer ID</label>
                    <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-gray-700 font-mono">
                      {profileData.customer_id || 'Not assigned'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail size={20} className="mr-3 text-[#F9B651]" />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Email Address"
                field="email"
                value={profileData.email}
                type="email"
                placeholder="Enter your email address"
                required
              />
              <InputField
                label="Phone Number"
                field="phone"
                value={profileData.phone}
                type="tel"
                placeholder="Enter your phone number"
              />
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User size={20} className="mr-3 text-[#F9B651]" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="Date of Birth"
                field="date_of_birth"
                value={profileData.date_of_birth}
                type="date"
                placeholder="Select your birth date"
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                {editMode ? (
                  <select
                    value={profileData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                ) : (
                  <div className="px-3 py-2 bg-gray-50 rounded-lg min-h-[42px] flex items-center">
                    {profileData.gender ? (
                      <span className="text-gray-900 capitalize">{profileData.gender.replace('_', ' ')}</span>
                    ) : (
                      <span className="text-gray-400 italic">Select gender</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin size={20} className="mr-3 text-[#F9B651]" />
              Address Information
            </h3>
            
            <div className="space-y-4">
              <InputField
                label="Street Address"
                field="address.street"
                value={profileData.address?.street}
                placeholder="Enter your street address"
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField
                  label="City"
                  field="address.city"
                  value={profileData.address?.city}
                  placeholder="Enter your city"
                />
                <InputField
                  label="State/Province"
                  field="address.state"
                  value={profileData.address?.state}
                  placeholder="Enter your state"
                />
                <InputField
                  label="Postal Code"
                  field="address.postal_code"
                  value={profileData.address?.postal_code}
                  placeholder="Enter postal code"
                />
              </div>
              
              <InputField
                label="Country"
                field="address.country"
                value={profileData.address?.country}
                placeholder="Enter your country"
              />
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar size={20} className="mr-3 text-[#F9B651]" />
              Account Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Member Since</label>
                <div className="px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg text-gray-700">
                  {profileData.member_since}
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Account Status</label>
                <div className="px-3 py-2 bg-green-50 rounded-lg text-green-700 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  Active
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}