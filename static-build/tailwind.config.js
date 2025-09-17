export default {
  darkMode: "class",
  content: ["./dist/**/*.html", "./src/**/*.js"],
  theme: {
    extend: {
      colors: {
        kevin: {
          orange: "hsl(24, 95%, 53%)",
          charcoal: "hsl(210, 25%, 7.8%)",
          graphite: "hsl(210, 20%, 17%)",
          steel: "hsl(210, 10%, 45%)",
          mint: "hsl(120, 100%, 35%)",
          sand: "hsl(25, 35%, 62%)",
          neon: "hsl(120, 100%, 50%)",
          magenta: "hsl(300, 100%, 50%)",
          cyan: "hsl(180, 100%, 50%)",
        },
      },
      fontFamily: {
        pixel: ["Orbitron", "monospace"],
        terminal: ["Share Tech Mono", "monospace"],
      },
      animation: {
        "pixel-glitch": "pixel-glitch 2s infinite",
        "scanline-move": "scanline-move 2s linear infinite",
        "pixel-bounce": "pixel-bounce 1s ease-in-out infinite",
        "terminal-cursor": "terminal-cursor 1s step-end infinite",
        "pixel-float": "pixel-float 3s ease-in-out infinite",
      },
      keyframes: {
        "pixel-glitch": {
          "0%, 100%": { transform: "translate(0)" },
          "10%": { transform: "translate(-2px, -1px)" },
          "20%": { transform: "translate(2px, 1px)" },
          "30%": { transform: "translate(-1px, 2px)" },
          "40%": { transform: "translate(1px, -2px)" },
          "50%": { transform: "translate(-2px, 1px)" },
          "60%": { transform: "translate(2px, -1px)" },
          "70%": { transform: "translate(-1px, -2px)" },
          "80%": { transform: "translate(1px, 2px)" },
          "90%": { transform: "translate(-2px, -1px)" },
        },
        "scanline-move": {
          "0%": { transform: "translateY(-100vh)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "pixel-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "terminal-cursor": {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
        "pixel-float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
  plugins: [],
};