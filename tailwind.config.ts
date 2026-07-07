import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // amber/orange accent
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        base: {
          // dark navy/gray base
          800: "#1f2937",
          900: "#111827",
          950: "#0b1120",
        },
      },
    },
  },
  plugins: [],
};

export default config;
