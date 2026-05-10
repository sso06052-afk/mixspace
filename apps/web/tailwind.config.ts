import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#0a0a0f",
          secondary: "#13131a",
          elevated: "#1c1c26",
        },
        border: {
          DEFAULT: "#2a2a35",
        },
        text: {
          primary: "#f0f0f5",
          secondary: "#a0a0b0",
          muted: "#606070",
        },
        accent: {
          cyan: "#00d4ff",
          red: "#ff4060",
          yellow: "#ffd060",
          green: "#60ff90",
          purple: "#9060ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
