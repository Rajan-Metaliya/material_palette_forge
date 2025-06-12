import type { ThemeConfiguration, MaterialColors, ThemeFonts, ThemeProperties, ThemeGradient, ThemeSpacing, ThemeBorderRadius, ThemeBorderWidth, ThemeOpacity, ThemeElevation } from '@/types/theme';

export const COMMON_WEB_FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Space Grotesk', label: 'Space Grotesk' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Verdana', label: 'Verdana' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
  { value: 'monospace', label: 'Monospace (System)'},
  // Add more fonts as needed
];

export const DEFAULT_COLORS: MaterialColors = {
  seedColor: '#6750A4', // Default M3 purple as seed, will drive initial generation
  primary: '#89729B', 
  secondary: '#625B71', 
  tertiary: '#7D5260', 
  error: '#B3261E',
  surface: '#F4EFF7',
  onSurface: '#1C1B1F',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  tertiaryContainer: '#FFD8E4',
  onTertiaryContainer: '#31111D',
  errorContainer: '#F9DEDC',
  onErrorContainer: '#410E0B',
  surfaceVariant: '#E7E0EC',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#C4C7C5',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#313033',
  onInverseSurface: '#F4EFF4',
  inversePrimary: '#D0BCFF',
};

export const DEFAULT_FONTS: ThemeFonts = {
  primary: 'Space Grotesk',
  secondary: 'Inter',
  monospace: 'monospace',
};

export const DEFAULT_SPACING: ThemeSpacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
};

export const DEFAULT_BORDER_RADIUS: ThemeBorderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const DEFAULT_BORDER_WIDTH: ThemeBorderWidth = {
  thin: '1px',
  medium: '2px',
  thick: '3px',
};

export const DEFAULT_GRADIENTS: ThemeGradient[] = [
  {
    name: 'Primary to Secondary',
    type: 'linear',
    direction: 'to right',
    colors: [DEFAULT_COLORS.primary, DEFAULT_COLORS.secondary],
  },
];

export const DEFAULT_OPACITY: ThemeOpacity = {
  disabled: 0.38,
  hover: 0.08,
  focused: 0.12,
  pressed: 0.12,
  dragged: 0.16,
};

export const DEFAULT_ELEVATION: ThemeElevation = {
  level0: 'none',
  level1: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)',
  level2: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)',
  level3: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)',
  level4: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)',
  level5: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)',
};

export const DEFAULT_PROPERTIES: ThemeProperties = {
  spacing: DEFAULT_SPACING,
  borderRadius: DEFAULT_BORDER_RADIUS,
  borderWidth: DEFAULT_BORDER_WIDTH,
  gradients: DEFAULT_GRADIENTS,
  opacity: DEFAULT_OPACITY,
  elevation: DEFAULT_ELEVATION,
};

export const INITIAL_THEME_CONFIG: ThemeConfiguration = {
  colors: DEFAULT_COLORS, // ThemeProvider will handle initial generation from seedColor
  fonts: DEFAULT_FONTS,
  properties: DEFAULT_PROPERTIES,
};

// Keys for display sections; seedColor is handled separately.
export const CORE_COLOR_KEYS: (keyof MaterialColors)[] = ['primary', 'secondary', 'tertiary', 'error', 'surface', 'onSurface']
  .filter(k => k !== 'seedColor') as (keyof MaterialColors)[];

export const EXTENDED_COLOR_KEYS: (keyof MaterialColors)[] = (Object.keys(DEFAULT_COLORS) as Array<keyof MaterialColors>)
  .filter(key => key !== 'seedColor' && !CORE_COLOR_KEYS.includes(key));
