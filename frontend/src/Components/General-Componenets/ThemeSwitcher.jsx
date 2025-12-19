import { useContext } from "react";
import { ThemeContext } from "../../Context/ThemeContext";
import { SunFill, MoonFill } from "react-bootstrap-icons";
import { ICON_SIZE } from "../../Data/Global_variables";

function ThemeSwitcher() {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const IconComponent = theme === "light" ? MoonFill : SunFill;
    const buttonText = theme === "light" ? "Dark Mode" : "Light Mode";

    return (
        <button
            onClick={toggleTheme}
            className="duration-300 transition-colors bg-[var(--nav-text)] hover:bg-[var(--nav-bg)] hover:text-[var(--nav-text)] text-[var(--nav-bg)] hover:border hover:border-[var(--nav-hover)] font-bold"
            style={{ 
                padding: "8px 12px",
                border: "1px solid var(--nav-text)",
                borderRadius: "5px",
                cursor: "pointer",
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: "1000",
            }}
        >
            <span className="flex items-center"><IconComponent size={ICON_SIZE} className="mr-2" /> {buttonText}</span>
        </button>
    );
}

export default ThemeSwitcher