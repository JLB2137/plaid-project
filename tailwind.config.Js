module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './styles/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      gridAutoColumns: {
        'fr': 'minmax(0, fr)',
      },
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
