import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eff9ff",
          100: "#d7f0ff",
          200: "#aee0ff",
          300: "#75caff",
          400: "#3dafef",
          500: "#178ed7",
          600: "#0b6caa",
          700: "#0a537f",
          800: "#0b4465",
          900: "#0c3853"
        }
      }
    }
  },
  plugins: []
};

export default config;
