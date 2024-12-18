module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './styles/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      height: {
        '95': '95%', // Adds h-95 for 95% height
      },
      gridAutoColumns: {
        'fr': 'minmax(0, fr)',
      },
      fontFamily: {
        sans: ['Lato', 'ui-sans-serif', 'system-ui'],
      },
      colors:{
        'red': '#ff5101',
        'green': '#00c807',
  
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
};
