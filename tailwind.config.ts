import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#C2562A", dk: "#A04421", lt: "#F5EDE8", mid: "#E8A882" },
        gold: { DEFAULT: "#C9922A", lt: "#FDF5E6", bd: "#F0D49A" },
        ink: {
          DEFAULT: "#1E1814",
          80: "rgba(30,24,20,.80)",
          50: "rgba(30,24,20,.50)",
          30: "rgba(30,24,20,.30)",
          12: "rgba(30,24,20,.12)",
          6: "rgba(30,24,20,.06)",
        },
        sand: "#FBF9F7",
        border: { DEFAULT: "#EDE8E2", lt: "#F4F1ED" },
        ok: { DEFAULT: "#2D7D5A", lt: "#E8F5EE", bd: "#A8D9C0" },
        warn: { DEFAULT: "#B85C0A", lt: "#FEF4EC", bd: "#F5C496" },
        err: { DEFAULT: "#C22A2A", lt: "#FEF0F0", bd: "#F5A8A8" },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      borderRadius: {
        card: "14px",
        modal: "20px",
      },
      boxShadow: {
        modal: "0 24px 64px rgba(30,24,20,.22)",
      },
    },
  },
  plugins: [],
};
export default config;
