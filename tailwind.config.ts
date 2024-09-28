import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cteal: "#008080",
        clightTeal: "#20B2AA",
      },
      fontFamily: {
        sans: ['var(--font-ibm-plex-mono)', 'monospace'],
        heading: ['var(--font-space-grotesk)', 'sans-serif'],
        futuristic: ['var(--font-exo2)', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'sans-serif'], 
        orbitron: ['var(--font-orbitron)', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui'),],
};
export default config;
