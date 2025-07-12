export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: "#A855F7",
        secondary: "#C084FC",
        background: {
          dark: "#0D0B1F",
          medium: "#1A162D",
        },
        text: {
          light: "#F3F0FF",
          muted: "#A89EC9",
        }
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(168, 85, 247, 0.5)',
        'glow-secondary': '0 0 15px rgba(192, 132, 252, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}