/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brutal: {
          white: "#FFFFFF",
          black: "#0F0F0F",
          gray: {
            light: "#F5F5F5",
            medium: "#E5E5E5",
            dark: "#262626",
          },
          accent: "#00FF41", // CRT Green
          orange: "#FF4500", // Electric Orange
        }
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderWidth: {
        '1': '1px',
      }
    },
  },
  plugins: [],
}
