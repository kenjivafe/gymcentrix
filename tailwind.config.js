/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-unbounded)", "system-ui", "sans-serif"],
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: {
          DEFAULT: "#111111",
          subtle: "#0a0a0b",
        },
        primary: {
          DEFAULT: "#87f100",
          muted: "#1a2e00",
        },
        accent: {
          DEFAULT: "#87f100",
          soft: "#dfffc7",
        },
        border: {
          subtle: "rgba(255,255,255,0.05)",
        },
      },
      boxShadow: {
        card: "0 20px 45px -30px rgba(0,0,0,0.8)",
        glow: "0 0 25px -5px rgba(135, 241, 0, 0.15), 0 0 10px -2px rgba(135, 241, 0, 0.1)",
        'glow-strong': "0 0 40px -5px rgba(135, 241, 0, 0.25), 0 0 15px -2px rgba(135, 241, 0, 0.2), 0 0 60px -10px rgba(135, 241, 0, 0.1)",
      },
      backgroundImage: {
        'mesh-glow':
          "radial-gradient(circle at 20% 20%, rgba(135, 241, 0, 0.15), transparent 45%), radial-gradient(circle at 80% 0%, rgba(135, 241, 0, 0.1), transparent 40%)",
      },
    },
  },
  plugins: [],
}

