"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Link from "next/link";
export default function CallToAction() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      sectionRef.current.querySelectorAll(".fade-up"),
      { y: 40, opacity: 0 },
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
      className="w-full bg-white py-16 px-6 md:px-16"
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div className="fade-up space-y-6 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Shop the Latest Trends Today
          </h2>
          <p className="text-gray-700 max-w-md">
            Discover your style with our exclusive clothing collection.
            Start shopping now and elevate your wardrobe!
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="px-6 py-3 flex items-center gap-2 bg-[#F9B651] text-white rounded-md font-medium hover:bg-orange-600 transition">
          <Link href = '/Pages/shop'>Shop</Link>
          
        </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="fade-up">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Fashion clothing collection display"
            className="h-64 md:h-80 w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  );
}