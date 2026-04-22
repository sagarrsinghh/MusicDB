import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                retro: {
                    black: "#0b0b0b",
                    gold: "#c5a47e",
                    paper: "#f4f1ea",
                    ink: "#1a1a1b",
                    accent: "#e63946",
                    sepia: "#704214",
                }
            },
        },
    },
    plugins: [],
};
export default config;
