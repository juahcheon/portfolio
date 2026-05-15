import type { Config } from "tailwindcss";
import { tailwindPalette } from "./tailwind.palette";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto)", "system-ui", "sans-serif"],
      },
      colors: {
        ...tailwindPalette,
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
