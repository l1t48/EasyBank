import Navbar from "../Components/General-Componenets/Navbar";
import HeroSection from "../Components/Home-Components/HeroSection";
import FeaturesSection from "../Components/Home-Components/FeaturesSection";
import TrustSection from "../Components/Home-Components/TrustSection";
import CTASection from "../Components/Home-Components/CTASection";
import Footer from "../Components/General-Componenets/Footer";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="main-content">
        <HeroSection />
        <FeaturesSection />
        <TrustSection />
        <CTASection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
