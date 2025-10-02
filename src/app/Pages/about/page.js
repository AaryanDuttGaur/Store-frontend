"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Shirt, Headphones, Package, Star, ArrowRight, Users, Target, Heart } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
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
    <main ref={sectionRef} className="w-full">
      {/* Hero Section */}
      <section className="bg-[#FFE7C4] py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-6 fade-up">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Redefining Fashion for Everyone
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We believe fashion should be accessible, sustainable, and expressive. 
            Our mission is to bring you high-quality clothing that makes you feel confident and comfortable.
          </p>
          <div className="relative bg-gradient-to-br from-[#F9B651] to-orange-400 h-64 md:h-96 rounded-lg flex items-center justify-center overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1615418761936-d0929de21855?q=80&w=898&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Fashion store interior with clothing displays"
              className="w-full h-full object-cover object-center rounded-lg"
            />
            <div className="absolute inset-0 bg-transparent bg-opacity-20 rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-white text-center">
                <Heart className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-2xl font-bold">Passion for Fashion</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="fade-up space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#F9B651] rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                About Our Story
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              We are dedicated to bringing you the best in style and comfort.
              Our mission is to provide high-quality products with a seamless
              shopping experience. With a focus on innovation, sustainability,
              and customer satisfaction, we continue to redefine fashion for the
              modern world.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F9B651]">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-[#F9B651]">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
          <div className="fade-up">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80"
              alt="Fashion design team working on new collections"
              className="h-72 md:h-96 w-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#FFE7C4] py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="fade-up text-3xl md:text-4xl font-bold text-gray-900">
            Discover the Amazing Benefits
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Fashionable Collections",
                desc: "Browse through our seasonal collections curated by experts.",
                icon: Shirt,
              },
              {
                title: "24/7 Customer Support",
                desc: "Always available to assist with questions or concerns.",
                icon: Headphones,
              },
              {
                title: "Free Shipping",
                desc: "Enjoy free shipping on all your orders, no minimum required.",
                icon: Package,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="fade-up bg-white rounded-xl shadow-lg p-8 text-left hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-[#F9B651] rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <div className="fade-up">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-8 h-8 text-[#F9B651]" />
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Meet Our Team
              </h2>
            </div>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { name: "John Smith", role: "Creative Director", img: "photo-1472099645785-5658abf4ff4e" },
              { name: "John Smith", role: "Head of Design", img: "photo-1472099645785-5658abf4ff4e" },
              { name: "Sophia Chen", role: "Marketing Lead", img: "photo-1438761681033-6461ffad8d80" },
              { name: "David Wilson", role: "Customer Success", img: "photo-1507003211169-0a1dd7228f2d" }
            ].map((member, i) => (
              <div
                key={i}
                className="fade-up bg-gray-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="relative mb-4">
                  <img 
                    src={`https://images.unsplash.com/${member.img}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={`${member.name} - ${member.role}`}
                    className="h-32 w-32 mx-auto rounded-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-lg text-gray-900">
                  {member.name}
                </h3>
                <p className="text-[#F9B651] text-sm font-medium">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 md:px-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center space-y-12">
          <h2 className="fade-up text-3xl md:text-4xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: "Emily Rodriguez",
                text: "The shopping experience was amazing! Fast delivery and excellent quality.",
                rating: 5,
              },
              {
                name: "Michael Thompson",
                text: "Customer service was super helpful. Highly recommend shopping here!",
                rating: 5,
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="fade-up bg-white rounded-xl shadow-lg p-8 text-left"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-700 italic text-lg mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#F9B651] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="py-20 px-6 md:px-16 text-center bg-[#FFE7C4]">
        <div className="max-w-3xl mx-auto space-y-6 fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Join Our Fashion Journey</h2>
          <p className="text-lg text-gray-700">
            Be part of our growing community. Explore our products, connect with
            us, and experience the future of fashion.
          </p>
          <Link
            href="/Pages/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#F9B651] text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Get In Touch</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </main>
  );
}