// tailwind.config.ts
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
          blue: "#2563EB",      // Vibrant Blue from your logo
          blueDark: "#1E40AF",
          gray: "#8F8F8F",      // The Gray from your logo
          slate: "#0F172A",    // Deep Midnight for contrast
          surface: "#F8FAFC",   // Light gray/blue surface
          amber: "#F59E0B",    // Professional accent for status/alerts
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;