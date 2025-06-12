

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
  FontWeightValue,
  ColorModeValues
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
  seedColor: '#89729B', // Desaturated Purple (PRD Primary)
  primary: { light: '#89729B', dark: '#C0B1D0' }, 
  secondary: { light: '#72899B', dark: '#B1C0D0' }, // Soft Blue (PRD Accent, used as Secondary here)
  tertiary: { light: '#9B7289', dark: '#D0B1C0' }, // A complementary color
  error: { light: '#B3261E', dark: '#F2B8B5' },
  surface: { light: '#F4EFF7', dark: '#2C292E' }, // Light Grayish Purple for light bg (PRD), dark derived
  onSurface: { light: '#1E1B20', dark: '#E9E0ED' }, // Darker variant for text (PRD), light derived
  
  primaryContainer: { light: '#EBDDFA', dark: '#503C60' },
  onPrimaryContainer: { light: '#2F1545', dark: '#F4E8FF' },
  secondaryContainer: { light: '#DDECF8', dark: '#3C5060' },
  onSecondaryContainer: { light: '#152F45', dark: '#E8F4FF' },
  tertiaryContainer: { light: '#FADDEB', dark: '#603C50' },
  onTertiaryContainer: { light: '#45152F', dark: '#FFE8F4' },
  errorContainer: { light: '#F9DEDC', dark: '#8C1D18' },
  onErrorContainer: { light: '#410E0B', dark: '#FDE9E8' },
  
  surfaceVariant: { light: '#E9E0ED', dark: '#4A454D' },
  onSurfaceVariant: { light: '#4A454D', dark: '#CDC5CE' },
  
  outline: { light: '#7C757F', dark: '#968F99' },
  outlineVariant: { light: '#CAC4CF', dark: '#4A454D' },
  
  shadow: { light: '#000000', dark: '#000000' }, // Typically not themed light/dark, opacity handles it
  scrim: { light: '#000000', dark: '#000000' },
  
  inverseSurface: { light: '#332F35', dark: '#E9E0ED' },
  onInverseSurface: { light: '#F7F0F8', dark: '#1E1B20' },
  inversePrimary: { light: '#D8BFFF', dark: '#89729B' },

  // For builder UI itself, matching PRD guidelines initially for light mode
  background: { light: '#F4EFF7', dark: '#221E25' }, // PRD background, derived dark
  foreground: { light: '#1E1B20', dark: '#E9E0ED' }, // Derived from PRD background's text color
  accent: { light: '#72899B', dark: '#B1C0D0' }, // PRD accent
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
    name: 'PrimaryToSecondary', // Using default light mode colors for the initial example
    type: 'linear',
    direction: 'to right',
    colors: [DEFAULT_COLORS.primary.light, DEFAULT_COLORS.secondary.light], 
  },
];

export const DEFAULT_OPACITY: CustomNumericPropertyItem[] = [
  { name: 'disabled', value: 0.38 },
  { name: 'hover', value: 0.08 },
  { name: 'focused', value: 0.12 },
  { name: 'pressed', value: 0.12 },
  { name: 'dragged', value: 0.16 },
];

export const DEFAULT_ELEVATION: CustomStringPropertyItem[] = [
  { name: 'level0', value: 'none' },
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


export const CORE_COLOR_ROLES: (keyof Omit<MaterialColors, 'seedColor' | 'background' | 'foreground' | 'accent'>)[] = [
    'primary', 'secondary', 'tertiary', 'error', 'surface', 'onSurface'
];

export const EXTENDED_COLOR_ROLES: (keyof Omit<MaterialColors, 'seedColor' | 'background' | 'foreground' | 'accent'>)[] = 
    (Object.keys(DEFAULT_COLORS) as Array<keyof MaterialColors>)
    .filter(key => key !== 'seedColor' && 
                   key !== 'background' && 
                   key !== 'foreground' && 
                   key !== 'accent' &&
                   !CORE_COLOR_ROLES.includes(key as any));

// For the UI, we might want to group them differently or have specific lists
export const UI_COLOR_INPUT_ORDER: (keyof Omit<MaterialColors, 'seedColor'>)[] = [
    'primary', 'secondary', 'tertiary', 'error', 
    'surface', 'onSurface', 'background', 'foreground', 'accent', // Including builder UI colors
    'primaryContainer', 'onPrimaryContainer',
    'secondaryContainer', 'onSecondaryContainer',
    'tertiaryContainer', 'onTertiaryContainer',
    'errorContainer', 'onErrorContainer',
    'surfaceVariant', 'onSurfaceVariant',
    'outline', 'outlineVariant',
    'inverseSurface', 'onInverseSurface', 'inversePrimary',
    'shadow', 'scrim',
];


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
    { value: 'center', label: 'Center (Implicit)' },
];
