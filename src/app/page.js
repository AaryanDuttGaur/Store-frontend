import HeroBanner from "@/component/HomePage/HeroBanner";
import TaglineSection from "@/component/HomePage/Tagline";
import LatestCollection from "@/component/HomePage/BestSeller";
import FeaturesSection from "@/component/HomePage/feature";
import BenefitsSection from "@/component/HomePage/Benefit";
import Testimonial from "@/component/HomePage/Testimonial";
import GuideSection from "@/component/HomePage/GuideSection";
import CallToAction from "@/component/HomePage/calltoaction";
export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <TaglineSection/>
      <FeaturesSection/>
      <BenefitsSection/>
      {/* <LatestCollection/> */}
      <Testimonial/>
      <GuideSection/>
      <CallToAction/>
      {/* Other sections */}
    </div>
  );
}
