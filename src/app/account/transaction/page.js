"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Eye,
  Search,
  Filter,
  Download,
  Loader2,
  ArrowUpDown,
  Receipt,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";

export default function TransactionListPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    transaction_type: '',
    status: '',
    payment_method: '',
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

    fetchTransactions(accessToken);
  }, [filters, sortBy, currentPage, router]);

  const fetchTransactions = async (token) => {
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

      const response = await fetch(`http://127.0.0.1:8000/api/orders/transactions/?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTransactions(data.results || []);
        setTotalPages(Math.ceil(data.count / 10) || 1);
        
        // Calculate basic stats from transactions
        if (data.results) {
          calculateStats(data.results);
        }
      } else if (response.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        setError(errorData.message || errorData.detail || 'Failed to load transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionList) => {
    const totalTransactions = transactionList.length;
    const completedTransactions = transactionList.filter(t => t.status === 'completed');
    const totalAmount = completedTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const refunds = transactionList.filter(t => t.transaction_type === 'refund');
    const totalRefunds = refunds.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
    const pendingTransactions = transactionList.filter(t => t.status === 'pending').length;
    const failedTransactions = transactionList.filter(t => t.status === 'failed').length;

    setStats({
      total_transactions: totalTransactions,
      total_amount: totalAmount,
      total_refunds: totalRefunds,
      pending_transactions: pendingTransactions,
      failed_transactions: failedTransactions,
      success_rate: totalTransactions > 0 ? ((completedTransactions.length / totalTransactions) * 100).toFixed(1) : 0
    });
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      transaction_type: '',
      status: '',
      payment_method: '',
      search: '',
      date_from: '',
      date_to: '',
      min_amount: '',
      max_amount: ''
    });
    setCurrentPage(1);
  };

  const getTransactionTypeConfig = (type) => {
    switch (type?.toLowerCase()) {
      case 'payment':
        return {
          icon: CreditCard,
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          border: 'border-blue-200'
        };
      case 'refund':
        return {
          icon: TrendingDown,
          color: 'text-red-700',
          bg: 'bg-red-100',
          border: 'border-red-200'
        };
      case 'partial_refund':
        return {
          icon: TrendingDown,
          color: 'text-orange-700',
          bg: 'bg-orange-100',
          border: 'border-orange-200'
        };
      default:
        return {
          icon: DollarSign,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          border: 'border-gray-200'
        };
    }
  };

  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-700',
          bg: 'bg-green-100'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-700',
          bg: 'bg-yellow-100'
        };
      case 'processing':
        return {
          icon: RefreshCw,
          color: 'text-blue-700',
          bg: 'bg-blue-100'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-700',
          bg: 'bg-red-100'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-700',
          bg: 'bg-gray-100'
        };
      case 'refunded':
        return {
          icon: TrendingDown,
          color: 'text-purple-700',
          bg: 'bg-purple-100'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-700',
          bg: 'bg-gray-100'
        };
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

  const formatAmount = (amount, type) => {
    const value = parseFloat(amount || 0).toFixed(2);
    if (type === 'refund' || type === 'partial_refund') {
      return `-$${value}`;
    }
    return `$${value}`;
  };

  if (loading && transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#F9B651] animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading your transactions...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Transaction History</h1>
            <p className="text-gray-600 mt-1">Track all your payments and refunds</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fetchTransactions(localStorage.getItem("access_token"))}
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/account/orders"
              className="flex items-center space-x-2 px-6 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <Receipt className="w-4 h-4" />
              <span>View Orders</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && Object.keys(stats).length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total_transactions || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Paid</p>
                  <p className="text-2xl font-bold text-gray-900">${parseFloat(stats.total_amount || 0).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Refunds</p>
                  <p className="text-2xl font-bold text-gray-900">${parseFloat(stats.total_refunds || 0).toFixed(2)}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.success_rate || 0}%</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600" />
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
                  placeholder="Transaction ID, Order ID..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={filters.transaction_type}
                onChange={(e) => handleFilterChange('transaction_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="payment">Payment</option>
                <option value="refund">Refund</option>
                <option value="partial_refund">Partial Refund</option>
              </select>
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
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="cancelled">Cancelled</option>
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
                <option value="-amount">Highest Amount</option>
                <option value="amount">Lowest Amount</option>
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

        {/* Transactions List */}
        {transactions.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Transactions Found</h3>
            <p className="text-gray-600 mb-6">
              {Object.values(filters).some(v => v !== '') 
                ? "No transactions match your current filters. Try adjusting your search criteria."
                : "You haven't made any transactions yet."
              }
            </p>
            <Link
              href="/account/orders"
              className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <Receipt className="w-4 h-4 mr-2" />
              View Orders
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
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
                      Payment Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.map((transaction) => {
                    const typeConfig = getTransactionTypeConfig(transaction.transaction_type);
                    const statusConfig = getStatusConfig(transaction.status);
                    const TypeIcon = typeConfig.icon;
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-lg ${typeConfig.bg} mr-3`}>
                              <TypeIcon className={`w-4 h-4 ${typeConfig.color}`} />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 font-mono">
                                #{transaction.transaction_id}
                              </div>
                              <div className="text-xs text-gray-500">
                                {transaction.gateway || 'Payment Gateway'}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeConfig.bg} ${typeConfig.color}`}>
                            {transaction.transaction_type?.replace('_', ' ') || 'Payment'}
                          </span>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.order ? (
                            <Link
                              href={`/account/orders/${transaction.order.order_id || transaction.order}`}
                              className="text-sm text-[#F9B651] hover:text-[#e0a446] font-medium"
                            >
                              #{transaction.order.order_id || transaction.order}
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">N/A</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {formatDate(transaction.created_at)}
                          </div>
                          {transaction.processed_at && transaction.processed_at !== transaction.created_at && (
                            <div className="text-xs text-gray-500">
                              Processed: {formatDate(transaction.processed_at)}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {transaction.status_display || transaction.status}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.payment_method_display || transaction.payment_method}
                          </div>
                          {transaction.masked_payment_info && (
                            <div className="text-xs text-gray-500 font-mono">
                              {transaction.masked_payment_info}
                            </div>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm font-medium ${
                            transaction.transaction_type === 'refund' || transaction.transaction_type === 'partial_refund'
                              ? 'text-red-600'
                              : 'text-gray-900'
                          }`}>
                            {formatAmount(transaction.amount, transaction.transaction_type)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {transaction.currency || 'USD'}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/account/transaction/${transaction.transaction_id}`}
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

        {loading && transactions.length > 0 && (
          <div className="text-center mt-8">
            <Loader2 className="w-6 h-6 text-[#F9B651] animate-spin mx-auto" />
            <p className="mt-2 text-gray-600">Updating transactions...</p>
          </div>
        )}
      </div>
    </div>
  );
}