import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Brand: Tomato Jam (#BB342F) with a derived tonal scale
        brand: {
          50: "#fdf4f3",
          100: "#fce7e5",
          200: "#f9c8c4",
          300: "#f29f99",
          400: "#e8736c",
          500: "#d44b43",
          600: "#bb342f",
          700: "#9b2924",
          800: "#7e2521",
          900: "#67201d",
          950: "#380c0a",
        },
        // Sector & neutral palette tokens (kept here so they're tree-shakeable for arbitrary classes)
        palette: {
          lavender: "#8d6a9f",
          slate: "#c5cbd3",
          teal: "#8cbcb9",
          honey: "#dda448",
          tomato: "#bb342f",
        },
        // Lavender tonal scale, used for "selection" emphasis throughout the UI
        // (career goal pill, role picker, team builder roles + people).
        lavender: {
          50: "#f7f4f9",
          100: "#efe7f3",
          200: "#ddcde4",
          300: "#c5acd0",
          400: "#a684b6",
          500: "#8d6a9f",
          600: "#745482",
          700: "#5f4569",
          800: "#4f3957",
          900: "#44324a",
          950: "#281b2d",
        },
      },
      fontFamily: {
        // Prefer Graphik (host via Adobe Fonts / Commercial Type), then Sofia Pro
        // (Mostardesign / Adobe Fonts). Inter is loaded via next/font/google as a
        // guaranteed offline-able fallback so the stack always resolves cleanly,
        // and the OS sans fallbacks finish things off.
        sans: [
          '"Graphik"',
          '"Sofia Pro"',
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        display: [
          '"Sofia Pro"',
          '"Graphik"',
          "var(--font-inter)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "pop-in": "popIn 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
        "pulse-soft": "pulseSoft 2.4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.92)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
