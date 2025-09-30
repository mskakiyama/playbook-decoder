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
        sans: ["Poppins", "system-ui", "sans-serif"],
        gugi: ["Gugi", "cursive"],
        oswald: ["Oswald", "sans-serif"],
        "helvetica-neue": ["Helvetica Neue", "Arial", "sans-serif"],
        "helvetica-neue-condensed": ["Helvetica Neue Condensed", "Helvetica Neue", "Arial", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glass: "hsl(var(--primary-glass))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          glass: "hsl(var(--secondary-glass))",
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
          glass: "hsl(var(--accent-glass))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
          glass: "hsl(var(--card-glass))",
        },
        /* Glassmorphism NFL colors */
        "field-green": {
          DEFAULT: "hsl(var(--field-green))",
          dark: "hsl(var(--field-green-dark))",
          glass: "hsl(var(--field-green-glass))",
        },
        "touchdown-gold": {
          DEFAULT: "hsl(var(--touchdown-gold))",
          glass: "hsl(var(--touchdown-gold-glass))",
        },
        "interception-red": "hsl(var(--interception-red))",
        "success-green": "hsl(var(--success-green))",
        "neutral-gray": "hsl(var(--neutral-gray))",
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
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': 'var(--shadow-glass)',
        'glass-hover': 'var(--shadow-glass-hover)',
        'play-card': 'var(--shadow-play-card)',
        'diagram': 'var(--shadow-diagram)',
      },
      backgroundImage: {
        'gradient-glass-primary': 'var(--gradient-glass-primary)',
        'gradient-glass-secondary': 'var(--gradient-glass-secondary)', 
        'gradient-glass-accent': 'var(--gradient-glass-accent)',
        'gradient-background': 'var(--gradient-background)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        /* NFL Play Animation Effects */
        "play-highlight": {
          "0%": { transform: "scale(1)", boxShadow: "0 0 0 0 hsl(var(--accent) / 0.7)" },
          "50%": { transform: "scale(1.02)", boxShadow: "0 0 0 10px hsl(var(--accent) / 0)" },
          "100%": { transform: "scale(1)", boxShadow: "0 0 0 0 hsl(var(--accent) / 0)" }
        },
        "player-move": {
          "0%": { transform: "translateX(0) translateY(0)" },
          "50%": { transform: "translateX(10px) translateY(-5px)" },
          "100%": { transform: "translateX(20px) translateY(0)" }
        },
        "field-glow": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--field-green) / 0.5)" },
          "50%": { boxShadow: "0 0 40px hsl(var(--field-green) / 0.8)" }
        },
        "score-pop": {
          "0%": { transform: "scale(1)", color: "hsl(var(--foreground))" },
          "50%": { transform: "scale(1.3)", color: "hsl(var(--touchdown-gold))" },
          "100%": { transform: "scale(1)", color: "hsl(var(--foreground))" }
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        "play-highlight": "play-highlight 2s ease-in-out",
        "player-move": "player-move 3s ease-in-out infinite",
        "field-glow": "field-glow 3s ease-in-out infinite",
        "score-pop": "score-pop 0.6s ease-out"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
