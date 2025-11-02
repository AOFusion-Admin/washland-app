/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        washland: {
          blue: '#1e40af',
          lightblue: '#60a5fa',
          navy: '#1e3a8a',
          gray: '#6b7280',
          lightgray: '#f3f4f6',
        }
      },
    },
  },
  plugins: [],
}