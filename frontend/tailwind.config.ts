import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        office: {
          navy: "#0a0f1d",
          slate: "#151e32",
          card: "#1e293b",
          border: "#334155",
          cyan: "#06b6d4",
          gold: "#f59e0b",
        }
      },
    },
  },
  plugins: [],
};
export default config;
