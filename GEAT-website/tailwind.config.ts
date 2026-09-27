import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";
import tailwindcssTypography from "@tailwindcss/typography";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
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
        heading: ['"DM Sans"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      /* Numeric weight utilities. 600/700 were used in 12 places across the
         codebase but only 800 was registered, so `font-600` and `font-700`
         compiled to nothing and those elements rendered at 400. Prefer the
         semantic names (font-semibold / font-bold); these are registered so
         a stray numeric class can never silently drop a weight again. */
      fontWeight: {
        600: '600',
        700: '700',
        800: '800',
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "geat-orange-dark": "hsl(var(--geat-orange-dark))",
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        /* The logo orange as a SURFACE. Use `bg-brand text-brand-foreground`
           for any solid orange control, and `border-brand-edge` wherever the
           amber is a control's only boundary (the fill is 2.12:1 on a light
           page; the edge tone is 3.74:1).

           `text-primary` is NOT the text counterpart. On a light ground orange
           is a fill/ornament token only — see "ORANGE IS NOT A TEXT COLOUR ON
           LIGHT GROUNDS" in index.css. `text-primary` paints real orange text
           only inside `.surface-dark`, where it measures 6.64:1. An earlier
           version of this comment said the opposite and is how a dozen
           light-ground controls ended up reaching for the wrong token. */
        brand: {
          DEFAULT: "hsl(var(--brand-fill))",
          foreground: "hsl(var(--brand-fill-foreground))",
          edge: "hsl(var(--brand-fill-edge))",
        },
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
        geat: {
          dark: "hsl(var(--geat-dark))",
          orange: "hsl(var(--geat-orange))",
          "orange-dark": "hsl(var(--geat-orange-dark))",
          blue: "hsl(var(--geat-blue))",
          "blue-light": "hsl(var(--geat-blue-light))",
          light: "hsl(var(--geat-light))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "slide-progress": {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "geni-fade": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "slide-progress": "slide-progress 5s linear",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "geni-fade 0.35s ease-out",
      },

    },
  },
  plugins: [tailwindcssAnimate, tailwindcssTypography],
} satisfies Config;