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
        text: "4px 4px 15px rgba(255, 255, 255, 0.5)", // Sombra de texto
        navbar: "0 2px 4px rgba(255, 255, 255, 0.2)", // Sombra navbar en blanco
      },
      fontFamily: {
        sans: ["Noto Sans Tamil", "sans-serif"],
      },
      animation: {
        scroll: "scroll 9s linear infinite", // Animación personalizada para el carrusel
      },
      keyframes: {
        scroll: {
          "0%": { transform: "translateX(0)" },
          "33%": { transform: "translateX(-100%)" },
          "66%": { transform: "translateX(-200%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
