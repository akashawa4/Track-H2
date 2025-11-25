export const theme = {
  colors: {
    background: {
      primary: '#F5F7FB',
      card: '#FFFFFF',
      panel: '#F0F4FF',
    },
    text: {
      primary: '#1F2933',
      secondary: '#5C6B7A',
    },
    border: '#D7DDE6',
    status: {
      safe: '#1ABC9C',
      warning: '#F7B500',
      critical: '#FF5C5C',
      action: '#4F46E5',
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
