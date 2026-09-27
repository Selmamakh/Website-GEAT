import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import WhoWeAre from "@/components/WhoWeAre";
import ValuesScroll from "@/components/ValuesScroll";
import WhatWeDo from "@/components/WhatWeDo";
import StatsSection from "@/components/StatsSection";
import EngineersSection from "@/components/EngineersSection";
import AnnouncementsSection from "@/components/AnnouncementsSection";
import CareersSection from "@/components/CareersSection";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main">
        <HeroSlider />
        <AnnouncementsSection />
        <WhoWeAre />
        <ValuesScroll />
        <WhatWeDo />
        <StatsSection />
        <EngineersSection />
        <CareersSection />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

