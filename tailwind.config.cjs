/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: '#1F2937',
        lightblue: '#4FA8C4',
        primary: '#FF9519'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
