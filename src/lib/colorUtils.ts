
import type { MaterialColors, ColorModeValues } from '@/types/theme';

// Helper to convert hex to HSL (simplified)
export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper to convert HSL to hex (simplified)
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const toHexComponent = (x: number) => {
    const hex = Math.round(x * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHexComponent(f(0))}${toHexComponent(f(8))}${toHexComponent(f(4))}`.toUpperCase();
}

// Function to generate a palette from a seed color
// This is a simplified approximation of Material 3 color generation.
// Now returns an object where each color role has a light and dark hex string.
export function generateMaterialColorsFromSeed(seedColor: string): Omit<MaterialColors, 'seedColor' | 'background' | 'foreground' | 'accent'> {
  const baseHsl = hexToHsl(seedColor);
  if (!baseHsl) throw new Error('Invalid seed color hex');

  const generated: Partial<Omit<MaterialColors, 'seedColor' | 'background' | 'foreground' | 'accent'>> = {};

  const adjustLightness = (l: number, amount: number, forDark: boolean = false) => {
    if (forDark) return Math.min(100, Math.max(0, l - amount)); // For dark, "amount" makes it darker
    return Math.min(100, Math.max(0, l + amount));
  }
  const adjustSaturation = (s: number, amount: number) => Math.min(100, Math.max(0, s + amount));

  // Key Tones for Material 3 like generation (simplified)
  // Light Mode Tones (L* values approx)
  const TONES_LIGHT = {
    primary: 40, onPrimary: 100, primaryContainer: 90, onPrimaryContainer: 10,
    secondary: 40, onSecondary: 100, secondaryContainer: 90, onSecondaryContainer: 10,
    tertiary: 40, onTertiary: 100, tertiaryContainer: 90, onTertiaryContainer: 10,
    error: 40, onError: 100, errorContainer: 90, onErrorContainer: 10,
    surface: 98, onSurface: 10, surfaceVariant: 90, onSurfaceVariant: 30,
    outline: 50, outlineVariant: 80,
    inverseSurface: 20, onInverseSurface: 95, inversePrimary: 80,
  };

  // Dark Mode Tones (L* values approx)
  const TONES_DARK = {
    primary: 80, onPrimary: 20, primaryContainer: 30, onPrimaryContainer: 90,
    secondary: 80, onSecondary: 20, secondaryContainer: 30, onSecondaryContainer: 90,
    tertiary: 80, onTertiary: 20, tertiaryContainer: 30, onTertiaryContainer: 90,
    error: 80, onError: 20, errorContainer: 30, onErrorContainer: 90,
    surface: 6, onSurface: 90, surfaceVariant: 30, onSurfaceVariant: 80,
    outline: 60, outlineVariant: 30,
    inverseSurface: 90, onInverseSurface: 20, inversePrimary: 40,
  };
  
  const errorBaseHsl = hexToHsl("#B3261E") || {h: 7, s:71, l: 41}; // Default M3 error

  const roles = [
    { name: 'primary', baseHue: baseHsl.h, baseSat: baseHsl.s },
    { name: 'secondary', baseHue: (baseHsl.h + 30) % 360, baseSat: adjustSaturation(baseHsl.s, -25) },
    { name: 'tertiary', baseHue: (baseHsl.h + 60) % 360, baseSat: adjustSaturation(baseHsl.s, -10) },
    { name: 'error', baseHue: errorBaseHsl.h, baseSat: errorBaseHsl.s },
  ] as const;

  type ColorRoleName = typeof roles[number]['name'];
  type ToneRoleName = keyof typeof TONES_LIGHT;


  for (const mode of ['light', 'dark'] as const) {
    const currentTones = mode === 'light' ? TONES_LIGHT : TONES_DARK;

    roles.forEach(role => {
      generated[role.name] = generated[role.name] || { light: '', dark: '' };
      generated[`on${capitalize(role.name)}Container` as const] = generated[`on${capitalize(role.name)}Container` as const] || { light: '', dark: '' };
      generated[`${role.name}Container` as const] = generated[`${role.name}Container` as const] || { light: '', dark: '' };

      generated[role.name]![mode] = hslToHex(role.baseHue, role.baseSat, currentTones[role.name]);
      generated[`on${capitalize(role.name)}Container` as const]![mode] = hslToHex(role.baseHue, adjustSaturation(role.baseSat, role.name === 'error' ? 0 : 5), currentTones[`on${capitalize(role.name)}Container` as ToneRoleName]);
      generated[`${role.name}Container` as const]![mode] = hslToHex(role.baseHue, adjustSaturation(role.baseSat, -5) , currentTones[`${role.name}Container` as ToneRoleName]);
    });
    
    // Surface, Outline, Inverse (using primary's hue and a low saturation for neutrality)
    const neutralHue = baseHsl.h;
    const neutralSat = adjustSaturation(baseHsl.s, -60); // More desaturated for surfaces

    generated.surface = generated.surface || { light: '', dark: '' };
    generated.onSurface = generated.onSurface || { light: '', dark: '' };
    generated.surfaceVariant = generated.surfaceVariant || { light: '', dark: '' };
    generated.onSurfaceVariant = generated.onSurfaceVariant || { light: '', dark: '' };
    generated.outline = generated.outline || { light: '', dark: '' };
    generated.outlineVariant = generated.outlineVariant || { light: '', dark: '' };
    generated.inverseSurface = generated.inverseSurface || { light: '', dark: '' };
    generated.onInverseSurface = generated.onInverseSurface || { light: '', dark: '' };
    generated.inversePrimary = generated.inversePrimary || { light: '', dark: '' };

    generated.surface[mode] = hslToHex(neutralHue, neutralSat, currentTones.surface);
    generated.onSurface[mode] = hslToHex(neutralHue, neutralSat, currentTones.onSurface);
    generated.surfaceVariant[mode] = hslToHex(neutralHue, neutralSat, currentTones.surfaceVariant);
    generated.onSurfaceVariant[mode] = hslToHex(neutralHue, neutralSat, currentTones.onSurfaceVariant);
    generated.outline[mode] = hslToHex(neutralHue, neutralSat, currentTones.outline);
    generated.outlineVariant[mode] = hslToHex(neutralHue, neutralSat, currentTones.outlineVariant);
    generated.inverseSurface[mode] = hslToHex(neutralHue, neutralSat, currentTones.inverseSurface);
    generated.onInverseSurface[mode] = hslToHex(neutralHue, neutralSat, currentTones.onInverseSurface);
    // InversePrimary uses primary's hue and saturation but with inverse tones
    generated.inversePrimary[mode] = hslToHex(baseHsl.h, baseHsl.s, currentTones.inversePrimary);

    // Shadow and Scrim are typically black with opacity, so hex is just black.
    generated.shadow = generated.shadow || { light: '#000000', dark: '#000000' };
    generated.scrim = generated.scrim || { light: '#000000', dark: '#000000' };
  }
  
  return generated as Omit<MaterialColors, 'seedColor' | 'background' | 'foreground' | 'accent'>;
}

function capitalize<T extends string>(s: T): Capitalize<T> {
  return (s.charAt(0).toUpperCase() + s.slice(1)) as Capitalize<T>;
}
