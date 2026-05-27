import type { Config } from "tailwindcss";
import { tailwindPalette } from "./tailwind.palette";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Pretendard Variable", "Pretendard", "Malgun Gothic", "system-ui", "sans-serif"],
      },
      colors: {
        ...tailwindPalette,
      },
      boxShadow: {
        win: "0 0 10px rgba(0,0,0,0.35)",
        task: "0 0 10px rgba(0,0,0,0.2)",
        startMenu: "0 12px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08)",
      },
      keyframes: {
        startMenuSlideUp: {
          from: { opacity: "0", transform: "translateY(18px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        startMenuSlideUp: "startMenuSlideUp 0.24s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
