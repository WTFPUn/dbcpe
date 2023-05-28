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
        'dmserif': ['DM Serif Display', 'serif'],
        'fira': ['Fira Sans', 'sans-serif'],
        'prompt': ['Prompt', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

