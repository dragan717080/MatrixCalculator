/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: '#1F2937',
        deepazure: '#006CBC',
        lightblue: '#4FA8C4',
        primary: '#FF9519',
        gray: {
          350: '#727272',
          450: '#636264',
          550: '#424143',
        },
        neutral: {
          150: '#EFEFEF',
        },
      },
      lineHeight: {
        '6.5': '1.625rem',
      },
      spacing: {
        '3/10': '30%',
        '4/5': '80%',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
