// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'], // best default
        // OR use Poppins for more "Daraz-like" rounded feel
        // sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Inter', 'sans-serif'], // or 'Poppins' for headings
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  // ... plugins etc.
}