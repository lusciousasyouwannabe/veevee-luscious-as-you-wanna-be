import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BestSellersSection from "@/components/BestSellersSection";
import BrandStorySection from "@/components/BrandStorySection";
import TransformationSection from "@/components/TransformationSection";
import RitualBundlesSection from "@/components/RitualBundlesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <BestSellersSection />
      <BrandStorySection />
      <TransformationSection />
      <RitualBundlesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;
