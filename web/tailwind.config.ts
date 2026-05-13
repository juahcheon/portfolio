import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      colors: {
        winBlue: "#0078D4",
        winBar: "rgba(230,230,230,0.88)",
        desk: "#5f9ea0",
      },
      boxShadow: {
        win: "0 0 10px rgba(0,0,0,0.35)",
        task: "0 0 10px rgba(0,0,0,0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
