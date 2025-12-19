import { useContext } from "react";
import heroLight from "../../assets/video/HeroSection-light.mp4?url";
import heroDark from "../../assets/video/HeroSection-dark.mp4?url";
import { ThemeContext } from "../../Context/ThemeContext";
import { useNavigate } from "react-router-dom";

function HeroSection() {
    const { theme } = useContext(ThemeContext);
    const heroVideo = theme === "dark" ? heroDark : heroLight;
    const navigate = useNavigate();

    return (
        <div>
            <div className="relative w-full h-screen overflow-hidden">
                <video
                    key={heroVideo}
                    className="absolute top-0 left-0 w-full h-full object-cover z-0 "
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                />

                <div className="absolute inset-0 z-10 bg-opacity-50 flex flex-col justify-center items-center px-4">
                    <h1
                        className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-center text-[var(--nav-text)] animate__animated animate__backInDown animate__slow duration-300 transition-colors"
                    >
                        Welcome to EasyBank
                    </h1>

                    <p
                        className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 font-bold text-center text-[var(--text)] max-w-2xl drop-shadow animate__animated animate__backInUp animate__slow duration-300 transition-colors"
                    >
                        Manage your finances securely and efficiently.
                    </p>

                    <button type="button" onClick={() => navigate("/auth-page")} className="bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] px-8 py-3 rounded-lg font-semibold text-lg shadow-md duration-300 transition-colors animate__animated animate__backInRight animate__slow text-shadow-lg">
                        Get Started
                    </button>
                </div>
            </div>

        </div>
    );
}

export default HeroSection;