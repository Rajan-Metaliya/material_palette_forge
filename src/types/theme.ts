

export interface MaterialColors {
  seedColor: string;
  primary: string;
  secondary: string;
  tertiary: string;
  error: string;
  surface: string;
  onSurface: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  secondaryContainer: string;
  onSecondaryContainer: string;
  tertiaryContainer: string;
  onTertiaryContainer: string;
  errorContainer: string;
  onErrorContainer: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  onInverseSurface: string;
  inversePrimary: string;
}

export type FontWeightValue = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 'normal' | 'bold';

export interface TextStyleProperties {
  fontFamily: string;
  fontSize: number; // For Flutter, this will be treated as double (logical pixels)
  fontWeight: FontWeightValue;
  letterSpacing: number; // For Flutter, this will be treated as double (logical pixels)
  lineHeight?: number; // Optional, for Flutter, this will be TextStyle.height (multiplier)
  // color?: string; // Potential future enhancement
}

// Map Material Design text style keys
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
