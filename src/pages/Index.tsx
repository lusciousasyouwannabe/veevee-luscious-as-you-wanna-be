import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BestSellersSection from "@/components/BestSellersSection";
import BrandStorySection from "@/components/BrandStorySection";
import TransformationSection from "@/components/TransformationSection";

import TestimonialsSection from "@/components/TestimonialsSection";
import NewsletterSection from "@/components/NewsletterSection";
import SubscriptionSection from "@/components/SubscriptionSection";
import FinalCTASection from "@/components/FinalCTASection";
import Footer from "@/components/Footer";
import Seo, { SITE_URL } from "@/components/Seo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
    <Seo
      title="VeeVee Luscious — Luxury Body Butter, Scrubs & Bath Bars"
      description="Handcrafted luxury bath and body care: whipped body butters, sugar scrubs, bath bars and massage oils that leave skin silky, radiant and deeply nourished."
      path="/"
      jsonLd={[
        { "@context": "https://schema.org", "@type": "Organization", name: "VeeVee Luscious", url: SITE_URL, slogan: "Luscious As You Wanna Be", description: "Luxury handcrafted bath and body products." },
        { "@context": "https://schema.org", "@type": "WebSite", name: "VeeVee Luscious", url: SITE_URL },
      ]}
    />
      <Navbar />
      <HeroSection />
      <BestSellersSection />
      <BrandStorySection />
      <TransformationSection />
      
      <TestimonialsSection />
      <NewsletterSection />
      <SubscriptionSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};

export default Index;

