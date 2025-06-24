import React from "react";
import Navbar from "./Navbar/NavBar";
import HeroSection from "./HeroSection/HeroSection";
import FeaturesSection from "./FeaturesSection/FeaturesSection";
import CTASection from "./CTASection/CTASection";
import Footer from "./Footer/Footer";

const HomePage: React.FC = () => (
  <div>
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <CTASection />
    <Footer />
  </div>
);

export default HomePage;
