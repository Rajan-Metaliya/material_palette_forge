

export interface ColorModeValues {
  light: string;
  dark: string;
}

export interface MaterialColors {
  seedColor: string; // Remains a single value for generation
  primary: ColorModeValues;
  secondary: ColorModeValues;
  tertiary: ColorModeValues;
  error: ColorModeValues;
  surface: ColorModeValues;
  onSurface: ColorModeValues;
  primaryContainer: ColorModeValues;
  onPrimaryContainer: ColorModeValues;
  secondaryContainer: ColorModeValues;
  onSecondaryContainer: ColorModeValues;
  tertiaryContainer: ColorModeValues;
  onTertiaryContainer: ColorModeValues;
  errorContainer: ColorModeValues;
  onErrorContainer: ColorModeValues;
  surfaceVariant: ColorModeValues;
  onSurfaceVariant: ColorModeValues;
  outline: ColorModeValues;
  outlineVariant: ColorModeValues;
  shadow: ColorModeValues;
  scrim: ColorModeValues;
  inverseSurface: ColorModeValues;
  onInverseSurface: ColorModeValues;
  inversePrimary: ColorModeValues;
  // Accent and other specific colors for the builder UI, separate from M3 roles
  // These might not need dark/light if the builder itself uses the generated theme
  background?: ColorModeValues; // For builder's own background
  foreground?: ColorModeValues; // For builder's own foreground
  accent?: ColorModeValues; // For builder's own accent
}

export type FontWeightValue = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';

export interface TextStyleProperties {
  fontFamily: string;
  fontSize: number; 
  fontWeight: FontWeightValue;
  letterSpacing: number; 
  lineHeight?: number; 
  // color property here could also be ColorModeValues if text styles have independent light/dark colors
}

export type MaterialTextStyleKey =
  | 'displayLarge' | 'displayMedium' | 'displaySmall'
  | 'headlineLarge' | 'headlineMedium' | 'headlineSmall'
  | 'titleLarge' | 'titleMedium' | 'titleSmall'
  | 'bodyLarge' | 'bodyMedium' | 'bodySmall'
  | 'labelLarge' | 'labelMedium' | 'labelSmall';

export interface ThemeFonts {
  materialTextStyles: Record<MaterialTextStyleKey, TextStyleProperties>;
  customTextStyles: Array<{
    name: string;
    style: TextStyleProperties;
  }>;
}

export interface CustomStringPropertyItem {
  name: string;
  value: string; // Values like box-shadow strings
}

export interface CustomNumericPropertyItem {
  name: string;
  value: number; // Values for spacing, radius, width, opacity (0-1)
}

export type ThemeSpacing = CustomNumericPropertyItem[];
export type ThemeBorderRadius = CustomNumericPropertyItem[];
export type ThemeBorderWidth = CustomNumericPropertyItem[];
export type ThemeOpacity = CustomNumericPropertyItem[];
export type ThemeElevation = CustomStringPropertyItem[];


export interface ThemeGradient {
  name: string;
  type: 'linear' | 'radial';
  direction?: string;
  shape?: string;
  extent?: string;
  colors: string[]; // Gradient colors themselves are usually fixed, not per-mode directly within the gradient definition
                   // They would use colors from the MaterialColors which *are* per-mode.
}


export interface ThemeProperties {
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  borderWidth: ThemeBorderWidth;
  gradients: ThemeGradient[];
  opacity: ThemeOpacity;
  elevation: ThemeElevation;
}

export interface ThemeConfiguration {
  colors: MaterialColors;
  fonts: ThemeFonts;
  properties: ThemeProperties;
}
