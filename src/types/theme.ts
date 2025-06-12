
export interface MaterialColors {
  seedColor: string; // Used as input for generation, not a direct ColorScheme role
  primary: string;
  secondary: string;
  tertiary: string;
  error: string;
  surface: string; // Maps to ColorScheme.surface
  onSurface: string; // Maps to ColorScheme.onSurface
  primaryContainer: string;
  onPrimaryContainer: string; // This will map to ColorScheme.onPrimary for text on primary, and onPrimaryContainer for text on primaryContainer. Needs care.
  secondaryContainer: string;
  onSecondaryContainer: string; // Similar mapping for secondary
  tertiaryContainer: string;
  onTertiaryContainer: string; // Similar mapping for tertiary
  errorContainer: string;
  onErrorContainer: string; // Similar mapping for error
  surfaceVariant: string;
  onSurfaceVariant: string;
  outline: string;
  outlineVariant: string;
  shadow: string;
  scrim: string;
  inverseSurface: string;
  onInverseSurface: string;
  inversePrimary: string;
  // surfaceTint is often same as primary in M3, will be handled in generator
}

export interface ThemeFonts {
  primary: string;
  secondary: string;
  monospace: string;
}

// For properties that are primarily strings, e.g., CSS box-shadow
export interface CustomStringPropertyItem {
  name: string;
  value: string; 
}

// For properties that are numeric
export interface CustomNumericPropertyItem {
  name: string;
  value: number;
}

export type ThemeSpacing = CustomNumericPropertyItem[]; // e.g., { name: 'small', value: 8 }
export type ThemeBorderRadius = CustomNumericPropertyItem[]; // e.g., { name: 'medium', value: 12 }
export type ThemeBorderWidth = CustomNumericPropertyItem[]; // e.g., { name: 'thin', value: 1 }
export type ThemeOpacity = CustomNumericPropertyItem[]; // e.g., { name: 'disabled', value: 0.38 }
export type ThemeElevation = CustomStringPropertyItem[]; // e.g., { name: 'level1', value: '0px 1px 2px rgba(0,0,0,0.1)'}


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

