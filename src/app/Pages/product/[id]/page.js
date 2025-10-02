"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  ShoppingCart,
  Plus,
  Minus,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Tag,
  Heart,
  Share2,
  TruckIcon,
  Shield,
  RefreshCw,
  CheckCircle,
  X
} from "lucide-react";

export default function ProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [user, setUser] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Check authentication
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

  // Fetch product data when ID is available
  useEffect(() => {
    if (id) {
      fetchProductData(id);
    }
  }, [id]);

  // Fetch product data
  const fetchProductData = async (productId) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/products/${productId}/`);

      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else if (response.status === 404) {
        setError('Product not found');
      } else {
        setError('Failed to load product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Add to cart function
  const addToCart = async () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to add items to cart' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        router.push('/auth/login');
      }, 2000);
      return;
    }

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }

    setAddingToCart(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cart/add/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: quantity
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: `${product.name} added to cart!` });

        // Update navbar cart count
        updateNavbarCartCount(data.cart.total_items);

        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } else if (response.status === 401) {
        localStorage.clear();
        router.push('/auth/login');
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.detail || 'Failed to add item to cart' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } finally {
      setAddingToCart(false);
    }
  };

  // Buy now function
  const buyNow = () => {
    if (!user) {
      setMessage({ type: 'error', text: 'Please login to proceed with purchase' });
      setTimeout(() => {
        setMessage({ type: '', text: '' });
        router.push('/auth/login');
      }, 2000);
      return;
    }

    // Redirect to checkout with product info
    router.push(`/Pages/checkout?product=${product.id}&quantity=${quantity}`);
  };

  // Update navbar cart count
  const updateNavbarCartCount = (count) => {
    localStorage.setItem("cart_items", JSON.stringify(
      Array(count).fill({ quantity: 1 })
    ));
    window.dispatchEvent(new Event('cart-updated'));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-[#F9B651] mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-100 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => fetchProductData(id)}
              className="w-full px-6 py-3 bg-[#F9B651] text-white rounded-lg hover:bg-[#e0a446] transition-colors"
            >
              Try Again
            </button>
            <Link
              href="/Pages/shop"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

        {/* Message Toast */}
        {message.text && (
          <div className="fixed top-24 right-4 z-50 max-w-sm">
            <div className={`p-4 rounded-lg shadow-lg border flex items-start space-x-3 ${message.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }`}>
              {message.type === 'success' ? (
                <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className="font-medium">{message.text}</p>
                {message.type === 'success' && (
                  <button
                    onClick={() => router.push('/Pages/cart')}
                    className="text-sm underline hover:no-underline mt-1"
                  >
                    View Cart
                  </button>
                )}
              </div>
              <button
                onClick={() => setMessage({ type: '', text: '' })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <Link
          href="/Pages/shop"
          className="flex items-center text-gray-600 hover:text-[#F9B651] transition-colors mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImageIndex]?.image}
                  alt={product.images[selectedImageIndex]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Tag size={64} />
                </div>
              )}

              {/* Sale Badge */}
              {product.is_on_sale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-md font-medium">
                  -{product.discount_percentage}% OFF
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="absolute top-4 right-4 bg-[#F9B651] text-white px-3 py-1 rounded-md font-medium">
                  Featured
                </div>
              )}

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
                  <Heart size={20} />
                </button>
                <button className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            {/* Image Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === index
                        ? 'border-[#F9B651]'
                        : 'border-gray-200 hover:border-gray-300'
                      }`}
                  >
                    <img
                      src={image.image}
                      alt={image.alt_text}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">

            {/* Basic Info */}
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <span>{product.category?.name}</span>
                {product.brand && (
                  <>
                    <span>•</span>
                    <span>{product.brand.name}</span>
                  </>
                )}
                <span>•</span>
                <span>SKU: {product.sku}</span>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={`${i < Math.floor(product.average_rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {product.average_rating || 0} ({product.review_count || 0} reviews)
                  </span>
                </div>

                <div className={`text-sm px-3 py-1 rounded-full ${product.is_in_stock
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                  }`}>
                  {product.is_in_stock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl font-bold text-gray-900">
                  ${product.price}
                </span>
                {product.compare_price && (
                  <span className="text-xl text-gray-500 line-through">
                    ${product.compare_price}
                  </span>
                )}
                {product.is_on_sale && (
                  <span className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded">
                    Save ${(product.compare_price - product.price).toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Product Variants */}
            {product.variants && product.variants.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Available Options:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:border-[#F9B651] hover:bg-[#F9B651] hover:text-white transition-colors"
                    >
                      {variant.name} - ${variant.effective_price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selection */}
            <div className="flex items-center space-x-4">
              <span className="font-medium text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-gray-50"
                  disabled={product.track_quantity && quantity >= product.quantity}
                >
                  <Plus size={16} />
                </button>
              </div>
              {product.track_quantity && (
                <span className="text-sm text-gray-600">
                  {product.quantity} available
                </span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={addToCart}
                disabled={!product.is_in_stock || addingToCart}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors border ${product.is_in_stock
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300'
                  }`}
              >
                {addingToCart ? (
                  <Loader2 size={20} className="mr-2 animate-spin" />
                ) : (
                  <ShoppingCart size={20} className="mr-2" />
                )}
                Add to Cart
              </button>

              <button
                onClick={buyNow}
                disabled={!product.is_in_stock}
                className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-colors ${product.is_in_stock
                    ? 'bg-[#F9B651] hover:bg-[#e0a446] text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
              >
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
              <div className="text-center">
                <TruckIcon size={24} className="mx-auto text-[#F9B651] mb-2" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-gray-600">On orders over $50</p>
              </div>
              <div className="text-center">
                <RefreshCw size={24} className="mx-auto text-[#F9B651] mb-2" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-gray-600">30-day return policy</p>
              </div>
              <div className="text-center">
                <Shield size={24} className="mx-auto text-[#F9B651] mb-2" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-gray-600">100% secure checkout</p>
              </div>
            </div>

            {/* Product Attributes */}
            {product.attributes && product.attributes.length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.attributes.map((attr) => (
                    <div key={attr.id} className="flex justify-between">
                      <span className="font-medium text-gray-700">{attr.name}:</span>
                      <span className="text-gray-600">{attr.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <div className="text-gray-700 leading-relaxed prose max-w-none">
                  {product.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {product.related_products && product.related_products.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {product.related_products.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/Pages/product/${relatedProduct.id}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {relatedProduct.main_image ? (
                      <img
                        src={relatedProduct.main_image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Tag size={32} />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#F9B651]">${relatedProduct.price}</span>
                      {relatedProduct.compare_price && (
                        <span className="text-sm text-gray-500 line-through">${relatedProduct.compare_price}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}