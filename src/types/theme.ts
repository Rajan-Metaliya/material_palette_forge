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

export interface ThemeFonts {
  primary: string;
  secondary: string;
  monospace: string;
}

export interface CustomPropertyItem {
  name: string;
  value: string; // For Spacing, BorderRadius, BorderWidth, Elevation (string value like '8px', '0 0 2px black')
}

export interface CustomNumericPropertyItem {
  name: string;
  value: number; // For Opacity
}

export type ThemeSpacing = CustomPropertyItem[];
export type ThemeBorderRadius = CustomPropertyItem[];
export type ThemeBorderWidth = CustomPropertyItem[];
export type ThemeOpacity = CustomNumericPropertyItem[];
export type ThemeElevation = CustomPropertyItem[];


export interface ThemeGradient {
  name: string;
  type: 'linear' | 'radial';
  direction?: string; // For linear, e.g., 'to right', '45deg'
  shape?: string; // For radial, e.g., 'circle'
  extent?: string; // For radial, e.g., 'farthest-corner'
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
