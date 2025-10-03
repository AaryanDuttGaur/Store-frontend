"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  ShoppingBag,
  CreditCard,
  Truck,
  Tag,
  RefreshCw
} from "lucide-react";

export default function CartPage() {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updating, setUpdating] = useState({});
  const [user, setUser] = useState(null);

  // Check authentication
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");

    if (!accessToken || !userData) {
      window.location.href = "/auth/login";
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchCartData();
    } catch (error) {
      console.error("Error parsing user data:", error);
      window.location.href = "/auth/login";
    }
  }, []);

  // Fetch cart data from backend
  const fetchCartData = async () => {
    try {
      const accessToken = localStorage.getItem("access_token");

      // const response = await fetch("http://127.0.0.1:8000/api/cart/", {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartData(data);
        updateNavbarCartCount(data.total_items || 0);
      } else if (response.status === 401) {
        // Token expired
        localStorage.clear();
        window.location.href = "/auth/login";
      } else {
        setError("Failed to load cart data");
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // Update navbar cart count
  const updateNavbarCartCount = (count) => {
    localStorage.setItem("cart_items", JSON.stringify(
      Array(count).fill({ quantity: 1 })
    ));
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Update item quantity
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setUpdating(prev => ({ ...prev, [itemId]: true }));

    try {
      const accessToken = localStorage.getItem("access_token");

      // const response = await fetch(`http://127.0.0.1:8000/api/cart/items/${itemId}/`, {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${itemId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        const data = await response.json();

        // Update the cart data with new item info
        setCartData(prevCart => ({
          ...prevCart,
          items: prevCart.items.map(item =>
            item.id === itemId
              ? { ...item, quantity: newQuantity, subtotal: data.item.subtotal }
              : item
          ),
          total_items: data.cart_summary.total_items,
          total_price: data.cart_summary.total_price,
        }));

        updateNavbarCartCount(data.cart_summary.total_items);

      } else {
        const errorData = await response.json();
        setError(errorData.detail || "Failed to update quantity");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Network error. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Remove item from cart
  const removeItem = async (itemId, productName) => {
    if (!confirm(`Remove ${productName} from your cart?`)) return;

    setUpdating(prev => ({ ...prev, [itemId]: true }));

    try {
      const accessToken = localStorage.getItem("access_token");

      // const response = await fetch(`http://127.0.0.1:8000/api/cart/items/${itemId}/remove/`, {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/items/${itemId}/remove/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Remove item from cart data
        setCartData(prevCart => ({
          ...prevCart,
          items: prevCart.items.filter(item => item.id !== itemId),
          total_items: data.cart_summary.total_items,
          total_price: data.cart_summary.total_price,
          item_count: data.cart_summary.item_count,
        }));

        updateNavbarCartCount(data.cart_summary.total_items);

      } else {
        setError("Failed to remove item");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Network error. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUpdating(prev => ({ ...prev, [itemId]: false }));
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!confirm("Remove all items from your cart?")) return;

    setLoading(true);

    try {
      const accessToken = localStorage.getItem("access_token");

      // const response = await fetch("http://127.0.0.1:8000/api/cart/clear/", {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear/`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setCartData(prev => ({
          ...prev,
          items: [],
          total_items: 0,
          total_price: "0.00",
          item_count: 0,
        }));

        updateNavbarCartCount(0);

      } else {
        setError("Failed to clear cart");
        setTimeout(() => setError(""), 3000);
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Network error. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = parseFloat(cartData?.total_price || 0);
    const shipping = subtotal > 100 ? 0 : 15.99; // Free shipping over $100
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-[#F9B651] mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cartData?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <div className="space-y-4">
              <Link
                href="/Pages/shop"
                className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition"
              >
                <ShoppingBag className="mr-2" size={20} />
                Continue Shopping
              </Link>
              <div className="text-sm text-gray-500">
                <Link href="/" className="hover:text-[#F9B651]">← Back to Home</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { subtotal, shipping, tax, total } = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/Pages/shop"
              className="flex items-center text-gray-600 hover:text-[#F9B651] transition"
            >
              <ArrowLeft size={20} className="mr-2" />
              Continue Shopping
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <span className="bg-[#F9B651] text-white px-3 py-1 rounded-full text-sm">
              {cartData.item_count} {cartData.item_count === 1 ? 'item' : 'items'}
            </span>
          </div>

          {cartData.items.length > 0 && (
            <button
              onClick={clearCart}
              className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 size={16} className="mr-2" />
              Clear Cart
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <AlertCircle size={20} className="text-red-600 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Cart Items</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {cartData.items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.product.main_image ? (
                            <img
                              src={item.product.main_image}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ShoppingBag className="text-gray-400" size={32} />
                          )}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product.category?.name}
                          {item.product.brand && ` • ${item.product.brand.name}`}
                        </p>

                        {/* Variant Info */}
                        {item.variant && (
                          <div className="flex items-center space-x-4 mt-2">
                            {item.variant.color && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Color: {item.variant.color}
                              </span>
                            )}
                            {item.variant.size && (
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                Size: {item.variant.size}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price Change Alert */}
                        {item.price_changed && (
                          <div className="flex items-center mt-2 text-amber-600">
                            <AlertCircle size={16} className="mr-1" />
                            <span className="text-xs">
                              Price changed: ${item.current_price} (was ${item.price_when_added})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ${parseFloat(item.price_when_added).toFixed(2)}
                        </p>
                        {item.price_changed && (
                          <p className="text-sm text-amber-600">
                            Now: ${parseFloat(item.current_price).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls & Remove */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updating[item.id]}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-12 text-center font-medium">
                          {updating[item.id] ? '...' : item.quantity}
                        </span>

                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updating[item.id]}
                          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-semibold">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeItem(item.id, item.product.name)}
                          disabled={updating[item.id]}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartData.item_count} items)</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                {shipping === 0 && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle size={16} className="mr-2" />
                    You're eligible for free shipping!
                  </div>
                )}

                {subtotal < 100 && subtotal > 0 && (
                  <div className="flex items-center text-amber-600 text-sm">
                    <Truck size={16} className="mr-2" />
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => window.location.href = '/Pages/checkout'}
                  className="w-full bg-[#F9B651] text-white py-3 rounded-lg hover:bg-[#e0a446] transition flex items-center justify-center"
                >
                  <CreditCard size={20} className="mr-2" />
                  Proceed to Checkout
                </button>

              </div>

              <div className="mt-6 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <CheckCircle size={16} className="text-green-500" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}