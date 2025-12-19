import { AMOUNT_OF_STARS } from "../../Data/Global_variables";
import { testimonials } from "../../Data/Testimonials";

function TrustSection() {
    const renderStars = (count) => {
        return Array.from({ length: AMOUNT_OF_STARS }, (_, i) => (
            <span key={i} className={`text-yellow-400`}>
                {i < count ? "★" : "☆"}
            </span>
        ));
    };

    return (
        <section className="w-full bg-[var(--bg)] py-16 px-4 duration-300 transition-colors">
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-[var(--nav-text)]">
                    Trusted by Many
                </h2>

                <div className="grid gap-12 sm:grid-cols-1 xl:grid-cols-3">
                    {testimonials.map((t, index) => (
                        <div
                            key={index}
                            className="bg-[var(--nav-bg)] text-[var(--nav-text)] rounded-xl p-6 shadow-lg flex flex-col justify-between hover:scale-105 transition-transform duration-300"
                        >
                            <div className="mb-4 text-xl">{renderStars(t.rating)}</div>
                            <p className="text-sm sm:text-base md:text-lg mb-4 text-[var(--text-reverse)]">&quot;{t.quote}&quot;</p>
                            <p className="font-semibold text-right">— {t.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrustSection;