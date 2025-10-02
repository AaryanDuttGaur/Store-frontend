import Link from "next/link";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F9B651] text-white py-12 mt-16">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-8">
        
        {/* Company Information & Newsletter */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4 text-white">Velore</h2>
          <p className="mb-4 text-white leading-relaxed">
            Your trusted partner for premium products and exceptional shopping experiences. 
            We're committed to quality, reliability, and customer satisfaction.
          </p>
          
          {/* Newsletter Signup */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2 text-white">Stay Updated</h3>
            <p className="text-sm text-white mb-3">
              Subscribe to receive exclusive offers, new product updates, and shopping tips.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email address"
                className="px-4 py-2 rounded-l-lg border border-white/20 flex-1 focus:outline-none focus:ring-2 focus:ring-white text-gray-800 placeholder-gray-500"
              />
              <button className="bg-white text-[#F9B651] px-6 rounded-r-lg hover:bg-gray-100 transition-colors font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Customer Service</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/help" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link 
                href="/account/orders" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Order Status
              </Link>
            </li>
            <li>
              <Link 
                href="/shipping" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Shipping Info
              </Link>
            </li>
            <li>
              <Link 
                href="/returns" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Returns & Exchanges
              </Link>
            </li>
            <li>
              <Link 
                href="/warranty" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Product Warranty
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Company</h3>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/about" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/careers" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Careers
              </Link>
            </li>
            <li>
              <Link 
                href="/press" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Press & Media
              </Link>
            </li>
            <li>
              <Link 
                href="/investors" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Investor Relations
              </Link>
            </li>
            <li>
              <Link 
                href="/sustainability" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Sustainability
              </Link>
            </li>
            <li>
              <Link 
                href="/affiliate" 
                className="text-white px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition block"
              >
                Affiliate Program
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="font-semibold mb-4 text-lg text-white">Get In Touch</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition group">
              <Phone className="w-5 h-5 mt-0.5 flex-shrink-0 text-white group-hover:text-[#F9B651]" />
              <div>
                <p className="font-medium text-white group-hover:text-[#F9B651]">Customer Support</p>
                <p className="text-sm text-white group-hover:text-[#F9B651]">1-800-SHOP-NOW</p>
                <p className="text-sm text-white group-hover:text-[#F9B651]">Mon-Fri 9AM-8PM EST</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition group">
              <Mail className="w-5 h-5 mt-0.5 flex-shrink-0 text-white group-hover:text-[#F9B651]" />
              <div>
                <p className="font-medium text-white group-hover:text-[#F9B651]">Email Support</p>
                <p className="text-sm text-white group-hover:text-[#F9B651]">support@shopcraft.com</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition group">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-white group-hover:text-[#F9B651]" />
              <div>
                <p className="font-medium text-white group-hover:text-[#F9B651]">Headquarters</p>
                <p className="text-sm text-white group-hover:text-[#F9B651]">123 Commerce Street<br />New York, NY 10001</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 px-3 py-2 rounded-lg hover:bg-white hover:text-[#F9B651] transition group">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-white group-hover:text-[#F9B651]" />
              <div>
                <p className="font-medium text-white group-hover:text-[#F9B651]">Business Hours</p>
                <p className="text-sm text-white group-hover:text-[#F9B651]">Mon-Fri: 9AM-8PM EST<br />Sat-Sun: 10AM-6PM EST</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-8 border-t border-white/20">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-white">
            © 2024 ShopCraft. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link 
              href="/privacy" 
              className="text-sm text-white px-3 py-1 rounded hover:bg-white hover:text-[#F9B651] transition"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-white px-3 py-1 rounded hover:bg-white hover:text-[#F9B651] transition"
            >
              Terms of Service
            </Link>
            <Link 
              href="/cookies" 
              className="text-sm text-white px-3 py-1 rounded hover:bg-white hover:text-[#F9B651] transition"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}