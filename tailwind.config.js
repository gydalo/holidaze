/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        alata: ["Alata", ...defaultTheme.fontFamily.sans],
        lateef: ["Lateef", ...defaultTheme.fontFamily.sans],
      },
      screens: {
        xs: "537px",
        xxs: "398px",
      },
    },
  },
  plugins: [],
};
