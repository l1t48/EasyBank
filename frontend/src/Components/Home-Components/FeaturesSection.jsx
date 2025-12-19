import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { features } from "../../Data/Features";
import { DATA_INDEX_RADIX, INTERSECTION_THRESHOLD, CHEVRON_ICON_SIZE } from "../../Data/Global_variables";

function FeaturesSection() {
    const scrollRef = useRef(null); // Reference to the scrollable container
    const [visibleIndexes, setVisibleIndexes] = useState([]);

    // Scroll function to move cards left or right
    const scroll = (direction) => {
        const { current } = scrollRef;
        if (current) {
            const scrollAmount = current.clientWidth; // Scroll by the width of the container
            current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth", // Smooth scrolling effect
            });
        }
    };

    // -------------------------------------------------------------
    // useEffect: Sets up IntersectionObserver to detect which cards
    // are in focus (centered) in the scrollable container.
    // This allows content inside cards to animate only when in view.
    // -------------------------------------------------------------
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const index = parseInt(entry.target.dataset.index, DATA_INDEX_RADIX);
                    if (entry.isIntersecting) {
                        setVisibleIndexes((prev) => [...prev, index]);
                    } else {
                        setVisibleIndexes((prev) => prev.filter((i) => i !== index));
                    }
                });
            },
            {
                root: scrollRef.current,
                threshold: INTERSECTION_THRESHOLD,
            }
        );

        // Get all children (cards) of the scrollable container
        const cards = scrollRef.current?.children;
        if (cards) {
            // Observe each card with the IntersectionObserver
            Array.from(cards).forEach((card, index) => observer.observe(card));
        }

        // Cleanup: disconnect observer when component unmounts
        return () => observer.disconnect();
    }, []);

    return (
        <section className="w-full h-screen overflow-hidden bg-[var(--bg)] flex flex-col justify-center items-center relative px-4 transition-colors duration-300">
            <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-center text-[var(--nav-text)] mb-10">
                Our Features & Services
            </h2>

            <div className="relative w-full flex items-center justify-center h-[70%] md:h-[75%] mt-9">
                {/* Left scroll button */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 bg-[var(--nav-bg)] text-[var(--nav-text)] p-3 md:p-4 rounded-full border border-[var(--nav-text)] z-20 hover:scale-110 active:scale-95 transition-transform duration-500 ease-in-out"
                >
                    <ChevronLeft size={CHEVRON_ICON_SIZE} className="md:w-8 md:h-8" />
                </button>
                <div
                    ref={scrollRef}
                    className="flex w-full h-full overflow-x-hidden snap-x snap-mandatory space-x-6 md:space-x-8 px-6 md:px-8 scroll-smooth"
                >
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            data-index={index} // used by IntersectionObserver
                            className="flex-shrink-0 w-full md:w-[80vw] flex flex-col justify-center items-center snap-center
                                         bg-[var(--nav-bg)] text-center px-6 py-8 md:px-10 rounded-xl border border-[var(--nav-text)]"
                        >
                            <div
                                className={`flex flex-col items-center justify-center transition-all duration-500 ease-out
                                        ${visibleIndexes.includes(index)
                                            ? "opacity-100 translate-y-0" 
                                            : "opacity-0 translate-y-6"
                                        }`}
                            >
                                <FontAwesomeIcon icon={feature.icon} size="3x" className="text-[var(--nav-text)] mb-4" />
                                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--nav-text)] mb-4">{feature.title}</h3>
                                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[var(--text)] max-w-xl">{feature.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right scroll button */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 bg-[var(--nav-bg)] text-[var(--nav-text)] p-3 md:p-4 rounded-full border border-[var(--nav-text)] z-20 hover:scale-110 active:scale-95 transition-transform duration-150 ease-in-out"
                >
                    <ChevronRight size={CHEVRON_ICON_SIZE} className="md:w-8 md:h-8" />
                </button>
            </div>
        </section>
    );
}

export default FeaturesSection;