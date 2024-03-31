import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'fondo-comida': "url('/fondo-comida.png')",
        'fondo-comida-2': "url('/fondo-comida3.png')",
        'fondo-comida-3': "url('/fondo-comida2.png')",
        'pizza': "url('/pizza.jpg')",
      },
      colors: {
        'orange-peel': '#FF9900',
      },

      boxShadow: {
        green: '0 0 10px -1px rgba(0, 255, 0, 0.1), 0 0 10px -1px rgba(0, 255, 0, 0.2)',
        orange: '0 0 10px -1px rgba(255, 153, 0, 0.1), 0 0 10px -1px rgba(255, 153, 0, 0.2)',
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}
