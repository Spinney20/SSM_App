import { DefaultTheme } from 'react-native-paper';

// Tema principală a aplicației - design modern și profesional
export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1E88E5', // Albastru profesional
    accent: '#FFA000',  // Portocaliu pentru accente
    background: '#F5F5F5',
    surface: '#FFFFFF',
    error: '#D32F2F',
    text: '#212121',
    placeholder: '#757575',
    notification: '#1E88E5',
    // Culori specifice aplicației
    success: '#43A047',
    warning: '#FFA000',
    danger: '#D32F2F',
    info: '#1E88E5',
    light: '#F5F5F5',
    dark: '#212121',
    border: '#E0E0E0',
  },
  fonts: {
    ...DefaultTheme.fonts,
    // Puteți personaliza fonturile aici
  },
  // Personalizări suplimentare pentru temă
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },
  roundness: 8,
};

export default theme; 