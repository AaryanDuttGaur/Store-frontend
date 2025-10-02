"use client";
import API_BASE_URL from '@/lib/api';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Changed from "next/router" to "next/navigation"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Star, 
  Heart, 
  ShoppingCart, 
  X, 
  Loader2,
  SlidersHorizontal,
  ArrowUpDown,
  Tag,
  ChevronUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('-created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  // Cart states
  const [addingToCart, setAddingToCart] = useState({});
  const [cartMessage, setCartMessage] = useState('');
  const [user, setUser] = useState(null);

  // Initialize router
  const router = useRouter();

  // Check authentication and get user data
  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userData = localStorage.getItem("user_data");
    
    if (accessToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    fetchProducts();
    fetchFiltersData();
  }, [currentPage, searchQuery, selectedCategory, selectedBrand, priceRange, sortBy]);

  // Fetch products with filters
  const fetchProducts = async () => {
  setLoading(true);
  setError('');
  
  try {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      ordering: sortBy,
    });
    
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedBrand) params.append('brand', selectedBrand);
    if (priceRange.min) params.append('min_price', priceRange.min);
    if (priceRange.max) params.append('max_price', priceRange.max);
    
    // FIXED: Changed from / to ? before params
    const response = await fetch(`${API_BASE_URL}/api/products/products?${params}`);
    
    if (response.ok) {
      const data = await response.json();
      setProducts(data.results || []);
      setTotalPages(Math.ceil((data.count || 0) / 12));
      setTotalProducts(data.count || 0);
      
      // Set filter options if available
      if (data.filters) {
        setCategories(data.filters.categories || []);
        setBrands(data.filters.brands || []);
      }
    } else {
      setError('Failed to fetch products');
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    setError('Network error. Please check your connection.');
  } finally {
    setLoading(false);
  }
};
  // Fetch filter options
  const fetchFiltersData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products/filters/`);
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories || []);
        setBrands(data.brands || []);
      }
    } catch (err) {
      console.error('Error fetching filters:', err);
    }
  };

  // Add to cart function
  const addToCart = async (productId, productName) => {
    // Check if user is logged in
    if (!user) {
      setCartMessage('Please login to add items to cart');
      setTimeout(() => setCartMessage(''), 3000);
      // Redirect to login
      router.push('/auth/login');
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCartMessage(`${productName} added to cart!`);
        
        // Update navbar cart count
        updateNavbarCartCount(data.cart.total_items);
        
        setTimeout(() => setCartMessage(''), 3000);
      } else if (response.status === 401) {
        // Token expired
        localStorage.clear();
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        setCartMessage(errorData.detail || 'Failed to add item to cart');
        setTimeout(() => setCartMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Network error. Please try again.');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Update navbar cart count
  const updateNavbarCartCount = (count) => {
    localStorage.setItem("cart_items", JSON.stringify(
      Array(count).fill({ quantity: 1 })
    ));
    window.dispatchEvent(new Event('cart-updated'));
  };

  // Quick add to cart (one-click)
  const quickAddToCart = async (productId, productName) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [`quick_${productId}`]: true }));

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/quick-add/${productId}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCartMessage(data.message);
        
        // Update navbar cart count
        updateNavbarCartCount(data.cart_summary.total_items);
        
        setTimeout(() => setCartMessage(''), 3000);
      } else if (response.status === 401) {
        localStorage.clear();
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        setCartMessage(errorData.detail || 'Failed to add item to cart');
        setTimeout(() => setCartMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setCartMessage('Network error. Please try again.');
      setTimeout(() => setCartMessage(''), 3000);
    } finally {
      setAddingToCart(prev => ({ ...prev, [`quick_${productId}`]: false }));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: '', max: '' });
    setSortBy('-created_at');
    setCurrentPage(1);
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory) count++;
    if (selectedBrand) count++;
    if (priceRange.min || priceRange.max) count++;
    return count;
  };

  // Product Card Component
  const ProductCard = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
        <div className="relative">
          <Link href={`/Pages/product/${product.id}`}>
            <div className="aspect-square bg-gray-100 overflow-hidden cursor-pointer">
              {product.main_image ? (
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Tag size={48} />
                </div>
              )}
            </div>
          </Link>
          
          {product.is_on_sale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium">
              -{product.discount_percentage}%
            </div>
          )}
          
          {product.featured && (
            <div className="absolute top-3 right-3 bg-[#F9B651] text-white px-2 py-1 rounded-md text-xs font-medium">
              Featured
            </div>
          )}
          
          <button 
            onClick={() => quickAddToCart(product.id, product.name)}
            disabled={!product.is_in_stock || addingToCart[`quick_${product.id}`]}
            className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            {addingToCart[`quick_${product.id}`] ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Heart size={16} />
            )}
          </button>
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <p className="text-sm text-gray-600">{product.category?.name}</p>
            <Link href={`/Pages/product/${product.id}`}>
              <h3 className="font-semibold text-gray-900 hover:text-[#F9B651] transition-colors line-clamp-2 cursor-pointer">
                {product.name}
              </h3>
            </Link>
          </div>
          
          {product.short_description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.short_description}
            </p>
          )}
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={14} 
                  className={`${i < Math.floor(product.average_rating || 0) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'}`} 
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">
                ({product.review_count || 0})
              </span>
            </div>
            
            <div className={`text-xs px-2 py-1 rounded-full ${
              product.is_in_stock 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              {product.compare_price && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.compare_price}
                </span>
              )}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-3 flex flex-col space-y-2">
            <button 
              disabled={!product.is_in_stock}
              onClick={() => router.push(`/Pages/checkout?product=${product.id}&quantity=1`)} // Fixed path to include /Pages/
              className={`w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                product.is_in_stock
                  ? 'bg-[#F9B651] hover:bg-[#e0a446] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart size={16} className="mr-2" />
              Buy Now
            </button>
            
            <div className="flex space-x-2">
              <Link 
                href={`/Pages/product/${product.id}`}
                className="flex-1 flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                View More
              </Link>
              <button 
                onClick={() => addToCart(product.id, product.name)}
                disabled={!product.is_in_stock || addingToCart[product.id]}
                className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  product.is_in_stock
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {addingToCart[product.id] ? (
                  <Loader2 size={14} className="mr-1 animate-spin" />
                ) : (
                  <Heart size={14} className="mr-1" />
                )}
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // List View Product Component
  const ProductListItem = ({ product }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 p-4">
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <Link href={`/Pages/product/${product.id}`} className="flex-shrink-0 self-center">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden mx-auto cursor-pointer">
              {product.main_image ? (
                <img
                  src={product.main_image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Tag size={24} />
                </div>
              )}
            </div>
          </Link>
          
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex-1">
                <p className="text-sm text-gray-600">{product.category?.name}</p>
                <Link href={`/Pages/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-900 hover:text-[#F9B651] transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                </Link>
                {product.short_description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {product.short_description}
                  </p>
                )}
                
                <div className="flex items-center justify-center sm:justify-start space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={`${i < Math.floor(product.average_rating || 0) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-600 ml-1">
                    ({product.review_count || 0})
                  </span>
                </div>
              </div>
              
              <div className="text-center sm:text-right flex-shrink-0">
                <div className="flex items-center justify-center sm:justify-end space-x-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.compare_price && (
                    <span className="text-sm text-gray-500 line-through">
                      ${product.compare_price}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col space-y-2 min-w-[140px]">
                  <button 
                    disabled={!product.is_in_stock}
                    onClick={() => router.push(`/Pages/checkout?product=${product.id}&quantity=1`)} // Fixed path to include /Pages/
                    className={`flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      product.is_in_stock
                        ? 'bg-[#F9B651] hover:bg-[#e0a446] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={16} className="mr-2" />
                    Buy Now
                  </button>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/Pages/product/${product.id}`}
                      className="flex-1 flex items-center justify-center px-2 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      View More
                    </Link>
                    <button 
                      onClick={() => addToCart(product.id, product.name)}
                      disabled={!product.is_in_stock || addingToCart[product.id]}
                      className={`flex-1 flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                        product.is_in_stock
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {addingToCart[product.id] ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Heart size={14} />
                      )}
                    </button>
                  </div>
                  
                  <div className={`text-xs px-2 py-1 rounded-full text-center ${
                    product.is_in_stock 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Cart Message Toast */}
        {cartMessage && (
          <div className="fixed top-24 right-4 z-50 max-w-sm">
            <div className={`p-4 rounded-lg shadow-lg border flex items-start space-x-3 ${
              cartMessage.includes('added') || cartMessage.includes('Increased')
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              {cartMessage.includes('added') || cartMessage.includes('Increased') ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{cartMessage}</p>
                {cartMessage.includes('added') && (
                  <button 
                    onClick={() => router.push('/Pages/cart')}
                    className="text-sm underline hover:no-underline mt-1"
                  >
                    View Cart
                  </button>
                )}
              </div>
              <button 
                onClick={() => setCartMessage('')}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
          
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-base"
                />
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center justify-between sm:justify-end space-x-3">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-white text-[#F9B651] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-[#F9B651] shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-[#F9B651] hover:bg-[#e0a446] text-white rounded-lg transition-colors relative"
              >
                <SlidersHorizontal size={18} className="mr-2" />
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
                {showFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
              </button>
            </div>
          </div>

          {/* Dropdown Filters */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
            showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                
                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => {setSelectedCategory(e.target.value); setCurrentPage(1);}}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-sm"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brands */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => {setSelectedBrand(e.target.value); setCurrentPage(1);}}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-sm"
                  >
                    <option value="">All Brands</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Min */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-sm"
                  />
                </div>

                {/* Price Max */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                  <input
                    type="number"
                    placeholder="999"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-sm"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {setSortBy(e.target.value); setCurrentPage(1);}}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F9B651] focus:border-transparent text-sm"
                  >
                    <option value="-created_at">Newest First</option>
                    <option value="created_at">Oldest First</option>
                    <option value="price">Price: Low to High</option>
                    <option value="-price">Price: High to Low</option>
                    <option value="name">Name: A to Z</option>
                    <option value="-name">Name: Z to A</option>
                  </select>
                </div>
              </div>
              
              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-600 hover:text-[#F9B651] transition-colors"
                >
                  Clear All Filters
                </button>
                
                {(selectedCategory || selectedBrand || priceRange.min || priceRange.max || searchQuery) && (
                  <div className="flex flex-wrap gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center px-2 py-1 bg-[#F9B651] text-white text-xs rounded-full">
                        Search: {searchQuery}
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {categories.find(c => c.id.toString() === selectedCategory)?.name}
                        <button 
                          onClick={() => setSelectedCategory('')}
                          className="ml-1 hover:bg-blue-200 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {selectedBrand && (
                      <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {brands.find(b => b.id.toString() === selectedBrand)?.name}
                        <button 
                          onClick={() => setSelectedBrand('')}
                          className="ml-1 hover:bg-green-200 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                    {(priceRange.min || priceRange.max) && (
                      <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        ${priceRange.min || '0'} - ${priceRange.max || '∞'}
                        <button 
                          onClick={() => setPriceRange({ min: '', max: '' })}
                          className="ml-1 hover:bg-purple-200 rounded-full"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? 'Loading...' : `Showing ${products.length} of ${totalProducts} products`}
            </p>
            {user && (
              <Link 
                href="/Pages/cart" 
                className="text-sm text-[#F9B651] hover:text-[#e0a446] transition-colors"
              >
                View Cart →
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#F9B651] mx-auto mb-4" />
            <p className="text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-700">{error}</p>
            <button 
              onClick={fetchProducts}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && !error && (
          <>
            {products.length > 0 ? (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6' 
                  : 'space-y-4'
              }`}>
                {products.map((product) => (
                  viewMode === 'grid' 
                    ? <ProductCard key={product.id} product={product} />
                    : <ProductListItem key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-full p-6 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <button 
                  onClick={clearFilters}
                  className="px-4 py-2 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">‹</span>
                  </button>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg text-sm ${
                          currentPage === page
                            ? 'bg-[#F9B651] text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">›</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}