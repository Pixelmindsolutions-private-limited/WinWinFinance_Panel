/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        winwin: {
          50: "#eef3fb",
          100: "#dce6f5",
          500: "#233f68",
          600: "#19345b",
          700: "#122a4a",
          900: "#081a33"
        }
      
      }
    }
  },
  plugins: []
};