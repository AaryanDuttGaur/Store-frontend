"use client";

export default function BenefitsSection() {
  return (
    <section className="bg-[#FFE7C4] py-20 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Heading + Paragraph */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-12">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Discover the Unmatched Benefits <br />
            of Shopping with Us Today!
          </h2>

          {/* Paragraph */}
          <p className="text-gray-700 text-lg leading-relaxed">
            Experience the perfect blend of fashion and value tailored just for you. 
            We provide convenience, affordability, and unmatched service, making your 
            shopping journey smoother than ever before. Elevate your wardrobe with 
            confidence — because you deserve the best in every purchase.
          </p>
        </div>

        {/* Big Banner Image */}
        <div className="w-full h-356 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="/images/12.jpg"
            alt="Shopping Benefits"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
