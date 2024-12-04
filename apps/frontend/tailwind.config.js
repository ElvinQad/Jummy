/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx,jsx}',
    './components/**/*.{ts,tsx,jsx}',
    './app/**/*.{ts,tsx,jsx}',
    './src/**/*.{ts,tsx,jsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        foodred: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ffa0a0",
          400: "#ff6b6b",
          500: "#ff3838",
          600: "#ed1515",
          700: "#c80d0d",
          800: "#a50f0f",
          900: "#881414",
          DEFAULT: "#ff3838",
          foreground: "#ffffff"
        },
        dark: {
          background: "#0c0c0f",
          foreground: "#fafafa",
          primary: "#19191f",
          secondary: "#24242b",
          muted: "#313139",
          accent: "#202024",
          card: "#161618",
          border: "#24242b",
          hover: "#1d1d21",
          text: "#fafafa"
        },
        light: {
          background: "#ffffff",
          foreground: "#ffffff",
          primary: "#fafafa",
          secondary: "#f5f5f5",
          muted: "#f0f0f0",
          accent: "#ebebeb",
          card: "#ffffff",
          border: "#e6e6e6",
          hover: "#f5f5f5",
          text: "#0c0c0f"
        },
        gradient: {
          light: "#ffffff",
          dark: "hsl(240, 10%, 4%)",
          lightEnd: "rgb(255, 241, 241)",
          darkEnd: "hsl(240, 10%, 8%)",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      opacity: {
        '85': '0.85',
        '95': '0.95',
        '98': '0.98',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        in: {
          '0%': { transform: 'translateY(100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        out: {
          '0%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        'in': 'in 0.2s ease-out',
        'out': 'out 0.2s ease-in',
      },
      backgroundColor: {
        'input-dark': 'hsl(240, 10%, 4%)',
        'input-light': 'hsl(0, 0%, 100%)',
      },
      boxShadow: {
        'input-light': '0 2px 4px rgba(0, 0, 0, 0.05)',
        'input-dark': '0 2px 4px rgba(0, 0, 0, 0.2)',
        'dropdown': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      transitionProperty: {
        'input': 'border-color, box-shadow, background-color',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}