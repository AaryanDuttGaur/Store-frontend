"use client";

import Link from "next/link";

export default function TaglineSection() {
  return (
    <section className="bg-white py-12 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Left Content */}
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Discover Your Style with Our Trendy Clothing
          </h2>
          <p className="text-gray-700 mb-6">
            Explore our curated collection of fashionable apparel designed for every occasion. 
            Shop now and elevate your wardrobe with unique pieces that express your individuality.
          </p>
          <div className="flex gap-4">
            <Link
              href="/Pages/shop"
              className="px-6 py-3 bg-[#F9B651] text-white rounded-lg shadow-md hover:bg-orange-600 transition"
            >
              Shop
            </Link>
          </div>
        </div>

        {/* Right Side (Image) */}
        <div className="flex justify-center">
          <div className="w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <img
              src="/images/smile.jpg"
              alt="Fashion"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
