
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
  ColorModeValues,
  CustomColorItem
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

// Updated default colors based on seed #059D66 and new app shell colors
export const DEFAULT_COLORS: MaterialColors = {
  seedColor: '#059D66', // New seed color
  primary: { light: '#006D4D', dark: '#82D9B3' },
  secondary: { light: '#4C6358', dark: '#B5CCBF' },
  tertiary: { light: '#3E6374', dark: '#A4C8DB' },
  error: { light: '#BA1A1A', dark: '#FFB4AB' },
  surface: { light: '#F5FAF8', dark: '#1F2522' },
  onSurface: { light: '#181D1A', dark: '#E0E3E0' },

  primaryContainer: { light: '#9EF6CE', dark: '#00523A' },
  onPrimaryContainer: { light: '#002115', dark: '#9EF6CE' },
  secondaryContainer: { light: '#CEE9DB', dark: '#354B41' },
  onSecondaryContainer: { light: '#092017', dark: '#C1E9D5' },
  tertiaryContainer: { light: '#C2E8FB', dark: '#264B5C' },
  onTertiaryContainer: { light: '#001F2A', dark: '#C2E8FB' },
  errorContainer: { light: '#FFDAD6', dark: '#93000A' },
  onErrorContainer: { light: '#410002', dark: '#FFDAD6' },

  surfaceVariant: { light: '#DAE5DE', dark: '#3F4943' },
  onSurfaceVariant: { light: '#3F4943', dark: '#BEC9C2' },

  outline: { light: '#707973', dark: '#89938C' },
  outlineVariant: { light: '#C0C9C1', dark: '#3F4943' },

  shadow: { light: '#000000', dark: '#000000' }, // Typically black with opacity controlled elsewhere
  scrim: { light: '#000000', dark: '#000000' }, // Typically black with opacity

  inverseSurface: { light: '#2C322E', dark: '#E0E3E0' },
  onInverseSurface: { light: '#EFF1ED', dark: '#181D1A' },
  inversePrimary: { light: '#82D9B3', dark: '#006D4D' },

  // App Shell Specific Colors (distinct from the M3 theme being designed)
  background: { light: '#F8F9FA', dark: '#1A1B1E' }, // Neutral app background
  foreground: { light: '#212529', dark: '#E8EAED' }, // App shell text
  accent: { light: '#F97316', dark: '#FB923C' },     // Orange accent for UI elements
};


const defaultHeadlineFont = 'Space Grotesk';
const defaultBodyFont = 'Inter';
const defaultLightTextColor: string = '#36454F'; // User specified default
const defaultDarkTextColor: string = '#E0E3E0'; //  M3 onSurface.dark from green seed
const defaultTextColorPerStyle: ColorModeValues = { light: defaultLightTextColor, dark: defaultDarkTextColor };


export const DEFAULT_MATERIAL_TEXT_STYLES: Record<MaterialTextStyleKey, TextStyleProperties> = {
  displayLarge: { fontFamily: defaultHeadlineFont, fontSize: 57, fontWeight: 400, letterSpacing: -0.25, lineHeight: 1.12, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  displayMedium: { fontFamily: defaultHeadlineFont, fontSize: 45, fontWeight: 400, letterSpacing: 0, lineHeight: 1.15, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  displaySmall: { fontFamily: defaultHeadlineFont, fontSize: 36, fontWeight: 400, letterSpacing: 0, lineHeight: 1.22, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  headlineLarge: { fontFamily: defaultHeadlineFont, fontSize: 32, fontWeight: 400, letterSpacing: 0, lineHeight: 1.25, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  headlineMedium: { fontFamily: defaultHeadlineFont, fontSize: 28, fontWeight: 400, letterSpacing: 0, lineHeight: 1.28, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  headlineSmall: { fontFamily: defaultHeadlineFont, fontSize: 24, fontWeight: 400, letterSpacing: 0, lineHeight: 1.33, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  titleLarge: { fontFamily: defaultHeadlineFont, fontSize: 22, fontWeight: 400, letterSpacing: 0, lineHeight: 1.27, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  titleMedium: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 500, letterSpacing: 0.15, lineHeight: 1.5, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  titleSmall: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  bodyLarge: { fontFamily: defaultBodyFont, fontSize: 16, fontWeight: 400, letterSpacing: 0.5, lineHeight: 1.5, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  bodyMedium: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 400, letterSpacing: 0.25, lineHeight: 1.43, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  bodySmall: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 400, letterSpacing: 0.4, lineHeight: 1.33, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  labelLarge: { fontFamily: defaultBodyFont, fontSize: 14, fontWeight: 500, letterSpacing: 0.1, lineHeight: 1.43, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  labelMedium: { fontFamily: defaultBodyFont, fontSize: 12, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.33, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
  labelSmall: { fontFamily: defaultBodyFont, fontSize: 11, fontWeight: 500, letterSpacing: 0.5, lineHeight: 1.45, color: JSON.parse(JSON.stringify(defaultTextColorPerStyle)) },
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
    name: 'PrimaryToSecondary',
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

// Define DEFAULT_PROPERTIES before it's used by INITIAL_THEME_CONFIG
export const DEFAULT_PROPERTIES: ThemeProperties = {
  spacing: JSON.parse(JSON.stringify(DEFAULT_SPACING)),
  borderRadius: JSON.parse(JSON.stringify(DEFAULT_BORDER_RADIUS)),
  borderWidth: JSON.parse(JSON.stringify(DEFAULT_BORDER_WIDTH)),
  gradients: JSON.parse(JSON.stringify(DEFAULT_GRADIENTS)),
  opacity: JSON.parse(JSON.stringify(DEFAULT_OPACITY)),
  elevation: JSON.parse(JSON.stringify(DEFAULT_ELEVATION)),
};

export const DEFAULT_CUSTOM_COLORS: CustomColorItem[] = [];

export const INITIAL_THEME_CONFIG: ThemeConfiguration = {
  colors: JSON.parse(JSON.stringify(DEFAULT_COLORS)),
  fonts: JSON.parse(JSON.stringify(DEFAULT_FONTS)),
  properties: JSON.parse(JSON.stringify(DEFAULT_PROPERTIES)),
  customColors: JSON.parse(JSON.stringify(DEFAULT_CUSTOM_COLORS)),
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

// This order also influences the ColorSection UI.
// 'background', 'foreground', and 'accent' are included here as they are part of MaterialColors type
// and need to be editable, even if they have specific roles for the app shell.
export const UI_COLOR_INPUT_ORDER: (keyof Omit<MaterialColors, 'seedColor'>)[] = [
    'primary', 'secondary', 'tertiary', 'error',
    'surface', 'onSurface',
    'background', // App shell background
    'foreground', // App shell foreground
    'accent',     // App shell accent
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
