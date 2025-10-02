"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (sectionRef.current) {
      const elements = gsap.utils.toArray(
        sectionRef.current.querySelectorAll(".fade-up")
      );

      gsap.fromTo(
        elements,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, []);

  return (
    <main ref={sectionRef} className="w-full bg-white">
      {/* Header Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Left Info */}
          <div className="fade-up space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Contact us
            </h1>
            <p className="text-gray-700 text-lg">
              Our friendly team would love to hear from you.
            </p>
            <ul className="space-y-4">
              <li className="text-gray-800">
                📧 <a href="mailto:email@example.com">email@example.com</a>
              </li>
              <li className="text-gray-800">📞 +1 (555) 000-0000</li>
              <li className="text-gray-800">
                📍 123 Sample St, Sydney NSW 2000 AU
              </li>
            </ul>
          </div>

          {/* Contact Form */}
          <form className="fade-up bg-gray-50 p-8 rounded-lg shadow-md space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First name
                </label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-md focus:ring focus:ring-yellow-200"
                  placeholder="Your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone number
                </label>
                <input
                  type="text"
                  className="w-full mt-2 p-3 border rounded-md focus:ring focus:ring-yellow-200"
                  placeholder="+91 0000000000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full mt-2 p-3 border rounded-md focus:ring focus:ring-yellow-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Choose a topic
              </label>
              <select className="w-full mt-2 p-3 border rounded-md focus:ring focus:ring-yellow-200">
                <option>Select one...</option>
                <option>Support</option>
                <option>Sales</option>
                <option>Feedback</option>
              </select>
            </div>

            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">
                Which best describes you?
              </p>
              <div className="grid grid-cols-2 gap-3 text-gray-700">
                {["First choice", "Second choice", "Third choice", "Fourth choice", "Other"].map(
                  (opt, i) => (
                    <label key={i} className="flex items-center space-x-2">
                      <input type="radio" name="choice" />
                      <span>{opt}</span>
                    </label>
                  )
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                rows={4}
                className="w-full mt-2 p-3 border rounded-md focus:ring focus:ring-yellow-200"
                placeholder="Type your message..."
              ></textarea>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" />
              <span className="text-sm text-gray-600">
                I accept the Terms
              </span>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
