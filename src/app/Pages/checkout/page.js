"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft,
  CreditCard,
  User,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
  Tag,
  Truck,
  Clock,
  Package,
  MapPin,
  Calendar,
  Info
} from "lucide-react";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get product and quantity from URL params (for Buy Now)
  const productId = searchParams.get('product');
  const productQuantity = parseInt(searchParams.get('quantity') || '1');
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Shipping options
  const [selectedShipping, setSelectedShipping] = useState('standard');
  const shippingOptions = [
    {
      id: 'standard',
      name: 'Standard Shipping',
      price: 0,
      duration: '5-7 business days',
      description: 'Free shipping on orders over $50',
      icon: Package,
      estimatedDelivery: () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    },
    {
      id: 'express',
      name: 'Express Shipping',
      price: 15.99,
      duration: '2-3 business days',
      description: 'Faster delivery for urgent orders',
      icon: Truck,
      estimatedDelivery: () => {
        const date = new Date();
        date.setDate(date.getDate() + 3);
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      price: 29.99,
      duration: '1 business day',
      description: 'Next business day delivery',
      icon: Clock,
      estimatedDelivery: () => {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return date.toLocaleDateString('en-US', { 
          weekday: 'short', 
          month: 'short', 
          day: 'numeric' 
        });
      }
    }
  ];

  // Form states
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    card_number: '',
    expiry: '',
    cvv: '',
    delivery_instructions: ''
  });

  const [errors, setErrors] = useState({});

  // Check authentication and load data
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");
    
    if (!accessToken || !userData) {
      router.push('/auth/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // Fetch full profile data and pre-fill form
      fetchProfileData(parsedUser);

      // Load checkout data
      if (productId) {
        loadSingleProduct(productId);
      } else {
        loadCartItems();
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      router.push('/auth/login');
    }
  }, [productId, router]);

  // Load single product for Buy Now
  const loadSingleProduct = async (id) => {
    setLoading(true);
    try {
      // const response = await fetch(`http://127.0.0.1:8000/api/products/products/${id}/`);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/products/${id}/`);
      if (response.ok) {
        const product = await response.json();
        const item = {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: productQuantity,
          image: product.main_image,
          weight: product.weight || 0.5
        };
        setOrderItems([item]);
        setSubtotal(product.price * productQuantity);
      } else {
        setMessage({ type: 'error', text: 'Product not found' });
        setTimeout(() => router.push('/Pages/shop'), 3000);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      setMessage({ type: 'error', text: 'Failed to load product' });
      setTimeout(() => router.push('/Pages/shop'), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Load cart items
  const loadCartItems = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem("access_token");
      // const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      //  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`,{
      headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const cartData = await response.json();
        if (cartData.items && cartData.items.length > 0) {
          const items = cartData.items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            price: item.price_when_added,
            quantity: item.quantity,
            image: item.product.main_image,
            weight: item.product.weight || 0.5
          }));
          setOrderItems(items);
          setSubtotal(parseFloat(cartData.total_price));
        } else {
          setMessage({ type: 'error', text: 'Your cart is empty' });
          setTimeout(() => router.push('/Pages/cart'), 3000);
        }
      } else if (response.status === 401) {
        router.push('/auth/login');
      } else {
        setMessage({ type: 'error', text: 'Failed to load cart' });
        setTimeout(() => router.push('/Pages/cart'), 3000);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setMessage({ type: 'error', text: 'Failed to load cart items' });
    } finally {
      setLoading(false);
    }
  };

  // Fetch full profile data and pre-fill form
  const fetchProfileData = async (userData) => {
    try {
      const accessToken = localStorage.getItem("access_token");
      // const response = await fetch(`http://127.0.0.1:8000/api/account/profile/`, {
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/account/profile/`,{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        
        // Pre-fill form with full profile data
        setFormData(prev => ({
          ...prev,
          full_name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          email: profileData.email || '',
          phone: profileData.phone || '',
          address: profileData.address?.street || '',
          city: profileData.address?.city || '',
          state: profileData.address?.state || '',
          postal_code: profileData.address?.postal_code || ''
        }));
      } else {
        // Fallback to basic user data if profile API fails
        setFormData(prev => ({
          ...prev,
          full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          email: userData.email || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Fallback to basic user data
      setFormData(prev => ({
        ...prev,
        full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
        email: userData.email || ''
      }));
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
    const shippingCost = subtotal >= 50 && selectedShipping === 'standard' ? 0 : selectedShippingOption.price;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingCost + tax;
    
    return { shippingCost, tax, total };
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.postal_code.trim()) newErrors.postal_code = 'Postal code is required';
    if (!formData.card_number.trim()) newErrors.card_number = 'Card number is required';
    if (!formData.expiry.trim()) newErrors.expiry = 'Expiry date is required';
    if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle order placement
  const placeOrder = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setProcessing(true);
    setMessage({ type: '', text: '' });

    try {
      const accessToken = localStorage.getItem("access_token");
      
      // Parse full name into first and last name
      const nameParts = formData.full_name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      const selectedShippingOption = shippingOptions.find(opt => opt.id === selectedShipping);
      const { shippingCost, tax, total } = calculateTotals();
      
      const orderData = {
        items: orderItems.map(item => ({
          product_id: parseInt(item.id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.price)
        })),
        
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        
        shipping_first_name: firstName,
        shipping_last_name: lastName,
        shipping_address_line_1: formData.address.trim(),
        shipping_city: formData.city.trim(),
        shipping_state: formData.state.trim(),
        shipping_postal_code: formData.postal_code.trim(),
        shipping_country: 'United States',
        
        billing_same_as_shipping: true,
        
        shipping_method: selectedShippingOption.name,
        shipping_cost: parseFloat(shippingCost.toFixed(2)),
        
        notes: `Order placed via ${productId ? 'Buy Now' : 'Cart'} checkout. Delivery Instructions: ${formData.delivery_instructions || 'None'}`,
        
        subtotal: parseFloat(subtotal.toFixed(2)),
        tax_amount: parseFloat(tax.toFixed(2)),
        total_amount: parseFloat(total.toFixed(2)),
        
        delivery_instructions: formData.delivery_instructions || '',
        
        estimated_delivery: selectedShippingOption.estimatedDelivery(),
        
        payment_info: {
          card_number: formData.card_number.replace(/\s/g, ''),
          expiry: formData.expiry.trim(),
          cvv: formData.cvv.trim()
        }
      };

      console.log('Sending order data:', orderData);

      // const response = await fetch('http://127.0.0.1:8000/api/orders/create/', {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/create/`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(orderData),
      });

      const responseData = await response.json();
      console.log('Response from server:', responseData);

      if (response.ok && responseData.success) {
        if (!productId) {
          try {
            // await fetch('http://127.0.0.1:8000/api/cart/clear/', {
               await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/clear/`, {

              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${accessToken}` },
            });
          } catch (cartError) {
            console.warn('Failed to clear cart:', cartError);
            localStorage.removeItem('cart_items');
          }
        }
        
        window.dispatchEvent(new Event('cart-updated'));
        
        setMessage({ 
          type: 'success', 
          text: `Order ${responseData.order_id} placed successfully! Expected delivery: ${selectedShippingOption.estimatedDelivery()}` 
        });
        
        setTimeout(() => {
          router.push(`/Pages/shop?order_success=${responseData.order_id}`);
        }, 3000);
        
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_data");
        router.push('/auth/login');
      } else {
        console.error('Order creation error:', responseData);
        
        let errorMessage = 'Failed to place order. Please try again.';
        
        if (responseData.message) {
          errorMessage = responseData.message;
        } else if (responseData.error) {
          if (typeof responseData.error === 'string') {
            errorMessage = responseData.error;
          } else if (typeof responseData.error === 'object') {
            const errors = responseData.error;
            const firstError = Object.values(errors)[0];
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0];
            } else if (typeof firstError === 'string') {
              errorMessage = firstError;
            } else {
              errorMessage = 'Validation error occurred';
            }
          }
        } else if (responseData.items) {
          errorMessage = `Product availability issue: ${responseData.items[0]}`;
        }
        
        setMessage({ 
          type: 'error', 
          text: errorMessage
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setMessage({ 
        type: 'error', 
        text: 'Network error. Please check your connection and try again.' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const { shippingCost, tax, total } = calculateTotals();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F9B651] mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Items to Checkout</h1>
          <Link 
            href="/Pages/shop"
            className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Message Toast */}
        {message.text && (
          <div className="fixed top-24 right-4 z-50 max-w-sm">
            <div className={`p-4 rounded-lg shadow-lg border flex items-start space-x-3 ${
              message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <p className="font-medium">{message.text}</p>
              <button 
                onClick={() => setMessage({ type: '', text: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href={productId ? `/Pages/product/${productId}` : "/Pages/cart"}
            className="flex items-center text-gray-600 hover:text-[#F9B651] transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <User size={20} className="mr-3 text-[#F9B651]" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                      errors.full_name ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <MapPin size={20} className="mr-3 text-[#F9B651]" />
                Shipping Address
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.state && (
                      <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                        errors.postal_code ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.postal_code && (
                      <p className="text-red-500 text-sm mt-1">{errors.postal_code}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value="United States"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Instructions (Optional)</label>
                  <textarea
                    value={formData.delivery_instructions}
                    onChange={(e) => handleInputChange('delivery_instructions', e.target.value)}
                    placeholder="e.g., Leave at front door, Ring doorbell, etc."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Options */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <Truck size={20} className="mr-3 text-[#F9B651]" />
                Shipping Options
              </h2>
              
              <div className="space-y-4">
                {shippingOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <div
                      key={option.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedShipping === option.id
                          ? 'border-[#F9B651] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedShipping(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping === option.id}
                            onChange={() => setSelectedShipping(option.id)}
                            className="text-[#F9B651] focus:ring-[#F9B651]"
                          />
                          <IconComponent size={20} className="text-[#F9B651]" />
                          <div>
                            <p className="font-medium text-gray-900">{option.name}</p>
                            <p className="text-sm text-gray-600">{option.description}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock size={14} className="mr-1" />
                                {option.duration}
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar size={14} className="mr-1" />
                                Est. {option.estimatedDelivery()}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {option.price === 0 && subtotal >= 50 ? 'FREE' : 
                             option.price === 0 ? `$${option.price.toFixed(2)}` : 
                             `$${option.price.toFixed(2)}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {subtotal < 50 && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-blue-700">
                      Add <strong>${(50 - subtotal).toFixed(2)}</strong> more to your order to qualify for free standard shipping!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CreditCard size={20} className="mr-3 text-[#F9B651]" />
                Payment Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Number *</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={formData.card_number}
                    onChange={(e) => handleInputChange('card_number', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                      errors.card_number ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.card_number && (
                    <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date *</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => handleInputChange('expiry', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                        errors.expiry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.expiry && (
                      <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV *</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => handleInputChange('cvv', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] ${
                        errors.cvv ? 'border-red-500' : 'border-gray-300'
                      }`}
                      maxLength={4}
                    />
                    {errors.cvv && (
                      <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 p-3 bg-gray-50 rounded-lg">
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-sm text-gray-700">Your payment information is secure and encrypted</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h3>
              
              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {orderItems.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Tag size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm leading-5 line-clamp-2">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pricing Breakdown */}
              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[#F9B651]">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar size={16} className="text-green-600" />
                  <span className="font-medium text-green-800">Estimated Delivery</span>
                </div>
                <p className="text-green-700">
                  {shippingOptions.find(opt => opt.id === selectedShipping)?.estimatedDelivery()}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  via {shippingOptions.find(opt => opt.id === selectedShipping)?.name}
                </p>
              </div>
              
              {/* Place Order Button */}
              <button
                onClick={placeOrder}
                disabled={processing}
                className={`w-full flex items-center justify-center px-6 py-4 rounded-lg font-medium transition-colors text-lg ${
                  processing
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-[#F9B651] hover:bg-[#e0a446] text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {processing ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Processing Order...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} className="mr-2" />
                    Place Order - ${total.toFixed(2)}
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <CheckCircle size={14} className="text-green-500" />
                  <span>Secure 256-bit SSL encryption</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Your personal and payment information is protected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle size={20} className="text-green-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Secure Payment</h4>
              <p className="text-sm text-gray-600">SSL encrypted checkout</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <Truck size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Free Shipping</h4>
              <p className="text-sm text-gray-600">On orders over $50</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-full">
              <Package size={20} className="text-purple-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day return policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F9B651] mx-auto mb-4" />
          <p className="text-gray-600">Loading checkout...</p>
        </div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}