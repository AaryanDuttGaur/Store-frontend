"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
const slides = [
  {
    id: 1,
    image: "/images/smile.jpg",
    title: "Discover Your Style",
    description: "Explore curated collections of trendy fashion apparel.",
  },
  {
    id: 2,
    image: "/images/portrait-smiling-beautiful.jpg",
    title: "Elevate Your Wardrobe",
    description: "Unique designs that express your individuality.",
  },
  {
    id: 3,
    image: "/images/woman-with-shopping.jpg",
    title: "Trendy & Affordable",
    description: "Stay stylish without breaking the bank.",
  },
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);
  const intervalRef = useRef(null);
  const isAnimating = useRef(false);

  const showSlide = (dir, targetIndex = null) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const slidesEls = sliderRef.current.querySelectorAll(".slide");

    const current = slidesEls[index];
    const nextIndex =
      targetIndex !== null
        ? targetIndex
        : (index + dir + slides.length) % slides.length;

    const next = slidesEls[nextIndex];

    // Position next slide offscreen
    gsap.set(next, {
      x: targetIndex !== null ? "100%" : dir > 0 ? "100%" : "-100%",
      zIndex: 2,
    });
    gsap.set(current, { zIndex: 1 });

    // Animate
    gsap.to(current, {
      x: targetIndex !== null ? "-100%" : dir > 0 ? "-100%" : "100%",
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(next, {
      x: "0%",
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setIndex(nextIndex);
        isAnimating.current = false;
      },
    });
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      showSlide(1);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [index]);

  return (
    <div
      ref={sliderRef}
      className="relative w-full h-[600px] overflow-hidden bg-gray-100 shadow-xl object-center "
    >
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className="slide absolute inset-0 flex flex-col items-center justify-center text-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${slide.image})`,
            zIndex: i === index ? 2 : 1,
          }}
        >
          <div className="bg-black/50 w-full h-full flex flex-col items-center justify-center p-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {slide.title}
            </h2>
            <p className="text-lg text-gray-200 mb-6">{slide.description}</p>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-[#F9B651] text-white rounded-xl shadow-lg hover:bg-orange-600 transition">
                <Link href='/Pages/shop'> Shop Now</Link>
              </button>
              <button className="px-6 py-3 bg-white text-black rounded-xl shadow-lg hover:bg-gray-100 transition">
                <Link href='/Pages/about'>Learn More</Link> 
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows (desktop only) */}
      <button
        onClick={() => showSlide(-1)}
        className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full z-50"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={() => showSlide(1)}
        className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-3 rounded-full z-50"
      >
        <ChevronRight />
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => showSlide(1, i)}
            className={`w-4 h-4 rounded-full transition ${
              i === index
                ? "bg-[#F9B651] scale-110"
                : "bg-white/70 hover:bg-white"
            }`}
          ></button>
        ))}
      </div>
    </div>
  );
}
