/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'hostelia-dark': '#0f172a', // Midnight Blue
        'hostelia-gold': '#c5a059', // Or brossé pour le prestige
        'hostelia-card': '#1e293b', // Gris bleu profond
      }
    },
  },
  plugins: [],
}