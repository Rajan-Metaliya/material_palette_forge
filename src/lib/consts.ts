import type { ThemeConfiguration, MaterialColors, ThemeFonts, ThemeProperties, ThemeGradient, ThemeSpacing, ThemeBorderRadius, ThemeBorderWidth, ThemeOpacity, ThemeElevation, CustomPropertyItem, CustomNumericPropertyItem } from '@/types/theme';

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
];

export const DEFAULT_COLORS: MaterialColors = {
  seedColor: '#6750A4', 
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

export const DEFAULT_SPACING: ThemeSpacing = [
  { name: 'xs', value: '4px' },
  { name: 'sm', value: '8px' },
  { name: 'md', value: '16px' },
  { name: 'lg', value: '24px' },
  { name: 'xl', value: '32px' },
];

export const DEFAULT_BORDER_RADIUS: ThemeBorderRadius = [
  { name: 'xs', value: '2px' },
  { name: 'sm', value: '4px' },
  { name: 'md', value: '8px' },
  { name: 'lg', value: '12px' },
  { name: 'xl', value: '16px' },
  { name: 'full', value: '9999px' },
];

export const DEFAULT_BORDER_WIDTH: ThemeBorderWidth = [
  { name: 'thin', value: '1px' },
  { name: 'medium', value: '2px' },
  { name: 'thick', value: '3px' },
];

export const DEFAULT_GRADIENTS: ThemeGradient[] = [
  {
    name: 'Primary to Secondary',
    type: 'linear',
    direction: 'to right',
    colors: [DEFAULT_COLORS.primary, DEFAULT_COLORS.secondary],
  },
];

export const DEFAULT_OPACITY: ThemeOpacity = [
  { name: 'disabled', value: 0.38 },
  { name: 'hover', value: 0.08 },
  { name: 'focused', value: 0.12 },
  { name: 'pressed', value: 0.12 },
  { name: 'dragged', value: 0.16 },
];

export const DEFAULT_ELEVATION: ThemeElevation = [
  { name: 'level0', value: 'none' },
  { name: 'level1', value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)' },
  { name: 'level2', value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)' },
  { name: 'level3', value: '0px 4px 8px 3px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.3)' },
  { name: 'level4', value: '0px 6px 10px 4px rgba(0, 0, 0, 0.15), 0px 2px 3px rgba(0, 0, 0, 0.3)' },
  { name: 'level5', value: '0px 8px 12px 6px rgba(0, 0, 0, 0.15), 0px 4px 4px rgba(0, 0, 0, 0.3)' },
];

export const DEFAULT_PROPERTIES: ThemeProperties = {
  spacing: DEFAULT_SPACING,
  borderRadius: DEFAULT_BORDER_RADIUS,
  borderWidth: DEFAULT_BORDER_WIDTH,
  gradients: DEFAULT_GRADIENTS,
  opacity: DEFAULT_OPACITY,
  elevation: DEFAULT_ELEVATION,
};

export const INITIAL_THEME_CONFIG: ThemeConfiguration = {
  colors: DEFAULT_COLORS,
  fonts: DEFAULT_FONTS,
  properties: DEFAULT_PROPERTIES,
};

export const CORE_COLOR_KEYS: (keyof MaterialColors)[] = ['primary', 'secondary', 'tertiary', 'error', 'surface', 'onSurface']
  .filter(k => k !== 'seedColor') as (keyof MaterialColors)[];

export const EXTENDED_COLOR_KEYS: (keyof MaterialColors)[] = (Object.keys(DEFAULT_COLORS) as Array<keyof MaterialColors>)
  .filter(key => key !== 'seedColor' && !CORE_COLOR_KEYS.includes(key));
