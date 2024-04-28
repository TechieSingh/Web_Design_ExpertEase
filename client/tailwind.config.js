/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: ["light", "dark", "cupcake"],
  plugins: [require("daisyui")],
};
