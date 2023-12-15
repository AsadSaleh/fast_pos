/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        shake: {
          "0%": { transform: "translate(0px)" },
          "25%": { transform: "translate(20px)" },
          "50%": { transform: "translate(0px)" },
          "75%": { transform: "translate(-20px)" },
          "100%": { transform: "translate(0px)" },
        },
      },
      animation: {
        shaking: "shake 0.2s linear infinite",
      },
    },
  },
  plugins: [],
};
