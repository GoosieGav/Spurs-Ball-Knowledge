/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spurs: {
          navy: '#132257',
          blue: '#1C4387',
          white: '#FFFFFF',
          gold: '#FFD700',
          lightBlue: '#4A90E2',
        }
      },
      fontFamily: {
        'spurs': ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
