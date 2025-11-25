export const theme = {
  colors: {
    background: {
      primary: '#0D1B2A',
      card: '#1B263B',
      panel: '#222F43',
    },
    text: {
      primary: '#E0E6ED',
      secondary: '#AAB6C5',
    },
    border: '#2E3A4D',
    status: {
      safe: '#2ECC71',
      warning: '#F1C40F',
      critical: '#E74C3C',
      action: '#00A8E8',
    },
  },
  spacing: {
    page: '24px',
    cardPadding: '18px',
    cardGap: '16px',
  },
  borderRadius: {
    card: '12px',
    button: '8px',
    modal: '16px',
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    sizes: {
      heading: '22px',
      headingLarge: '32px',
      value: '34px',
      valueLarge: '42px',
      label: '14px',
      labelLarge: '16px',
    },
  },
  layout: {
    headerHeight: '72px',
    alertBannerHeight: '56px',
  },
} as const;

export type Theme = typeof theme;
