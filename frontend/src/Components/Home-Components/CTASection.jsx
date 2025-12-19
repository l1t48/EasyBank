import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center justify-center text-center transition-colors duration-300 bg-[var(--nav-bg)]" aria-label="Call to action">
      <div className="relative z-10 max-w-3xl animate__animated animate__fadeInUp animate__slower px-4">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-[var(--nav-text)]">
          Start Your Banking Journey
        </h2>

        <p className="text-base sm:text-md md:text-lg lg:text-xl mb-8 text-[var(--text)] opacity-95">
          Join thousands who trust our secure and user-friendly platform for modern banking.
        </p>

        <button
          onClick={() => navigate("/auth-page")}
          className="bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] px-8 py-3 rounded-lg font-semibold text-lg shadow-md transition-all duration-300"
        >
          Create Account
        </button>
      </div>
    </section>
  );
}

export default CTASection;