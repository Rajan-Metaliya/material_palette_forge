

import type { 
  ThemeConfiguration, 
  MaterialColors, 
  ThemeFonts, 
  ThemeProperties, 
  ThemeGradient, 
  CustomStringPropertyItem, 
  CustomNumericPropertyItem,
  TextStyleProperties,
  MaterialTextStyleKey,
  FontWeightValue
} from '@/types/theme';

export const COMMON_WEB_FONTS = [
  { value: 'Inter', label: 'Inter', stack: 'Inter, sans-serif' },
  { value: 'Roboto', label: 'Roboto', stack: 'Roboto, sans-serif' },
  { value: 'Open Sans', label: 'Open Sans', stack: '"Open Sans", sans-serif' },
  { value: 'Lato', label: 'Lato', stack: 'Lato, sans-serif' },
  { value: 'Montserrat', label: 'Montserrat', stack: 'Montserrat, sans-serif' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro', stack: '"Source Sans Pro", sans-serif' },
  { value: 'Space Grotesk', label: 'Space Grotesk', stack: '"Space Grotesk", sans-serif' },
  { value: 'Arial', label: 'Arial', stack: 'Arial, sans-serif' },
  { value: 'Verdana', label: 'Verdana', stack: 'Verdana, sans-serif' },
  { value: 'Georgia', label: 'Georgia', stack: 'Georgia, serif' },
  { value: 'Times New Roman', label: 'Times New Roman', stack: '"Times New Roman", serif' },
  { value: 'Courier New', label: 'Courier New', stack: '"Courier New", monospace' },
  { value: 'monospace', label: 'Monospace (System)', stack: 'monospace'},
];

export const FONT_WEIGHT_OPTIONS: { label: string; value: FontWeightValue }[] = [
  { label: 'Thin (100)', value: 100 },
  { label: 'Extra Light (200)', value: 200 },
  { label: 'Light (300)', value: 300 },
  { label: 'Normal (400)', value: 400 },
  { label: 'Normal (String)', value: 'normal' },
  { label: 'Medium (500)', value: 500 },
  { label: 'Semi Bold (600)', value: 600 },
  { label: 'Bold (700)', value: 700 },
  { label: 'Bold (String)', value: 'bold' },
  { label: 'Extra Bold (800)', value: 800 },
  { label: 'Black (900)', value: 900 },
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

const defaultHeadlineFont = 'Space Grotesk';
const defaultBodyFont = 'Inter';

export const DEFAULT_MATERIAL_TEXT_STYLES: Record<MaterialTextStyleKey, TextStyleProperties> = {
  displayLarge: { fontFamily: defaultHeadlineFont, fontSize: 57, fontWeight: 400, letterSpacing: -0.25, lineHeight: 1.12 }, // 64/57
  displayMedium: { fontFamily: defaultHeadlineFont, fontSize: 45, fontWeight: 400, letterSpacing: 0, lineHeight: 1.15 }, // 52/45
  displaySmall: { fontFamily: defaultHeadlineFont, fontSize: 36, fontWeight: 400, letterSpacing: 0, lineHeight: 1.22 }, // 44/36
  headlineLarge: { fontFamily: defaultHeadlineFont, fontSize: 32, fontWeight: 400, letterSpacing: 0, lineHeight: 1.25 }, // 40/32
  headlineMedium: { fontFamily: defaultHeadlineFont, fontSize: 28, fontWeight: 400, letterSpacing: 0, lineHeight: 1.28 }, // 36/28
  headlineSmall: { fontFamily: defaultHeadlineFont, fontSize: 24, fontWeight: 400, letterSpacing: 0, lineHeight: 1.33 }, // 32/24
  titleLarge: { fontFamily: defaultHeadlineFont, fontSize: 22, fontWeight: 400, letterSpacing: 0, lineHeight: 1.27 }, // 28/22
  titleMedium: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 500, letterSpacing: 0.15, lineHeight: 1.5 }, // 24/16
  titleSmall: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43 }, // 20/14
  bodyLarge: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 400, letterSpacing: 0.5, lineHeight: 1.5 }, // 24/16
  bodyMedium: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 400, letterSpacing: 0.25, lineHeight: 1.43 }, // 20/14
  bodySmall: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 400, letterSpacing: 0.4, lineHeight: 1.33 }, // 16/12
  labelLarge: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43 }, // 20/14
  labelMedium: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.33 }, // 16/12
  labelSmall: { fontFamily: defaultBodyFont, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.45 }, // 16/11
};

export const DEFAULT_FONTS: ThemeFonts = {
  materialTextStyles: DEFAULT_MATERIAL_TEXT_STYLES,
  customTextStyles: [],
};

export const DEFAULT_SPACING: ThemeSpacing = [
  { name: 'xs', value: 4 },
  { name: 'sm', value: 8 },
  { name: 'md', value: 16 },
  { name: 'lg', value: 24 },
  { name: 'xl', value: 32 },
];

export const DEFAULT_BORDER_RADIUS: ThemeBorderRadius = [
  { name: 'xs', value: 2 },
  { name: 'sm', value: 4 },
  { name: 'md', value: 8 },
  { name: 'lg', value: 12 },
  { name: 'xl', value: 16 },
  { name: 'full', value: 9999 },
];

export const DEFAULT_BORDER_WIDTH: ThemeBorderWidth = [
  { name: 'thin', value: 1 },
  { name: 'medium', value: 2 },
  { name: 'thick', value: 3 },
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

export const MATERIAL_TEXT_STYLE_ORDER: MaterialTextStyleKey[] = [
  'displayLarge', 'displayMedium', 'displaySmall',
  'headlineLarge', 'headlineMedium', 'headlineSmall',
  'titleLarge', 'titleMedium', 'titleSmall',
  'bodyLarge', 'bodyMedium', 'bodySmall',
  'labelLarge', 'labelMedium', 'labelSmall'
];

// For UI display, to make keys more readable
export const MATERIAL_TEXT_STYLE_LABELS: Record<MaterialTextStyleKey, string> = {
  displayLarge: 'Display Large',
  displayMedium: 'Display Medium',
  displaySmall: 'Display Small',
  headlineLarge: 'Headline Large',
  headlineMedium: 'Headline Medium',
  headlineSmall: 'Headline Small',
  titleLarge: 'Title Large',
  titleMedium: 'Title Medium',
  titleSmall: 'Title Small',
  bodyLarge: 'Body Large',
  bodyMedium: 'Body Medium',
  bodySmall: 'Body Small',
  labelLarge: 'Label Large',
  labelMedium: 'Label Medium',
  labelSmall: 'Label Small',
};
