/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./node_modules/@material-tailwind/html/**/*.{js,ts,html}",
    "./src/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0A66C2",
        secondary: "#20262e",
        background: "#15171c",
        backgroundLight: "#FFFFFF",
        accent: "#b24020",
        text: "#585858",
        subText: "#00000060",
        errorColor: "#FF3333",
      },
      fontFamily: {
        primary: ["Montserrat"],
        secondary: ["sans-serif"],
      },
    },
  },
  plugins: [],
};
