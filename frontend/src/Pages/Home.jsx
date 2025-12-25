import Navbar from "../Components/General-Componenets/Navbar";
import HeroSection from "../Components/Home-Components/HeroSection";
import FeaturesSection from "../Components/Home-Components/FeaturesSection";
import TrustSection from "../Components/Home-Components/TrustSection";
import CTASection from "../Components/Home-Components/CTASection";
import Footer from "../Components/General-Componenets/Footer";
import Toast from "../Context/Toast";
import { useState, useEffect } from "react";

function Home() {
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("info");

  useEffect(() => {
    const toastShown = localStorage.getItem("TestToast");
    if (!toastShown) {
      setToastMsg(`For smoother testing, access: ${import.meta.env.VITE_API_FRONTEND_URL}/test`);
      setToastType("info");
      setShowToast(true);
      localStorage.setItem("TestToast", "true");
    }
    console.info(`For smoother testing, access: ${import.meta.env.VITE_API_FRONTEND_URL}/test`);
  }, []);

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
      <Toast
        message={toastMsg}
        show={showToast}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Home;
