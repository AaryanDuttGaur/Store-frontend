"use client";

import Link from "next/link";

export default function FeaturesSection() {
  const features = [
    {
      title: "Hassle-Free Returns for a Stress-Free Shopping Experience",
      desc: "If an item doesn’t meet your needs, send it back easily and enjoy peace of mind.",
      link: "/Pages/about",
      linkText: "Learn More →",
      img: "/images/8309.jpg",
    },
    {
      title: "24/7 Customer Support to Assist You Anytime",
      desc: "Friendly team available anytime to assist with questions and concerns.",
      link: "/Pages/contact",
      linkText: "Contact →",
      img: "/images/5124556.jpg",
    },
    {
      title: "Enjoy Free Shipping on All Your Orders",
      desc: "Shop confidently knowing you won’t pay for delivery.",
      link: "/Pages/shop",
      linkText: "Shop Now →",
      img: "/images/10945220.jpg",
    },
  ];

  return (
    <section className="bg-[#FFE7C4] py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Discover the Amazing Features <br /> of Our Online Clothing Store
        </h2>
        <p className="text-gray-700 mb-10 max-w-3xl">
          At our online clothing store, we prioritize your shopping experience. Enjoy
          hassle-free returns, 24/7 support, and free shipping on every order —
          making your fashion journey seamless and enjoyable.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Image Placeholder */}
              <div className="h-40 bg-gray-200 flex items-center justify-center">
                <img
                  src={feature.img}
                  alt={feature.title}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4">{feature.desc}</p>
                <Link
                  href={feature.link}
                  className="text-black font-medium hover:underline"
                >
                  {feature.linkText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
