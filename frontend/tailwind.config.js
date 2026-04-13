/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#000000',
        secondary: '#FFFFFF',
        'gray-light': '#F5F5F5',
        'accent-gray': '#BDBDBD',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica Neue', 'Plus Jakarta Sans', 'sans-serif'],
        heading: ['Inter', 'Helvetica Neue', 'sans-serif'],
      },
      borderRadius: {
        card: '20px',
        capsule: '50px',
      },
    },
  },
  plugins: [],
};
