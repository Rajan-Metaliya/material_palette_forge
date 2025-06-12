

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
  background?: ColorModeValues; 
  foreground?: ColorModeValues; 
  accent?: ColorModeValues; 
}

export type FontWeightValue = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';

export interface TextStyleProperties {
  fontFamily: string;
  fontSize: number; 
  fontWeight: FontWeightValue;
  letterSpacing: number; 
  lineHeight?: number; 
  color?: ColorModeValues; // Optional color per text style
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
  value: string; 
}

export interface CustomNumericPropertyItem {
  name: string;
  value: number; 
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
  colors: string[]; 
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
