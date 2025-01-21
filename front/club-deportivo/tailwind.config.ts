import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navbarDefault: "#000",
        navbarScrolled: "#fff",
      },
      boxShadow: {
        navbar: "0 2px 4px rgba(255, 255, 255, 0.2)", // Sombra navbar en blanco
    },
    fontFamily: {
      sans: ['Noto Sans Tamil', 'sans-serif'],
      
    },    
    },
  },
  
  plugins: [],
} satisfies Config;
