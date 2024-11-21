module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridAutoColumns: {
        'fr': 'minmax(0, fr)',
      }
    },
  },
  plugins: [],
};
