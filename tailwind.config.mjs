// tailwind.config.mjs
import daisyui from "daisyui";
import scrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        "fade-out": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
        "fade-in-down": {
          "0%": { opacity: 0, transform: "translate3d(0, -100%, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-up": {
          "0%": { opacity: 0, transform: "translate3d(0, 100%, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-left": {
          "0%": { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-in-right": {
          "0%": { opacity: 0, transform: "translate3d(100%, 0, 0)" },
          "100%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
        },
        "fade-out-down": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translate3d(0, 100%, 0)" },
        },
        "fade-out-up": {
          "0%": { opacity: 1 },
          "100%": { opacity: 0, transform: "translate3d(0, -100%, 0)" },
        },
        "fade-out-left": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(-100%, 0, 0)" },
        },
        "fade-out-right": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(100%, 0, 0)" },
        },
        "fade-out-top-left": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(-100%, -100%, 0)" },
        },
        "fade-out-top-right": {
          "0%": { opacity: 1, transform: "translate3d(0, 0, 0)" },
          "100%": { opacity: 0, transform: "translate3d(100%, -100%, 0)" },
        },
      },
      animation: {
        fadein: "fade-in 3s ease-in-out infinite",
        fadeout: "fade-out 3s ease-out infinite",
        fadeindown: "fade-in-down 3s ease-in infinite",
        fadeinup: "fade-in-up 3s ease-in-out infinite",
        fadeinleft: "fade-in-left 3s ease-in-out infinite",
        fadeinright: "fade-in-right 3s ease-in-out infinite",
        fadeoutdown: "fade-out-down 3s ease-in-out infinite",
        fadeoutup: "fade-out-up 3s ease-in-out infinite",
        fadeoutleft: "fade-out-left 3s ease-in-out infinite",
        fadeoutright: "fade-out-right 3s ease-in-out infinite",
        fadeouttopleft: "fade-out-top-left 3s ease-in-out infinite",
        fadeouttopright: "fade-out-top-right 3s ease-in-out infinite",
      },
    },
  },
  plugins: [daisyui, scrollbarHide],
};

export default config;
