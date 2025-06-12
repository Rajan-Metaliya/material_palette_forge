export interface MaterialColors {
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

export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ThemeBorderRadius {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface ThemeBorderWidth {
  thin: string;
  medium: string;
  thick: string;
}

export interface ThemeGradient {
  name: string;
  type: 'linear' | 'radial';
  direction?: string; // For linear, e.g., 'to right', '45deg'
  shape?: string; // For radial, e.g., 'circle'
  extent?: string; // For radial, e.g., 'farthest-corner'
  colors: string[];
}

export interface ThemeOpacity {
  disabled: number;
  hover: number;
  focused: number;
  pressed: number;
  dragged: number;
}

export interface ThemeElevation {
  level0: string;
  level1: string;
  level2: string;
  level3: string;
  level4: string;
  level5: string;
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
