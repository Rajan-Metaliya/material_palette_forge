

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
  seedColor: '#6750A4', // This will be the initial seed
  primary: '#89729B', // Example, will be generated
  secondary: '#625B71', // Example, will be generated
  tertiary: '#7D5260', // Example, will be generated
  error: '#B3261E', // Often fixed
  surface: '#F4EFF7', // Example, will be generated
  onSurface: '#1C1B1F', // Example, will be generated
  primaryContainer: '#EADDFF', // Example, will be generated
  onPrimaryContainer: '#21005D', // Example, will be generated
  secondaryContainer: '#E8DEF8', // Example, will be generated
  onSecondaryContainer: '#1D192B', // Example, will be generated
  tertiaryContainer: '#FFD8E4', // Example, will be generated
  onTertiaryContainer: '#31111D', // Example, will be generated
  errorContainer: '#F9DEDC', // Example, will be generated from error
  onErrorContainer: '#410E0B', // Example, will be generated from error
  surfaceVariant: '#E7E0EC', // Example, will be generated
  onSurfaceVariant: '#49454F', // Example, will be generated
  outline: '#79747E', // Example, will be generated
  outlineVariant: '#C4C7C5', // Example, will be generated for dark mode theming
  shadow: '#000000', // Typically black
  scrim: '#000000', // Typically black
  inverseSurface: '#313033', // Example, will be generated
  onInverseSurface: '#F4EFF4', // Example, will be generated
  inversePrimary: '#D0BCFF', // Example, will be generated
};

const defaultHeadlineFont = 'Space Grotesk';
const defaultBodyFont = 'Inter';

export const DEFAULT_MATERIAL_TEXT_STYLES: Record<MaterialTextStyleKey, TextStyleProperties> = {
  displayLarge: { fontFamily: defaultHeadlineFont, fontSize: 57, fontWeight: 400, letterSpacing: -0.25, lineHeight: 1.12 }, 
  displayMedium: { fontFamily: defaultHeadlineFont, fontSize: 45, fontWeight: 400, letterSpacing: 0, lineHeight: 1.15 }, 
  displaySmall: { fontFamily: defaultHeadlineFont, fontSize: 36, fontWeight: 400, letterSpacing: 0, lineHeight: 1.22 }, 
  headlineLarge: { fontFamily: defaultHeadlineFont, fontSize: 32, fontWeight: 400, letterSpacing: 0, lineHeight: 1.25 }, 
  headlineMedium: { fontFamily: defaultHeadlineFont, fontSize: 28, fontWeight: 400, letterSpacing: 0, lineHeight: 1.28 }, 
  headlineSmall: { fontFamily: defaultHeadlineFont, fontSize: 24, fontWeight: 400, letterSpacing: 0, lineHeight: 1.33 }, 
  titleLarge: { fontFamily: defaultHeadlineFont, fontSize: 22, fontWeight: 400, letterSpacing: 0, lineHeight: 1.27 }, 
  titleMedium: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 500, letterSpacing: 0.15, lineHeight: 1.5 }, 
  titleSmall: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43 }, 
  bodyLarge: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 400, letterSpacing: 0.5, lineHeight: 1.5 }, 
  bodyMedium: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 400, letterSpacing: 0.25, lineHeight: 1.43 }, 
  bodySmall: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 400, letterSpacing: 0.4, lineHeight: 1.33 }, 
  labelLarge: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43 }, 
  labelMedium: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.33 }, 
  labelSmall: { fontFamily: defaultBodyFont, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.45 }, 
};

export const DEFAULT_FONTS: ThemeFonts = {
  materialTextStyles: JSON.parse(JSON.stringify(DEFAULT_MATERIAL_TEXT_STYLES)),
  customTextStyles: [],
};

export const DEFAULT_SPACING: CustomNumericPropertyItem[] = [
  { name: 'xs', value: 4 },
  { name: 'sm', value: 8 },
  { name: 'md', value: 16 },
  { name: 'lg', value: 24 },
  { name: 'xl', value: 32 },
];

