"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Star, Quote } from "lucide-react";

export default function Testimonial() {
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
      className="w-full bg-gray-50 py-20 px-6 md:px-16 flex flex-col items-center"
    >
      {/* Section Header */}
      <div className="max-w-3xl text-center mb-16 fade-up">
        <p className="uppercase text-sm font-semibold tracking-wide text-gray-600 mb-2">
          Testimonials
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          What Our Customers Say
        </h2>
      </div>

      <div className="max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Image */}
        <div className="relative fade-up">
          <div className="bg-gradient-to-br from-[#F9B651] to-orange-400 rounded-2xl shadow-lg p-8 h-[350px] flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">5-Star Experience</h3>
              <p className="text-white text-opacity-90">
                Join thousands of satisfied customers who love shopping with us
              </p>
            </div>
          </div>
        </div>

        {/* Right - Testimonial */}
        <div className="space-y-8 fade-up">
          {/* Quote Icon */}
          <div className="w-12 h-12 bg-[#F9B651] rounded-full flex items-center justify-center">
            <Quote className="w-6 h-6 text-white" />
          </div>

          {/* Stars */}
          <div className="flex gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-yellow-500" />
            ))}
          </div>

          {/* Quote */}
          <blockquote className="text-lg md:text-xl font-medium text-gray-800 leading-relaxed italic">
            "Shopping here was a breeze! The quality of the clothes exceeded my
            expectations and the customer service was outstanding. I'll definitely be coming back for more."
          </blockquote>

          {/* Customer Info */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#F9B651] to-orange-400 rounded-full flex items-center justify-center shadow-md">
                <span className="text-xl font-bold text-white">EJ</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-lg">Emily Johnson</p>
                <p className="text-gray-600 text-sm">
                  Marketing Manager at StyleCo
                </p>
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center gap-3 pt-4">
            <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700">Verified Purchase</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}