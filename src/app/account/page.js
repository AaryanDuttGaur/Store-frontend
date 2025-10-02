"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  ShoppingBag, 
  CreditCard, 
  Heart, 
  MapPin, 
  Bell, 
  Shield, 
  LogOut,
  Settings,
  Gift,
  Truck,
  Star,
  HelpCircle
} from "lucide-react";

export default function AccountDashboard() {
  const [user, setUser] = useState(null);
  const [accountData, setAccountData] = useState({
    orders: 0,
    wishlistItems: 0,
    reviews: 0,
    totalSpent: 0,
    recentActivity: [],
    loading: true
  });

  // Get user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Fetch real account data after user is set
        fetchAccountData(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch real account data from backend
  const fetchAccountData = async (userData) => {
    if (!userData) return;

    try {
      const accessToken = localStorage.getItem("access_token");
      
      // TODO: Replace with actual API endpoints once backend is ready
      const response = await fetch(`http://127.0.0.1:8000/api/account/dashboard/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAccountData({
          orders: data.orders_count || 0,
          wishlistItems: data.wishlist_count || 0,
          reviews: data.reviews_count || 0,
          totalSpent: data.total_spent || 0,
          recentActivity: data.recent_activity || [],
          loading: false
        });
      } else {
        // If API not ready yet, show zeros for new users
        console.log("Account API not ready yet, showing default data");
        setAccountData({
          orders: 0,
          wishlistItems: 0,
          reviews: 0,
          totalSpent: 0,
          recentActivity: [],
          loading: false
        });
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
      // Show zeros if API fails
      setAccountData({
        orders: 0,
        wishlistItems: 0,
        reviews: 0,
        totalSpent: 0,
        recentActivity: [],
        loading: false
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_data");
    window.location.href = "/";
  };

  // Dashboard sections data
  const dashboardSections = [
    {
      title: "My Profile",
      description: "Manage your account information",
      icon: User,
      href: "/account/profile",
      color: "bg-blue-50 hover:bg-blue-100",
      iconColor: "text-blue-600"
    },
    {
      title: "My Orders",
      description: `${accountData.orders === 0 ? 'No orders yet - Start shopping!' : `View your ${accountData.orders} orders`}`,
      icon: ShoppingBag,
      href: "/account/orders",
      color: "bg-green-50 hover:bg-green-100",
      iconColor: "text-green-600"
    },
    {
      title: "Transactions",
      description: accountData.totalSpent === 0 ? "No transactions yet" : `Track your payments and invoices`,
      icon: CreditCard,
      href: "/account/transaction/",
      color: "bg-purple-50 hover:bg-purple-100",
      iconColor: "text-purple-600"
    },
    {
      title: "Address Book",
      description: "Add your shipping and billing addresses",
      icon: MapPin,
      href: "/account/addresses",
      color: "bg-indigo-50 hover:bg-indigo-100",
      iconColor: "text-indigo-600"
    },
    {
      title: "Payment Methods",
      description: "Add your payment options for faster checkout",
      icon: CreditCard,
      href: "/account/payment-methods",
      color: "bg-yellow-50 hover:bg-yellow-100",
      iconColor: "text-yellow-600"
    },
    {
      title: "Security",
      description: "Password and security settings",
      icon: Shield,
      href: "/account/security",
      color: "bg-teal-50 hover:bg-teal-100",
      iconColor: "text-teal-600"
    },
    {
      title: "Returns & Refunds",
      description: accountData.orders === 0 ? "No orders to return yet" : "Manage returns and refund requests",
      icon: Truck,
      href: "/account/returns",
      color: "bg-cyan-50 hover:bg-cyan-100",
      iconColor: "text-cyan-600"
    },
    {
      title: "Help & Support",
      description: "Get help and contact support",
      icon: HelpCircle,
      href: "/account/support",
      color: "bg-gray-50 hover:bg-gray-100",
      iconColor: "text-gray-600"
    }
  ];

  if (accountData.loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9B651] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.username || 'User'}!
              </h1>
              <p className="text-gray-600">
                {accountData.orders === 0 
                  ? "Start exploring and make your first order!" 
                  : "Manage your account and explore your personalized dashboard"
                }
              </p>
              {user?.customer_id && (
                <p className="text-sm text-gray-500 mt-1">
                  Customer ID: {user.customer_id}
                </p>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Quick Stats - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-[#F9B651] p-3 rounded-lg">
                <ShoppingBag className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{accountData.orders}</h3>
                <p className="text-gray-600">Total Orders</p>
                {accountData.orders === 0 && (
                  <Link href="/shop" className="text-xs text-[#F9B651] hover:underline">
                    Start Shopping →
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-green-500 p-3 rounded-lg">
                <Heart className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{accountData.wishlistItems}</h3>
                <p className="text-gray-600">Wishlist Items</p>
                {accountData.wishlistItems === 0 && (
                  <p className="text-xs text-gray-500">Save items you love</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-blue-500 p-3 rounded-lg">
                <Star className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">{accountData.reviews}</h3>
                <p className="text-gray-600">Reviews Written</p>
                {accountData.reviews === 0 && (
                  <p className="text-xs text-gray-500">Share your experience</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="bg-purple-500 p-3 rounded-lg">
                <CreditCard className="text-white" size={24} />
              </div>
              <div className="ml-4">
                <h3 className="text-2xl font-bold text-gray-900">
                  ${accountData.totalSpent.toFixed(2)}
                </h3>
                <p className="text-gray-600">Total Spent</p>
                {accountData.totalSpent === 0 && (
                  <p className="text-xs text-gray-500">Start shopping to see spending</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardSections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <Link
                  key={index}
                  href={section.href}
                  className={`${section.color} rounded-lg p-6 border border-gray-200 transition-all duration-200 hover:shadow-md group`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${section.iconColor} bg-white group-hover:scale-110 transition-transform duration-200`}>
                      <IconComponent size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity - Real Data or Empty State */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
          {accountData.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {accountData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-[#F9B651] p-2 rounded-full">
                    <ShoppingBag className="text-white" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{activity.description}</p>
                    <p className="text-sm text-gray-600">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <ShoppingBag className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Yet</h3>
              <p className="text-gray-600 mb-4">
                Start shopping to see your recent activity here!
              </p>
              <Link 
                href="/shop" 
                className="inline-flex items-center px-4 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}