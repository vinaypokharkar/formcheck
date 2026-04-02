export const Theme = {
  colors: {
    surface: '#131318',
    surfaceContainerLowest: '#0E0E13',
    surfaceContainerLow: '#1B1B20',
    surfaceContainer: '#1F1F24',
    surfaceContainerHigh: '#2A292F',
    surfaceContainerHighest: '#35343A',
    primary: '#FFFFFF',
    onPrimary: '#1A1C1C',
    primaryContainer: '#D4D4D4',
    onSurface: '#FFFFFF',
    surfaceVariant: '#35343A',
    onSurfaceVariant: '#C6C6C6',
    outlineVariant: '#474747',
    error: '#FFB4AB',
  },
  typography: {
    displayLg: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 56, lineHeight: 64 },
    displayMd: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 45, lineHeight: 52 },
    displaySm: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 36, lineHeight: 44 },
    headlineLg: { fontFamily: 'SpaceGrotesk_400Regular', fontSize: 32, lineHeight: 40 },
    titleLg: { fontFamily: 'Manrope_600SemiBold', fontSize: 22, lineHeight: 28 },
    titleMd: { fontFamily: 'Manrope_600SemiBold', fontSize: 16, lineHeight: 24 },
    bodyMd: { fontFamily: 'Manrope_400Regular', fontSize: 14, lineHeight: 20 },
    bodySm: { fontFamily: 'Manrope_400Regular', fontSize: 12, lineHeight: 16 },
    labelLg: { fontFamily: 'Manrope_600SemiBold', fontSize: 14, lineHeight: 20 },
    labelSm: { fontFamily: 'Manrope_600SemiBold', fontSize: 11, lineHeight: 16, textTransform: 'uppercase' as const, letterSpacing: 1.1 },
  },
  spacing: {
    tight: 27, // Spacing 5 (1.7rem)
    base: 44, // Spacing 8 (2.75rem)
    large: 64, // Spacing 12
    xlarge: 80, // Spacing 16
  },
  radius: {
    md: 24, // 1.5rem
    lg: 32, // 2rem
    full: 9999,
  }
};

const tintColorLight = '#0a7ea4';
const tintColorDark = '#FFFFFF';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: Theme.colors.primary,
    background: Theme.colors.surface,
    tint: tintColorDark,
    icon: Theme.colors.onSurfaceVariant,
    tabIconDefault: Theme.colors.onSurfaceVariant,
    tabIconSelected: tintColorDark,
  },
};
