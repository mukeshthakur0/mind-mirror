/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        imperial: ['"Imperial Script"', 'sans-serif'],
      UnifrakturMaguntia: ['"UnifrakturMaguntia"', 'cursive'],
      FleurDeLeah: ['"Fleur De Leah"', 'cursive'],
    festive: ['"Festive"', 'cursive'],
    comforter: ['"Comforter"', 'cursive'],
  },
    },
  },
  plugins: [],
}
