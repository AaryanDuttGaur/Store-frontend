"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Copy,
  Download,
  Receipt,
  Shield,
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Eye,
  FileText,
  Activity,
  Loader2
} from "lucide-react";

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useParams();
  
  // Extract transaction_id from params - this should match your folder name
  const transactionId = params?.transaction_id;
  
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('=== DEBUGGING INFO ===');
    console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');
    console.log('Params object:', params);
    console.log('Transaction ID:', transactionId);
    console.log('typeof transaction ID:', typeof transactionId);
    console.log('======================');
  }, [params, transactionId]);

  useEffect(() => {
    if (!transactionId) {
      console.error('No transaction ID found in params');
      setError('No transaction ID provided');
      setLoading(false);
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error('No access token found');
      router.push('/auth/login');
      return;
    }

    fetchTransactionDetails(accessToken);
  }, [transactionId, router]);

  const fetchTransactionDetails = async (token) => {
    setLoading(true);
    setError(null);
    
    console.log(`Fetching transaction: ${transactionId}`);
    
    try {
      const url = `http://127.0.0.1:8000/api/orders/transactions/${transactionId}/`;
      console.log('API URL:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Transaction data received:', data);
        setTransaction(data);
      } else if (response.status === 401) {
        console.error('Unauthorized - redirecting to login');
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_data");
        router.push('/auth/login');
      } else if (response.status === 404) {
        console.error('Transaction not found');
        setError(`Transaction ${transactionId} not found. Please check if this transaction belongs to your account.`);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', errorData);
        setError(errorData.message || errorData.detail || `Failed to load transaction (Status: ${response.status})`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      setError(`Network error: ${error.message}. Please check your connection and try again.`);
    } finally {
      setLoading(false);
    }
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
          bg: 'bg-green-100',
          text: 'Completed'
        };
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-700',
          bg: 'bg-yellow-100',
          text: 'Pending'
        };
      case 'processing':
        return {
          icon: RefreshCw,
          color: 'text-blue-700',
          bg: 'bg-blue-100',
          text: 'Processing'
        };
      case 'failed':
        return {
          icon: XCircle,
          color: 'text-red-700',
          bg: 'bg-red-100',
          text: 'Failed'
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          text: 'Cancelled'
        };
      case 'refunded':
        return {
          icon: TrendingDown,
          color: 'text-purple-700',
          bg: 'bg-purple-100',
          text: 'Refunded'
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-700',
          bg: 'bg-gray-100',
          text: status || 'Unknown'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
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

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed: ', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const downloadReceipt = () => {
    // Mock download functionality
    const receiptData = {
      transaction_id: transaction.transaction_id,
      amount: transaction.amount,
      date: transaction.created_at,
      status: transaction.status,
      payment_method: transaction.payment_method_display || transaction.payment_method,
      order: transaction.order
    };
    
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `receipt_${transaction.transaction_id}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-[#F9B651] animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading transaction details...</p>
            <p className="mt-2 text-sm text-gray-500">Transaction ID: {transactionId}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Transaction</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="text-sm text-gray-500 mb-6 bg-gray-50 p-4 rounded">
              <p><strong>Transaction ID:</strong> {transactionId}</p>
              <p><strong>URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => fetchTransactionDetails(localStorage.getItem("access_token"))}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </button>
              <Link
                href="/account/transactions"
                className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Transactions
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!transaction) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Transaction Not Found</h3>
            <p className="text-gray-600 mb-6">The transaction you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              href="/account/transactions"
              className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transactions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const typeConfig = getTransactionTypeConfig(transaction.transaction_type);
  const statusConfig = getStatusConfig(transaction.status);
  const TypeIcon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/account/transaction"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transactions
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600 mt-1">#{transaction.transaction_id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => copyToClipboard(transaction.transaction_id)}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
            <button
              onClick={downloadReceipt}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg border transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Transaction Overview Card */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className={`p-4 rounded-lg ${typeConfig.bg}`}>
                <TypeIcon className={`w-8 h-8 ${typeConfig.color}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatAmount(transaction.amount, transaction.transaction_type)}
                </h2>
                <p className="text-gray-600 capitalize">
                  {transaction.transaction_type?.replace('_', ' ') || 'Payment'}
                </p>
              </div>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-lg ${statusConfig.bg}`}>
              <StatusIcon className={`w-5 h-5 ${statusConfig.color} mr-2`} />
              <span className={`font-medium ${statusConfig.color}`}>
                {transaction.status_display || statusConfig.text}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Date Created</span>
              </div>
              <p className="text-gray-900">{formatDate(transaction.created_at)}</p>
            </div>
            
            {transaction.processed_at && (
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">Date Processed</span>
                </div>
                <p className="text-gray-900">{formatDate(transaction.processed_at)}</p>
              </div>
            )}
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Gateway</span>
              </div>
              <p className="text-gray-900">{transaction.gateway || 'Payment Gateway'}</p>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <p className="text-gray-900 font-medium">
                {transaction.payment_method_display || transaction.payment_method}
              </p>
              {transaction.masked_payment_info && (
                <p className="text-sm text-gray-500 font-mono mt-1">
                  {transaction.masked_payment_info}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <p className="text-gray-900">{transaction.currency || 'USD'}</p>
            </div>
            
            {transaction.gateway_transaction_id && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gateway Transaction ID</label>
                <p className="text-gray-900 font-mono text-sm bg-gray-50 p-2 rounded border">
                  {transaction.gateway_transaction_id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Information */}
        {transaction.order && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Related Order
            </h3>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">
                  Order #{typeof transaction.order === 'object' ? (transaction.order.order_id || transaction.order.id) : transaction.order}
                </p>
                <p className="text-sm text-gray-600">
                  {typeof transaction.order === 'object' && transaction.order.status 
                    ? `Status: ${transaction.order.status}` 
                    : 'View order details'}
                </p>
              </div>
              <Link
                href={`/account/orders/${typeof transaction.order === 'object' ? (transaction.order.order_id || transaction.order.id) : transaction.order}`}
                className="inline-flex items-center px-4 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors text-sm font-medium"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Order
              </Link>
            </div>
          </div>
        )}

        {/* Transaction Timeline */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Transaction Timeline
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full ${statusConfig.bg} flex items-center justify-center`}>
                  <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  Transaction {transaction.status_display || transaction.status}
                </p>
                <p className="text-sm text-gray-600">
                  {transaction.processed_at 
                    ? formatDate(transaction.processed_at)
                    : formatDate(transaction.created_at)
                  }
                </p>
                {transaction.failure_reason && (
                  <p className="text-sm text-red-600 mt-1">
                    Reason: {transaction.failure_reason}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-blue-700" />
                </div>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Transaction Initiated</p>
                <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                <p className="text-sm text-gray-500">
                  Transaction #{transaction.transaction_id} was created
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security & Verification
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Payment secured with encryption</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Transaction verified by gateway</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-700">Card information tokenized</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Transaction ID:</span>
                <p className="text-sm text-gray-900 font-mono">{transaction.transaction_id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Security Level:</span>
                <p className="text-sm text-green-600 font-medium">High</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Fraud Check:</span>
                <p className="text-sm text-green-600 font-medium">
                  {transaction.is_successful ? 'Passed' : 'Review Required'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/account/transactions"
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Transactions
          </Link>
          
          {transaction.order && (
            <Link
              href={`/account/orders/${typeof transaction.order === 'object' ? (transaction.order.order_id || transaction.order.id) : transaction.order}`}
              className="inline-flex items-center px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors font-medium"
            >
              <Receipt className="w-4 h-4 mr-2" />
              View Order
            </Link>
          )}
          
          <button
            onClick={downloadReceipt}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </button>
          
          <button
            onClick={() => fetchTransactionDetails(localStorage.getItem("access_token"))}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}