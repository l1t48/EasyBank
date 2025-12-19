import { useMemo } from "react";

const useThemedColors = (theme) => {
  const colors = useMemo(() => {
    if (theme === "dark") {
      return {
        primary: "#44bc70",
        primaryDigram: "#41644A",
        diagram_text: "#44bc70",
        secondary: "#84994F",
        accent: "#CBD99B",
        bg: "#17171b",
        cardBg: "#1b1b21",
        border: "#44bc70",
      };
    } else {
      return {
        primary: "hsl(190, 80%, 20%)",
        primaryDigram: "#213555",
        diagram_text: "white",
        secondary: "#FD7979",
        accent: "#7ADAA5",
        bg: "hsl(172, 50%, 90%)",
        cardBg: "hsl(184, 61%, 86%)",
        border: "hsl(190, 80%, 20%)",
      };
    }
  }, [theme]);
  return colors;
};

export default useThemedColors;