/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0F172A",
        "ink-2": "#273449",
        muted: "#64748B",
        line: "#E2E8F0",
        mist: "#F8FAFC",
        violet: "#4F46E5",
        sky: "#0EA5E9",
        teal: "#0D9488",
      },
      screens: {
        xs: "450px",
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        body: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
