"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Truck,
  Calendar,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Download,
  RotateCcw,
  Copy,
  ExternalLink,
  Loader2,
  ShoppingBag,
  Receipt,
  FileText
} from "lucide-react";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.order_id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');
  const [actionLoading, setActionLoading] = useState({
    cancel: false,
    reorder: false,
    invoice: false
  });

  // Get API URL with fallback
  const getApiUrl = () => {
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
  };

  useEffect(() => {
    console.log('Params object:', params);
    console.log('API URL:', getApiUrl());
    
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        router.push('/auth/login');
        return;
      }
      fetchOrderDetail(accessToken);
    }
  }, [orderId, router]);

  const fetchOrderDetail = async (token) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/detail/${orderId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Raw API Response:', data);
        console.log('Order ID from params:', orderId);
        setOrder(data.order);
      } else if (response.status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem("access_token");
          localStorage.removeItem("user_data");
        }
        router.push('/auth/login');
      } else if (response.status === 404) {
        setError('Order not found');
      } else {
        const errorData = await response.json();
        setError(errorData.message || errorData.detail || 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    setActionLoading(prev => ({ ...prev, cancel: true }));
    
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("access_token");

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/cancel/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh order data
        fetchOrderDetail(token);
        alert(data.message || 'Order cancelled successfully');
      } else {
        alert(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, cancel: false }));
    }
  };

  // Handle reorder
  const handleReorder = async () => {
    setActionLoading(prev => ({ ...prev, reorder: true }));
    
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("access_token");

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/reorder/${orderId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (data.available_items && data.available_items.length > 0) {
          // Store items for checkout and redirect
          localStorage.setItem('reorder_items', JSON.stringify(data.available_items));
          router.push('/Pages/checkout');
        } else {
          alert('No items from this order are currently available for reorder.');
        }
      } else {
        alert(data.message || 'Failed to process reorder');
      }
    } catch (error) {
      console.error('Error processing reorder:', error);
      alert('Failed to process reorder. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, reorder: false }));
    }
  };

  // Handle invoice download
  const handleDownloadInvoice = async () => {
    setActionLoading(prev => ({ ...prev, invoice: true }));
    
    if (typeof window === 'undefined') return;
    const token = localStorage.getItem("access_token");

    try {
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/api/orders/invoice/${orderId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        // In a real app, you'd generate and download a PDF
        // For now, we'll just show the invoice data
        console.log('Invoice data:', data);
        alert('Invoice data retrieved successfully. Check console for details.');
      } else {
        alert('Failed to get invoice data');
      }
    } catch (error) {
      console.error('Error getting invoice:', error);
      alert('Failed to get invoice. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, invoice: false }));
    }
  };

  // Copy tracking number
  const copyTrackingNumber = async (trackingNumber) => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopySuccess('Copied!');
      setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Get status icon and color
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-700',
          bg: 'bg-yellow-100',
          border: 'border-yellow-200'
        };
      case 'confirmed':
        return {
          icon: CheckCircle,
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        };
      case 'processing':
        return {
          icon: Package,
          color: 'text-purple-700',
          bg: 'bg-purple-100',
          border: 'border-purple-200'
        };
      case 'shipped':
        return {
          icon: Truck,
          color: 'text-indigo-700',
          bg: 'bg-indigo-100',
          border: 'border-indigo-200'
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color: 'text-green-700',
          bg: 'bg-green-100',
          border: 'border-green-200'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-200'
        };
      case 'refunded':
        return {
          icon: DollarSign,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'text-green-700 bg-green-100';
      case 'pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'failed':
        return 'text-red-700 bg-red-100';
      case 'refunded':
        return 'text-gray-700 bg-gray-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-[#F9B651] animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/account/orders"
            className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const canCancel = ['pending', 'confirmed'].includes(order.status?.toLowerCase());

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b pt-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/account/orders"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_id}</h1>
                <p className="text-sm text-gray-600">Order Details & Tracking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {/* Action Buttons */}
              <button
                onClick={handleDownloadInvoice}
                disabled={actionLoading.invoice}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {actionLoading.invoice ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>Invoice</span>
              </button>

              <button
                onClick={handleReorder}
                disabled={actionLoading.reorder}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {actionLoading.reorder ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RotateCcw className="w-4 h-4" />
                )}
                <span>Reorder</span>
              </button>

              {canCancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={actionLoading.cancel}
                  className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  {actionLoading.cancel ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>Cancel Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Order Status Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${statusConfig.bg}`}>
                <StatusIcon className={`w-8 h-8 ${statusConfig.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {order.status_display || order.status}
                </h2>
                <p className="text-gray-600">
                  Order placed on {formatDate(order.created_at)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900">
                ${parseFloat(order.total_amount || 0).toFixed(2)}
              </p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                {order.payment_status_display || order.payment_status}
              </span>
            </div>
          </div>

          {/* Order Timeline */}
          {order.status_history && order.status_history.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {order.status_history.map((history, index) => (
                  <div key={history.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${index === 0 ? 'bg-[#F9B651]' : 'bg-gray-300'
                      }`}></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">
                          {history.status_display || history.status}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(history.created_at)}
                        </p>
                      </div>
                      {history.notes && (
                        <p className="text-sm text-gray-600 mt-1">{history.notes}</p>
                      )}
                      {history.changed_by_name && (
                        <p className="text-xs text-gray-500 mt-1">
                          Updated by {history.changed_by_name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items && order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product_image ? (
                        <img
                          src={item.product_image}
                          alt={item.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                      <div className="w-full h-full hidden items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.product_sku}</p>
                      {item.variant && (
                        <p className="text-sm text-gray-600">Variant: {item.variant}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ${parseFloat(item.unit_price || 0).toFixed(2)}
                        </p>
                        <p className="font-semibold text-gray-900">
                          ${parseFloat(item.total_price || 0).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transaction Details */}
            {order.transaction && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono text-sm">{order.transaction.transaction_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{order.transaction.payment_method_display}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Info:</span>
                    <span>{order.transaction.masked_payment_info}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.transaction.is_successful
                        ? 'text-green-700 bg-green-100'
                        : 'text-red-700 bg-red-100'
                      }`}>
                      {order.transaction.status_display}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processed:</span>
                    <span>{formatDate(order.transaction.processed_at || order.transaction.created_at)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Order Summary & Details */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span>${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>${parseFloat(order.shipping_cost || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax:</span>
                  <span>${parseFloat(order.tax_amount || 0).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${parseFloat(order.total_amount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Delivery Address</p>
                    <div className="text-sm text-gray-600 mt-1">
                      {order.full_shipping_address ?
                        order.full_shipping_address.split('\n').map((line, index) => (
                          <div key={index}>{line}</div>
                        )) :
                        `${order.shipping_first_name} ${order.shipping_last_name}, ${order.shipping_address_line_1}, ${order.shipping_city}, ${order.shipping_state} ${order.shipping_postal_code}`
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Shipping Method</p>
                    <p className="text-sm text-gray-600">{order.shipping_method || 'Standard Shipping'}</p>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="flex items-center space-x-3">
                    <Package className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Tracking Number</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-mono text-gray-600">{order.tracking_number}</span>
                        <button
                          onClick={() => copyTrackingNumber(order.tracking_number)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="Copy tracking number"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        {copySuccess && <span className="text-green-600 text-xs">{copySuccess}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {order.estimated_delivery_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">{formatDate(order.estimated_delivery_date)}</p>
                    </div>
                  </div>
                )}

                {order.notes && (
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Special Instructions</p>
                      <p className="text-sm text-gray-600 mt-1">{order.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{order.customer_name}</p>
                    {order.customer_id && (
                      <p className="text-sm text-gray-600">ID: {order.customer_id}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">{order.customer_email}</p>
                  </div>
                </div>

                {order.customer_phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">{order.customer_phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Related Products */}
            {order.related_products && order.related_products.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">You Might Also Like</h3>
                <div className="space-y-4">
                  {order.related_products.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                        <div className="w-full h-full hidden items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-sm text-gray-600">${parseFloat(product.price || 0).toFixed(2)}</p>
                      </div>
                      <Link
                        href={`/Pages/product/${product.id}`}
                        className="text-[#F9B651] hover:text-[#e0a446] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}