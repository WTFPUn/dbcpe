/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'oxygen': ['Oxygen', 'sans-serif'],
        'dmsans': ['DM Serif Display', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

