import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Wix Madefor Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['"Wix Madefor Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"Wix Madefor Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Wix Madefor Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        dusk: {
          paper: "var(--color-paper)",
          "paper-2": "var(--color-paper-2)",
          "paper-3": "var(--color-paper-3)",
          ink: "var(--color-ink)",
          "ink-2": "var(--color-ink-2)",
          muted: "var(--color-muted)",
          rule: "var(--color-rule)",
          accent: "var(--color-accent)",
          "accent-ink": "var(--color-accent-ink)",
          "accent-hi": "var(--color-accent-hi)",
          "accent-2": "var(--color-accent-2)",
          well: "var(--color-well)",
          "well-ink": "var(--color-well-ink)",
          "well-muted": "var(--color-well-muted)",
          "well-rule": "var(--color-well-rule)",
        },
      },
      borderRadius: {
        card: "18px",
        inner: "10px",
        pill: "999px",
        DEFAULT: "10px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
