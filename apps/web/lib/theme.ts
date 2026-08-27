export const theme = {
  colors: {
    light: {
      bgBase: "#F4F5FB",
      glassSurface: "rgba(255, 255, 255, 0.65)",
      glassCard: "rgba(255, 255, 255, 0.75)",
      glassBorder: "rgba(255, 255, 255, 0.9)",
      glassBorderSubtle: "rgba(255, 255, 255, 0.4)",
      textPrimary: "#0B0F19",
      textMuted: "#64748B",
      shadowGlass: "0 20px 40px -15px rgba(31, 38, 135, 0.07)",
    },
    dark: {
      bgBase: "#090D16",
      glassSurface: "rgba(15, 23, 42, 0.65)",
      glassCard: "rgba(30, 41, 59, 0.75)",
      glassBorder: "rgba(255, 255, 255, 0.12)",
      glassBorderSubtle: "rgba(255, 255, 255, 0.06)",
      textPrimary: "#F8FAFC",
      textMuted: "#94A3B8",
      shadowGlass: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
    },
    accents: {
      indigo: {
        primary: "#6366F1",
        gradient: "linear-gradient(135deg, #6366F1 0%, #9333EA 100%)",
        glows: ["#DDD6FE", "#C7D2FE", "#FCE7F3"],
      },
      ruby: {
        primary: "#DC2626",
        gradient: "linear-gradient(135deg, #991B1B 0%, #EF4444 100%)",
        glows: ["#FEE2E2", "#FECACA", "#FFF5F5"],
      },
      pink: {
        primary: "#DB2777",
        gradient: "linear-gradient(135deg, #BE185D 0%, #EC4899 100%)",
        glows: ["#FCE7F3", "#FBCFE8", "#FDF2F8"],
      },
      teal: {
        primary: "#0D9488",
        gradient: "linear-gradient(135deg, #0F766E 0%, #14B8A6 100%)",
        glows: ["#CCFBF1", "#99F6E4", "#F0FDFA"],
      },
    },
  },
  typography: {
    fonts: {
      header: '"Lora", serif',
      body: '"Uncut Sans", sans-serif',
    },
  },
};

export type ThemeMode = "light" | "dark";
export type ThemeHue = "indigo" | "ruby" | "pink" | "teal";

export function getThemeColors(mode: ThemeMode, hue: ThemeHue) {
  const base = theme.colors[mode];
  const accent = theme.colors.accents[hue];
  
  return {
    ...base,
    primary: accent.primary,
    gradient: accent.gradient,
    glows: accent.glows,
  };
}
