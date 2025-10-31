/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { bg: "#0B0F19", fg: "#E6E8F0" }
    }
  },
  plugins: []
};
