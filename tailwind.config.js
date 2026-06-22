/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./popup.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', "sans-serif"]
      },
      boxShadow: {
        soft: "0 12px 36px -18px rgba(15, 23, 42, 0.32)"
      }
    }
  },
  plugins: []
};
