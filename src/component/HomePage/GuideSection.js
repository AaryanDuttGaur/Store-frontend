"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Search, Heart, ShoppingCart } from "lucide-react";

export default function GuideSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".fade-up"),
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      }
    );
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#f6d9b5] py-20 px-6 md:px-16 flex flex-col items-center text-center"
    >
      {/* Heading */}
      <div className="max-w-3xl mb-12 fade-up">
        <p className="uppercase text-sm font-semibold tracking-wide text-gray-700">
          Shop
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
          Your Guide to Shopping with Us
        </h2>
        <p className="text-gray-700 mt-4">
          Discover a seamless shopping experience with our easy-to-navigate
          website. Follow these simple steps to find and purchase your favorite
          clothing items.
        </p>
      </div>

      {/* 3 Steps */}
      <div className="grid md:grid-cols-3 gap-10 mb-12 w-full max-w-6xl">
        {/* Step 1 */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center fade-up hover:shadow-xl transition-shadow duration-300">
          <div className="w-20 h-20 bg-[#F9B651] rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-white" />
          </div>
          <div className="w-8 h-1 bg-[#F9B651] rounded mb-4"></div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Step 1: Browse Our Collections</h3>
          <p className="text-gray-600 leading-relaxed">
            Explore our wide range of clothing categories and discover the latest fashion trends curated just for you.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center fade-up hover:shadow-xl transition-shadow duration-300">
          <div className="w-20 h-20 bg-[#F9B651] rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div className="w-8 h-1 bg-[#F9B651] rounded mb-4"></div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Step 2: Select Your Favorite Items</h3>
          <p className="text-gray-600 leading-relaxed">
            Click on any item to view detailed information, sizing options, and high-quality product images.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center fade-up hover:shadow-xl transition-shadow duration-300">
          <div className="w-20 h-20 bg-[#F9B651] rounded-full flex items-center justify-center mb-6">
            <ShoppingCart className="w-10 h-10 text-white" />
          </div>
          <div className="w-8 h-1 bg-[#F9B651] rounded mb-4"></div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900">Step 3: Add to Cart</h3>
          <p className="text-gray-600 leading-relaxed">
            Choose your preferred size and color, then click "Add to Cart" to proceed with your purchase.
          </p>
        </div>
      </div>
    </section>
  );
}