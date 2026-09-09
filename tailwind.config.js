/** Tailwind config — tokens de marca da Aurora, extraídos do site oficial. */
module.exports = {
  content: ["./index.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        violet: { DEFAULT: "#6a509d", dark: "#574185" },
        rosa: { DEFAULT: "#cf4793", dark: "#b23a7e" },
        lilac: "#7e61a7",
        teal: "#31b4a6",
        ink: "#1b1733",
        body: "#4b4763",
        muted: "#8a87a0",
        "muted-a11y": "#6b6884", // variação AA-safe do muted da marca (~5.3:1 em fundo claro)
        line: "#e9e7f1",
        surface: "#ffffff",
        bg: "#faf9fc",
        "bg-tint": "#f4f1fa",
      },
      fontFamily: {
        // Fonte única "Outfit" (títulos e corpo), conforme o Briefing Completo
        // oficial da marca — substitui o par Plus Jakarta Sans + Inter usado
        // antes. As chaves display/body são mantidas por clareza semântica no
        // HTML (font-display = títulos, font-body = corpo), mas hoje resolvem
        // para a mesma família; a diferenciação de hierarquia passa a vir só
        // do peso (font-semibold/bold/extrabold).
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ["Outfit", "system-ui", "sans-serif"],
      },
      maxWidth: {
        content: "1160px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
        float: "float 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
