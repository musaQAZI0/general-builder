import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Cormorant Garamond", "Georgia", "serif"],
      },
      colors: {
        brand: { 500: "#376f60", 600: "#234d43", 700: "#172522" },
        base: {
          800: "#35504a", 900: "#234d43", 950: "#172522",
        },
        ink: "#172522", green: "#234d43", canvas: "#f5f3ed", sand: "#d9c79f", muted: "#68736f",
      },
    },
  },
  plugins: [],
};

export default config;
