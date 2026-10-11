/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#3B82F6",
        secondary: "#d1fff0",
        y2k: {
          bg: "#1A1A2E",
          chrome: "#C0C0C0",
          accent: "#ffa857",
          cyan: "#7DF9FF",
          white: "#F8F8FF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'chrome': '0 0 15px rgba(192, 192, 192, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'neon-cyan': '0 0 20px rgba(125, 249, 255, 0.6)',
      },
    },
  },
  plugins: [],
};