export const DEFAULT_BORDER_RADIUS: CustomNumericPropertyItem[] = [
  { name: 'xs', value: 2 },
  { name: 'sm', value: 4 },
  { name: 'md', value: 8 },
  { name: 'lg', value: 12 },
  { name: 'xl', value: 16 },
  { name: 'full', value: 9999 },
];

export const DEFAULT_BORDER_WIDTH: CustomNumericPropertyItem[] = [
  { name: 'thin', value: 1 },
  { name: 'medium', value: 2 },
  { name: 'thick', value: 3 },
];

export const DEFAULT_GRADIENTS: ThemeGradient[] = [
  {
    name: 'Primary to Secondary',
    type: 'linear',
    direction: 'to right',
    colors: [DEFAULT_COLORS.primary, DEFAULT_COLORS.secondary], // These will be updated once seed generates them
  },
];

export const DEFAULT_OPACITY: CustomNumericPropertyItem[] = [
  { name: 'disabled', value: 0.38 },
  { name: 'hover', value: 0.08 }, // Standard M3 hover opacity
  { name: 'focused', value: 0.12 }, // Standard M3 focus opacity
  { name: 'pressed', value: 0.12 }, // Standard M3 press opacity
  { name: 'dragged', value: 0.16 }, // Standard M3 drag opacity
];

export const DEFAULT_ELEVATION: CustomStringPropertyItem[] = [
  { name: 'level0', value: 'none' }, // M3 uses tonal elevation, so shadows are subtle or part of surface color
  { name: 'level1', value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 1px 3px 1px rgba(0, 0, 0, 0.15)' },
  { name: 'level2', value: '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)' },
  { name: 'level3', value: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)' },
  { name: 'level4', value: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px rgba(0,0,0,0.3)' },
  { name: 'level5', value: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px rgba(0,0,0,0.3)' },
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
  colors: JSON.parse(JSON.stringify(DEFAULT_COLORS)),
  fonts: JSON.parse(JSON.stringify(DEFAULT_FONTS)),
  properties: JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)),
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

export const GRADIENT_TYPES = [
  { value: 'linear', label: 'Linear' },
  { value: 'radial', label: 'Radial' },
];

export const GRADIENT_LINEAR_DIRECTIONS = [
  { value: 'to right', label: 'To Right (→)' },
  { value: 'to left', label: 'To Left (←)' },
  { value: 'to top', label: 'To Top (↑)' },
  { value: 'to bottom', label: 'To Bottom (↓)' },
  { value: 'to top left', label: 'To Top Left (↖)' },
  { value: 'to top right', label: 'To Top Right (↗)' },
  { value: 'to bottom left', label: 'To Bottom Left (↙)' },
  { value: 'to bottom right', label: 'To Bottom Right (↘)' },
  { value: '45deg', label: '45 Degrees (↗)' },
  { value: '90deg', label: '90 Degrees (↑)' },
  { value: '135deg', label: '135 Degrees (↖)' },
  { value: '180deg', label: '180 Degrees (←)' },
  { value: '225deg', label: '225 Degrees (↙)' },
  { value: '270deg', label: '270 Degrees (↓)' },
  { value: '315deg', label: '315 Degrees (↘)' },
];

export const GRADIENT_RADIAL_SHAPES = [
    { value: 'circle', label: 'Circle' },
    { value: 'ellipse', label: 'Ellipse' },
];

export const GRADIENT_RADIAL_EXTENTS = [
    { value: 'closest-side', label: 'Closest Side' },
    { value: 'closest-corner', label: 'Closest Corner' },
    { value: 'farthest-side', label: 'Farthest Side' },
    { value: 'farthest-corner', label: 'Farthest Corner' },
    { value: 'center', label: 'Center (Implicit)' }, // Though 'center' is often part of position
];
