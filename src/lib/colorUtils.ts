import type { MaterialColors } from '@/types/theme';

// Helper to convert hex to HSL (simplified)
function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
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
function hslToHex(h: number, s: number, l: number): string {
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
  return `#${toHexComponent(f(0))}${toHexComponent(f(8))}${toHexComponent(f(4))}`;
}

// Function to generate a palette from a seed color
// This is a simplified approximation of Material 3 color generation.
export function generateMaterialColorsFromSeed(seedColor: string): Partial<MaterialColors> {
  const baseHsl = hexToHsl(seedColor);
  if (!baseHsl) return {}; 

  const colors: Partial<MaterialColors> = {};

  const adjustLightness = (l: number, amount: number) => Math.min(100, Math.max(0, l + amount));
  const adjustSaturation = (s: number, amount: number) => Math.min(100, Math.max(0, s + amount));

  // Primary
  colors.primary = hslToHex(baseHsl.h, baseHsl.s, baseHsl.l);
  colors.onPrimaryContainer = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, 5), adjustLightness(baseHsl.l, baseHsl.l > 50 ? -50 : 50));
  colors.primaryContainer = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -5), adjustLightness(baseHsl.l, baseHsl.l > 50 ? 40 : -30));

  // Secondary (analogous color, slightly desaturated)
  const secondaryHue = (baseHsl.h + 30) % 360;
  const secondarySaturation = adjustSaturation(baseHsl.s, -10);
  const secondaryLightness = baseHsl.l;
  colors.secondary = hslToHex(secondaryHue, secondarySaturation, secondaryLightness);
  colors.onSecondaryContainer = hslToHex(secondaryHue, adjustSaturation(secondarySaturation,5), adjustLightness(secondaryLightness, secondaryLightness > 50 ? -50 : 50));
  colors.secondaryContainer = hslToHex(secondaryHue, adjustSaturation(secondarySaturation, -5), adjustLightness(secondaryLightness, secondaryLightness > 50 ? 40 : -30));

  // Tertiary (another analogous or complementary, desaturated)
  const tertiaryHue = (baseHsl.h + 60) % 360; 
  const tertiarySaturation = adjustSaturation(baseHsl.s, -15);
  const tertiaryLightness = adjustLightness(baseHsl.l, 5);
  colors.tertiary = hslToHex(tertiaryHue, tertiarySaturation, tertiaryLightness);
  colors.onTertiaryContainer = hslToHex(tertiaryHue, adjustSaturation(tertiarySaturation,5), adjustLightness(tertiaryLightness, tertiaryLightness > 50 ? -50 : 50));
  colors.tertiaryContainer = hslToHex(tertiaryHue, adjustSaturation(tertiarySaturation, -5), adjustLightness(tertiaryLightness, tertiaryLightness > 50 ? 40 : -30));
  
  // Surface colors
  colors.surface = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -40), 98); // Very light
  colors.onSurface = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -10), 10); // Very dark
  colors.surfaceVariant = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -25), 90);
  colors.onSurfaceVariant = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -5), 30);
  
  colors.outline = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -25), 50);
  colors.outlineVariant = hslToHex(baseHsl.h, adjustSaturation(baseHsl.s, -30), 80);

  // Error (typically fixed, but can be derived if needed)
  colors.error = '#B3261E'; // M3 Red
  const errorHsl = hexToHsl(colors.error!) || {h:10, s:80, l:45};
  colors.onErrorContainer = hslToHex(errorHsl.h, errorHsl.s, 10); 
  colors.errorContainer = hslToHex(errorHsl.h, errorHsl.s, 90);

  // Inverse
  colors.inverseSurface = colors.onSurface; // Simplified: dark becomes light
  colors.onInverseSurface = colors.surface; // light becomes dark
  colors.inversePrimary = hslToHex(baseHsl.h, baseHsl.s, adjustLightness(baseHsl.l, baseHsl.l > 50 ? -30 : 30)); 

  // Shadow & Scrim (typically black with opacity, hex can't represent opacity directly)
  colors.shadow = '#000000'; 
  colors.scrim = '#000000';  
  
  return colors;
}
