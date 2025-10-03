"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  Truck,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Eye,
  Search,
  Filter,
  Download,
  Loader2,
  ShoppingBag,
  RefreshCw,
  ChevronRight,
  ArrowUpDown,
  User
} from "lucide-react";

export default function OrdersListPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    payment_status: '',
    search: '',
    date_from: '',
    date_to: '',
    min_amount: '',
    max_amount: ''
  });
  const [sortBy, setSortBy] = useState('-created_at');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }

    fetchOrders(accessToken);
  }, [filters, sortBy, currentPage, router]);

  const fetchOrders = async (token) => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams({
        page: currentPage.toString(),
        ordering: sortBy,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '')
        )
      });

      // const response = await fetch(`http://127.0.0.1:8000/api/orders/list/?${params}`, {
       const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/list/?${params}`,{
      headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.results || []);
        setStats(data.overall_stats || {});
        setTotalPages(Math.ceil(data.count / 10) || 1);
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      payment_status: '',
      search: '',
      date_from: '',
      date_to: '',
      min_amount: '',
      max_amount: ''
    });
    setCurrentPage(1);
  };

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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#F9B651] animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-600 mt-1">Track and manage your orders</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchOrders(localStorage.getItem("access_token"))}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/Pages/shop"
              className="flex items-center space-x-2 px-6 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_orders || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${parseFloat(stats.total_revenue || 0).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.delivered_orders || 0}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pending_orders || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h3>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order ID, product..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
              <select
                value={filters.payment_status}
                onChange={(e) => handleFilterChange('payment_status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
              >
                <option value="">All Payment Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
              >
                <option value="-created_at">Newest First</option>
                <option value="created_at">Oldest First</option>
                <option value="-total_amount">Highest Amount</option>
                <option value="total_amount">Lowest Amount</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Orders List */}
        {orders.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some(v => v !== '') 
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't placed any orders yet. Start shopping to see your orders here."
              }
            </p>
            <Link
              href="/Pages/shop"
              className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{order.order_id}
                            </div>
                            {order.tracking_number && (
                              <div className="text-xs text-gray-500 font-mono">
                                {order.tracking_number}
                              </div>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(order.created_at)}
                          </div>
                          {order.estimated_delivery_date && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <Calendar className="w-3 h-3 mr-1" />
                              Est. {formatDate(order.estimated_delivery_date)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {order.status_display || order.status}
                          </div>
                          {order.is_delivery_overdue && (
                            <div className="flex items-center mt-1">
                              <AlertCircle className="w-3 h-3 text-red-500 mr-1" />
                              <span className="text-xs text-red-600">Overdue</span>
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                            {order.payment_status_display || order.payment_status}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${parseFloat(order.total_amount || 0).toFixed(2)}
                          </div>
                          {order.is_free_shipping && (
                            <div className="text-xs text-green-600">Free Shipping</div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {order.total_items || 0} items
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.item_count || 0} products
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/account/orders/${order.order_id}`}
                            className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Page <span className="font-medium">{currentPage}</span> of{' '}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && orders.length > 0 && (
          <div className="text-center mt-8">
            <Loader2 className="w-6 h-6 text-[#F9B651] animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Updating orders...</p>
          </div>
        )}
      </div>
      
    </div>
  );
}