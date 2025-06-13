

import type { ThemeConfiguration, MaterialColors, ThemeGradient, CustomStringPropertyItem, CustomNumericPropertyItem, TextStyleProperties, MaterialTextStyleKey, FontWeightValue, ColorModeValues, CustomColorItem } from '@/types/theme';
import { COMMON_WEB_FONTS, DEFAULT_COLORS } from './consts';

function toFlutterColor(hex: string): string {
  if (!hex || hex.length < 4) return `Color(0xFF000000)`; // Default to black if invalid
  return `Color(0xFF${hex.substring(1).toUpperCase()})`;
}

function sanitizeCamelCase(name: string): string {
  if (!name) return 'unnamedProperty';
  let sanitized = name.replace(/[^a-zA-Z0-9_-\s]/g, ''); // Allow alphanumeric, underscore, hyphen, space
  sanitized = sanitized
    .replace(/[\s_-]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')) // Convert to camelCase
    .replace(/^(.)/, (c) => c.toLowerCase()); // Ensure first char is lowercase

  if (sanitized.match(/^[^a-zA-Z]/) && !sanitized.match(/^_[a-zA-Z]/)) { // if starts with non-alpha (and not _alpha)
    sanitized = 'prop' + sanitized.replace(/^[^a-zA-Z0-9]/, ''); // Prepend 'prop' and remove leading non-alphanum if any
     if (sanitized.length > 4 && sanitized[4] === sanitized[4].toUpperCase()) {
        // propName -> propName
     } else if (sanitized.length > 4) {
        sanitized = sanitized.substring(0,4) + sanitized.charAt(4).toUpperCase() + sanitized.substring(5);
     }
  }
  if (sanitized.length === 0) return 'unnamedProperty';
  return sanitized;
}


function mapFontWeightToFlutter(weight: FontWeightValue): string {
  if (typeof weight === 'string') {
    if (weight === 'normal') return 'FontWeight.w400';
    if (weight === 'bold') return 'FontWeight.w700';
    const numericWeight = parseInt(weight, 10);
    if (!isNaN(numericWeight)) weight = numericWeight as any;
    else return 'FontWeight.w400';
  }
  if (typeof weight === 'number') {
    if (weight >= 100 && weight <= 900 && weight % 100 === 0) {
      return `FontWeight.w${weight}`;
    }
  }
  return 'FontWeight.w400';
}

function generateTextStyleDart(style: TextStyleProperties, mode: 'light' | 'dark', onSurfaceColor: string): string {
  const parts = [
    `fontFamily: '${style.fontFamily}'`,
    `fontSize: ${style.fontSize.toFixed(1)}`,
    `fontWeight: ${mapFontWeightToFlutter(style.fontWeight)}`,
    `letterSpacing: ${style.letterSpacing.toFixed(2)}`,
  ];
  if (style.lineHeight !== undefined) {
    parts.push(`height: ${style.lineHeight.toFixed(2)}`);
  }

  // Use style-specific color if defined, otherwise fallback to onSurface for the current mode
  const textColor = style.color?.[mode] ? toFlutterColor(style.color[mode]) : toFlutterColor(onSurfaceColor);
  parts.push(`color: ${textColor}`);

  return `const TextStyle(\n      ${parts.join(',\n      ')},\n    )`;
}

function generatePropertyExtensionClass(
  className: string,
  properties: Array<CustomNumericPropertyItem | CustomStringPropertyItem>,
  valueTypeInDart: 'double' | 'String',
  valueParserForDartInstance: (value: string | number) => string,
  modeSpecificInstanceName?: string
): string {
  const props = properties.map(p => `  final ${valueTypeInDart} ${sanitizeCamelCase(p.name)};`).join('\n');
  const constructorArgs = properties.map(p => `    required this.${sanitizeCamelCase(p.name)},`).join('\n');
  const copyWithArgs = properties.map(p => `${valueTypeInDart}? ${sanitizeCamelCase(p.name)},`).join('');
  const copyWithReturn = properties.map(p => `      ${sanitizeCamelCase(p.name)}: ${sanitizeCamelCase(p.name)} ?? this.${sanitizeCamelCase(p.name)},`).join('\n');
  const lerpLogic = properties.map(p => {
    const varName = sanitizeCamelCase(p.name);
    if (valueTypeInDart === 'double') {
      return `      ${varName}: lerpDouble(this.${varName}, other.${varName}, t)!,`;
    }
    return `      ${varName}: t < 0.5 ? this.${varName} : other.${varName},`;
  }).join('\n');

  const instanceName = modeSpecificInstanceName || `_${className.toLowerCase().replace(/\s+/g, '')}`;
  const instanceArgs = properties.map(p => `      ${sanitizeCamelCase(p.name)}: ${valueParserForDartInstance(p.value)},`).join('\n');

  return `
@immutable
class ${className} extends ThemeExtension<${className}> {
  const ${className}({
${constructorArgs}
  });

${props}

  @override
  ${className} copyWith({
    ${copyWithArgs}
  }) {
    return ${className}(
${copyWithReturn}
    );
  }

  @override
  ${className} lerp(ThemeExtension<${className}>? other, double t) {
    if (other is! ${className}) {
      return this;
    }
    return ${className}(
${lerpLogic}
    );
  }
}

final ${instanceName} = ${className}(
${instanceArgs}
);
`;
}

function generateColorSchemeEntries(colors: MaterialColors, mode: 'light' | 'dark'): string {
  const C = (role: keyof MaterialColors) => (colors[role] as ColorModeValues)[mode];
  return `
    brightness: Brightness.${mode},
    primary: ${toFlutterColor(C('primary'))},
    onPrimary: ${toFlutterColor(colors.onPrimaryContainer![mode])},
    primaryContainer: ${toFlutterColor(C('primaryContainer'))},
    onPrimaryContainer: ${toFlutterColor(C('onPrimaryContainer'))},
    secondary: ${toFlutterColor(C('secondary'))},
    onSecondary: ${toFlutterColor(colors.onSecondaryContainer![mode])},
    secondaryContainer: ${toFlutterColor(C('secondaryContainer'))},
    onSecondaryContainer: ${toFlutterColor(C('onSecondaryContainer'))},
    tertiary: ${toFlutterColor(C('tertiary'))},
    onTertiary: ${toFlutterColor(colors.onTertiaryContainer![mode])},
    tertiaryContainer: ${toFlutterColor(C('tertiaryContainer'))},
    onTertiaryContainer: ${toFlutterColor(C('onTertiaryContainer'))},
    error: ${toFlutterColor(C('error'))},
    onError: ${toFlutterColor(colors.onErrorContainer![mode])},
    errorContainer: ${toFlutterColor(C('errorContainer'))},
    onErrorContainer: ${toFlutterColor(C('onErrorContainer'))},
    surface: ${toFlutterColor(C('surface'))},
    onSurface: ${toFlutterColor(C('onSurface'))},
    surfaceVariant: ${toFlutterColor(C('surfaceVariant'))},
    onSurfaceVariant: ${toFlutterColor(C('onSurfaceVariant'))},
    outline: ${toFlutterColor(C('outline'))},
    outlineVariant: ${toFlutterColor(C('outlineVariant'))},
    shadow: ${toFlutterColor(colors.shadow[mode])},
    scrim: ${toFlutterColor(colors.scrim[mode])},
    inverseSurface: ${toFlutterColor(C('inverseSurface'))},
    onInverseSurface: ${toFlutterColor(C('onInverseSurface'))},
    inversePrimary: ${toFlutterColor(C('inversePrimary'))},
    surfaceTint: ${toFlutterColor(C('primary'))},
  `;
}


export function generateFlutterCode(theme: ThemeConfiguration): string {
  const { colors, fonts, properties, customColors } = theme;

  const numericValueParser = (v: string | number) => typeof v === 'number' ? v.toFixed(1) : parseFloat(v.toString()).toFixed(1);
  const stringValueParser = (v: string | number) => `'${v.toString().replace(/'/g, "\\'")}'`;

  const spacingClass = generatePropertyExtensionClass('AppSpacing', properties.spacing, 'double', numericValueParser, '_appspacing');
  const borderRadiusClass = generatePropertyExtensionClass('AppBorderRadius', properties.borderRadius, 'double', numericValueParser, '_appborderradius');
  const borderWidthClass = generatePropertyExtensionClass('AppBorderWidth', properties.borderWidth, 'double', numericValueParser, '_appborderwidth');
  const opacityClass = generatePropertyExtensionClass('AppOpacity', properties.opacity, 'double', numericValueParser, '_appopacity');
  const elevationClass = generatePropertyExtensionClass('AppElevation', properties.elevation, 'String', stringValueParser, '_appelevation');

  const gradientDataInstances = properties.gradients.map(g => {
    const resolvedGradientColors = g.colors.map(toFlutterColor).join(', ');
    return `    AppGradientData(
      name: '${g.name.replace(/'/g, "\\'")}',
      type: '${g.type}',
      direction: ${g.direction ? `'${g.direction.replace(/'/g, "\\'")}'` : 'null'},
      shape: ${g.shape ? `'${g.shape.replace(/'/g, "\\'")}'` : 'null'},
      extent: ${g.extent ? `'${g.extent.replace(/'/g, "\\'")}'` : 'null'},
      colors: [${resolvedGradientColors}],
    )`;
  }).join(',\n');

  const _appgradientsInstance = `
final _appgradients = AppGradients(
  gradients: [
${gradientDataInstances}
  ],
);`;

  const generateTextThemeEntries = (mode: 'light' | 'dark'): string => {
    const onSurfaceColor = colors.onSurface[mode];
    return (Object.keys(fonts.materialTextStyles) as MaterialTextStyleKey[]).map(key => {
      const style = fonts.materialTextStyles[key];
      return `      ${key}: ${generateTextStyleDart(style, mode, onSurfaceColor)},`;
    }).join('\n');
  };

  const lightMaterialTextThemeEntries = generateTextThemeEntries('light');
  const darkMaterialTextThemeEntries = generateTextThemeEntries('dark');

  let customTextStylesExtension = '';
  if (fonts.customTextStyles.length > 0) {
    const generateCustomStyleInstanceArgs = (mode: 'light' | 'dark'): string => {
      const onSurfaceColor = colors.onSurface[mode];
      return fonts.customTextStyles.map(cs => `      ${sanitizeCamelCase(cs.name)}: ${generateTextStyleDart(cs.style, mode, onSurfaceColor)},`).join('\n');
    };

    const customStyleProps = fonts.customTextStyles.map(cs => `  final TextStyle ${sanitizeCamelCase(cs.name)};`).join('\n');
    const customStyleConstructorArgs = fonts.customTextStyles.map(cs => `    required this.${sanitizeCamelCase(cs.name)},`).join('\n');
    const customStyleCopyWithArgs = fonts.customTextStyles.map(cs => `TextStyle? ${sanitizeCamelCase(cs.name)},`).join('');
    const customStyleCopyWithReturn = fonts.customTextStyles.map(cs => `      ${sanitizeCamelCase(cs.name)}: ${sanitizeCamelCase(cs.name)} ?? this.${sanitizeCamelCase(cs.name)},`).join('\n');
    const customStyleLerpLogic = fonts.customTextStyles.map(cs => `      ${sanitizeCamelCase(cs.name)}: TextStyle.lerp(this.${sanitizeCamelCase(cs.name)}, other.${sanitizeCamelCase(cs.name)}, t)!,`).join('\n');

    customTextStylesExtension = `
@immutable
class AppTextStyles extends ThemeExtension<AppTextStyles> {
  const AppTextStyles({
${customStyleConstructorArgs}
  });

${customStyleProps}

  @override
  AppTextStyles copyWith({ ${customStyleCopyWithArgs} }) {
    return AppTextStyles(
${customStyleCopyWithReturn}
    );
  }

  @override
  AppTextStyles lerp(ThemeExtension<AppTextStyles>? other, double t) {
    if (other is! AppTextStyles) return this;
    return AppTextStyles(
${customStyleLerpLogic}
    );
  }
}

final _apptextstylesLight = AppTextStyles(
${generateCustomStyleInstanceArgs('light')}
);
final _apptextstylesDark = AppTextStyles(
${generateCustomStyleInstanceArgs('dark')}
);`;
  }

  let appCustomColorsExtension = '';
  if (customColors.length > 0) {
    const customColorProps = customColors.map(cc => `  final Color ${sanitizeCamelCase(cc.name)};`).join('\n');
    const customColorConstructorArgs = customColors.map(cc => `    required this.${sanitizeCamelCase(cc.name)},`).join('\n');
    const customColorCopyWithArgs = customColors.map(cc => `Color? ${sanitizeCamelCase(cc.name)},`).join('');
    const customColorCopyWithReturn = customColors.map(cc => `      ${sanitizeCamelCase(cc.name)}: ${sanitizeCamelCase(cc.name)} ?? this.${sanitizeCamelCase(cc.name)},`).join('\n');
    const customColorLerpLogic = customColors.map(cc => `      ${sanitizeCamelCase(cc.name)}: Color.lerp(this.${sanitizeCamelCase(cc.name)}, other.${sanitizeCamelCase(cc.name)}, t)!,`).join('\n');

    const generateCustomColorInstanceArgs = (mode: 'light' | 'dark'): string => {
        return customColors.map(cc => `      ${sanitizeCamelCase(cc.name)}: ${toFlutterColor(cc.value[mode])},`).join('\n');
    };

    appCustomColorsExtension = `
@immutable
class AppCustomColors extends ThemeExtension<AppCustomColors> {
  const AppCustomColors({
${customColorConstructorArgs}
  });

${customColorProps}

  @override
  AppCustomColors copyWith({ ${customColorCopyWithArgs} }) {
    return AppCustomColors(
${customColorCopyWithReturn}
    );
  }

  @override
  AppCustomColors lerp(ThemeExtension<AppCustomColors>? other, double t) {
    if (other is! AppCustomColors) return this;
    return AppCustomColors(
${customColorLerpLogic}
    );
  }
}

final _appcustomcolorsLight = AppCustomColors(
${generateCustomColorInstanceArgs('light')}
);
final _appcustomcolorsDark = AppCustomColors(
${generateCustomColorInstanceArgs('dark')}
);`;
  }


  const generateExtensionsList = (mode: 'light' | 'dark'): string => {
    const extensions = [
      '_appspacing', '_appborderradius', '_appborderwidth',
      '_appopacity', '_appelevation', '_appgradients',
    ];
    if (fonts.customTextStyles.length > 0) {
      extensions.push(mode === 'light' ? '_apptextstylesLight' : '_apptextstylesDark');
    }
    if (customColors.length > 0) {
      extensions.push(mode === 'light' ? '_appcustomcolorsLight' : '_appcustomcolorsDark');
    }
    return extensions.map(ext => `        ${ext},`).join('\n');
  }

  const lightExtensionsString = generateExtensionsList('light');
  const darkExtensionsString = generateExtensionsList('dark');

  const lightColorScheme = generateColorSchemeEntries(colors, 'light');
  const darkColorScheme = generateColorSchemeEntries(colors, 'dark');

  return `// lib/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'dart:ui' show lerpDouble;
import 'dart:math' show pi;

// Generated by Material Palette Forge

double parseUnitValue(String value) {
  if (value.isEmpty) return 0.0;
  final cleanValue = value.replaceAll(RegExp(r'(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax|deg)'), '').trim();
  final parsed = double.tryParse(cleanValue);
  return parsed ?? 0.0;
}

// --- Custom Theme Extensions ---
${spacingClass}
${borderRadiusClass}
${borderWidthClass}
${opacityClass}
${elevationClass}
${customTextStylesExtension}
${appCustomColorsExtension}

@immutable
class AppGradientData {
  const AppGradientData({
    required this.name, required this.type, this.direction, this.shape, this.extent, required this.colors,
  });
  final String name;
  final String type;
  final String? direction;
  final String? shape;
  final String? extent;
  final List<Color> colors;

  Gradient? toGradient() {
    if (type == 'linear') {
      Alignment begin = Alignment.centerLeft; Alignment end = Alignment.centerRight; double? angle;
      if (direction != null) {
        if (direction!.contains('deg')) angle = (parseUnitValue(direction!) * pi / 180);
        else {
          if (direction == 'to right') { begin = Alignment.centerLeft; end = Alignment.centerRight; }
          else if (direction == 'to left') { begin = Alignment.centerRight; end = Alignment.centerLeft; }
          else if (direction == 'to top') { begin = Alignment.bottomCenter; end = Alignment.topCenter; }
          else if (direction == 'to bottom') { begin = Alignment.topCenter; end = Alignment.bottomCenter; }
          else if (direction == 'to top left') { begin = Alignment.bottomRight; end = Alignment.topLeft; }
          else if (direction == 'to top right') { begin = Alignment.bottomLeft; end = Alignment.topRight; }
          else if (direction == 'to bottom left') { begin = Alignment.topRight; end = Alignment.bottomLeft; }
          else if (direction == 'to bottom right') { begin = Alignment.topLeft; end = Alignment.bottomRight; }
        }
      }
      return angle != null ? LinearGradient(colors: colors, transform: GradientRotation(angle)) : LinearGradient(colors: colors, begin: begin, end: end);
    } else if (type == 'radial') {
      return RadialGradient(colors: colors, center: Alignment.center, radius: 0.5);
    }
    return null;
  }
}

@immutable
class AppGradients extends ThemeExtension<AppGradients> {
  const AppGradients({ required this.gradients });
  final List<AppGradientData> gradients;
  AppGradientData? getGradientByName(String name) { try { return gradients.firstWhere((g) => g.name == name); } catch (e) { return null; } }
  @override AppGradients copyWith({ List<AppGradientData>? gradients }) => AppGradients(gradients: gradients ?? this.gradients);
  @override AppGradients lerp(ThemeExtension<AppGradients>? other, double t) => (other is! AppGradients || t < 0.5) ? this : other;
}
${_appgradientsInstance}

// --- Main AppTheme Class ---
class AppTheme {
  static ThemeData _buildTheme(ColorScheme colorScheme, TextTheme baseTextTheme, List<ThemeExtension<dynamic>> extensions) {
    final textTheme = baseTextTheme.apply(
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );
    final defaultCardBorderRadius = _appborderradius.md;

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      extensions: extensions,
      cardTheme: CardTheme(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(defaultCardBorderRadius)),
        color: colorScheme.surfaceContainerHighest,
        surfaceTintColor: colorScheme.surfaceTint,
        elevation: _appelevation.level1.isNotEmpty ? parseUnitValue(_appelevation.level1.split('px')[0]) : 1.0,
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_appborderradius.full)),
        padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.sm),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_appborderradius.full)),
            padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.md),
            backgroundColor: colorScheme.primary, foregroundColor: colorScheme.onPrimary)
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
         style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(_appborderradius.full)),
            padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.md),
            side: BorderSide(color: colorScheme.outline, width: _appborderwidth.thin))
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(_appborderradius.sm), borderSide: BorderSide(color: colorScheme.outline)),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(_appborderradius.sm), borderSide: BorderSide(color: colorScheme.outline)),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(_appborderradius.sm), borderSide: BorderSide(color: colorScheme.primary, width: _appborderwidth.medium)),
        filled: true, fillColor: colorScheme.surfaceContainerHighest,
      ),
    );
  }

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme(
${lightColorScheme.trimEnd()}
    );
    final baseTextTheme = TextTheme(
${lightMaterialTextThemeEntries}
    );
    final extensions = <ThemeExtension<dynamic>>[
${lightExtensionsString.trimEnd()}
    ];
    return _buildTheme(colorScheme, baseTextTheme, extensions);
  }

  static ThemeData get darkTheme {
    final colorScheme = ColorScheme(
${darkColorScheme.trimEnd()}
    );
    final baseTextTheme = TextTheme(
${darkMaterialTextThemeEntries}
    );
    final extensions = <ThemeExtension<dynamic>>[
${darkExtensionsString.trimEnd()}
    ];
    return _buildTheme(colorScheme, baseTextTheme, extensions);
  }
}
`
}

export function generateJson(theme: ThemeConfiguration): string {
  const themeCopy = JSON.parse(JSON.stringify(theme)); // Deep copy to avoid modifying original
  // The customColors array is already at the root of themeCopy.
  return JSON.stringify(themeCopy, null, 2);
}


interface ParsedShadow {
  offsetX: string;
  offsetY: string;
  blur: string;
  spread: string;
  color: string;
  inset: boolean;
}

function parseBoxShadowString(shadowString: string): ParsedShadow | null {
  if (!shadowString || shadowString.toLowerCase() === 'none') return null;
  let input = shadowString.trim();
  let inset = false;
  if (input.startsWith('inset')) {
    inset = true;
    input = input.substring(5).trim();
  }
  const colorMatch = input.match(/(#[0-9a-fA-F]{3,8}|rgba?\([\d.,\s%/]+\)|hsla?\([\d.,\s%/]+\)|\b[a-zA-Z]+\b)$/i);
  let color = 'rgba(0,0,0,0.1)';
  let partsWithoutColor = input;
  if (colorMatch) {
    color = colorMatch[0];
    partsWithoutColor = input.substring(0, input.lastIndexOf(color)).trim();
  }
  const lengthParts = partsWithoutColor.split(/\s+/).filter(Boolean);
  let offsetX = '0px', offsetY = '0px', blur = '0px', spread = '0px';
  if (lengthParts.length >= 2) { offsetX = lengthParts[0]; offsetY = lengthParts[1]; }
  if (lengthParts.length >= 3) { blur = lengthParts[2]; }
  if (lengthParts.length >= 4) { spread = lengthParts[3]; }
  const isLength = (s: string) => s && /^-?\d*(\.\d+)?(px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)?$/i.test(s);
  if (!isLength(offsetX) || !isLength(offsetY)) return { offsetX: '0px', offsetY: '1px', blur: '3px', spread: '0px', color: 'rgba(0,0,0,0.1)', inset };
  if (blur && !isLength(blur)) blur = '0px';
  if (spread && !isLength(spread)) spread = '0px';
  return { offsetX, offsetY, blur, spread, color, inset };
}


function mapFontWeightToFigmaString(weight: FontWeightValue): string {
    if (typeof weight === 'string') {
        if (weight === 'normal') return 'Regular';
        if (weight === 'bold') return 'Bold';
        const numWeight = parseInt(weight, 10);
        if (!isNaN(numWeight)) weight = numWeight as any;
        else return 'Regular';
    }
    switch(weight) {
        case 100: return 'Thin';
        case 200: return 'ExtraLight';
        case 300: return 'Light';
        case 400: return 'Regular';
        case 500: return 'Medium';
        case 600: return 'SemiBold';
        case 700: return 'Bold';
        case 800: return 'ExtraBold';
        case 900: return 'Black';
        default: return 'Regular';
    }
}

function generateTokensForMode(theme: ThemeConfiguration, mode: 'light' | 'dark'): any {
  const { colors, fonts, properties, customColors } = theme;
  const tokens: any = {
    colors: { "$type": "color" },
    dimensions: { "$type": "dimension" },
    text: {
      fonts: { "$type": "fontFamily" },
      weights: { "$type": "fontWeight" },
      lineHeights: { "$type": "number" }, // Using "number" as per example for lineHeights
      typography: { "$type": "typography" },
    },
    borders: { "$type": "border", styles: { "$type": "strokeStyle", solid: { "$value": "solid" } } },
    shadows: { "$type": "shadow" },
    opacity: { "$type": "opacity" }, // Changed from "number" to "opacity" for semantic correctness
  };

  // --- Material Colors ---
  for (const key in colors) {
    if (key === 'seedColor') continue;
    const roleKey = key as keyof MaterialColors;
    const colorSpec = colors[roleKey] as ColorModeValues | undefined;
    if (colorSpec && typeof colorSpec === 'object' && colorSpec[mode]) {
      tokens.colors[sanitizeCamelCase(roleKey)] = { "$value": colorSpec[mode] };
    }
  }
  tokens.colors.black = { "$value": "#000000" };
  tokens.colors.white = { "$value": "#FFFFFF" };

  // --- Custom Colors ---
  customColors.forEach(cc => {
    tokens.colors[sanitizeCamelCase(cc.name)] = { "$value": cc.value[mode] };
  });


  // --- Dimensions ---
  properties.spacing.forEach(item => {
    tokens.dimensions[sanitizeCamelCase(item.name)] = { "$value": `${item.value}px` };
  });
  properties.borderRadius.forEach(item => {
    tokens.dimensions[sanitizeCamelCase(item.name)] = { "$value": `${item.value}px` };
  });
  properties.borderWidth.forEach(item => {
    tokens.dimensions[sanitizeCamelCase(item.name)] = { "$value": `${item.value}px` };
  });
  if (properties.borderRadius.find(item => item.name === 'full')) {
      tokens.dimensions.max = { "$value": "9999px" };
  }


  // --- Text ---
  const uniqueFontFamilies: Record<string, string> = {};
  const uniqueFontWeights: Record<string, FontWeightValue> = {};
  const uniqueLineHeights: Record<string, number> = {};

  const processTextStyle = (style: TextStyleProperties) => {
    const webFont = COMMON_WEB_FONTS.find(f => f.value === style.fontFamily);
    const fontFamilyKey = sanitizeCamelCase(webFont?.label || style.fontFamily);
    if (!uniqueFontFamilies[fontFamilyKey]) {
      uniqueFontFamilies[fontFamilyKey] = webFont?.stack || style.fontFamily;
    }
    const fontWeightKey = mapFontWeightToFigmaString(style.fontWeight).toLowerCase().replace(/\s+/g, '');
    if (!uniqueFontWeights[fontWeightKey]) {
      uniqueFontWeights[fontWeightKey] = style.fontWeight;
    }
    if (style.lineHeight !== undefined) {
        const lineHeightKey = `lh${style.lineHeight.toString().replace('.', '_')}`;
        if (!uniqueLineHeights[lineHeightKey]) {
            uniqueLineHeights[lineHeightKey] = style.lineHeight;
        }
    }
  };

  (Object.values(fonts.materialTextStyles) as TextStyleProperties[]).forEach(processTextStyle);
  fonts.customTextStyles.forEach(custom => processTextStyle(custom.style));

  for (const key in uniqueFontFamilies) {
    tokens.text.fonts[key] = { "$value": uniqueFontFamilies[key] };
  }
  for (const key in uniqueFontWeights) {
    tokens.text.weights[key] = { "$value": mapFontWeightToFigmaString(uniqueFontWeights[key]) };
  }
  for (const key in uniqueLineHeights) {
    tokens.text.lineHeights[key] = { "$value": uniqueLineHeights[key] };
  }

  const addTypographyStyle = (name: string, style: TextStyleProperties) => {
    const webFont = COMMON_WEB_FONTS.find(f => f.value === style.fontFamily);
    const fontFamilyKey = sanitizeCamelCase(webFont?.label || style.fontFamily);
    const fontWeightKey = mapFontWeightToFigmaString(style.fontWeight).toLowerCase().replace(/\s+/g, '');
    const typographyValue: any = {
        "fontFamily": `{text.fonts.${fontFamilyKey}}`,
        "fontWeight": `{text.weights.${fontWeightKey}}`,
        "fontSize": `${style.fontSize}px` // Direct value as per example
    };
    if (style.lineHeight !== undefined) {
        const lineHeightKey = `lh${style.lineHeight.toString().replace('.', '_')}`;
        typographyValue.lineHeight = `{text.lineHeights.${lineHeightKey}}`;
    }
    tokens.text.typography[sanitizeCamelCase(name)] = { "$value": typographyValue };

    if (style.color && style.color[mode]) {
        const colorTokenName = `text${sanitizeCamelCase(name).charAt(0).toUpperCase() + sanitizeCamelCase(name).slice(1)}`;
        tokens.colors[colorTokenName] = { "$value": style.color[mode] };
    } else {
        // Fallback to onSurface if per-style color is not defined
        const onSurfaceToken = tokens.colors[sanitizeCamelCase('onSurface')];
        if (onSurfaceToken) {
            const colorTokenName = `text${sanitizeCamelCase(name).charAt(0).toUpperCase() + sanitizeCamelCase(name).slice(1)}`;
            tokens.colors[colorTokenName] = { "$value": onSurfaceToken.$value };
        }
    }
  };

  for (const key in fonts.materialTextStyles) {
    addTypographyStyle(key, fonts.materialTextStyles[key as MaterialTextStyleKey]);
  }
  fonts.customTextStyles.forEach(custom => addTypographyStyle(custom.name, custom.style));


  // --- Borders ---
  const outlineColorRole = sanitizeCamelCase('outline');
  const defaultBorderWidth = properties.borderWidth.find(bw => bw.name === 'thin') || properties.borderWidth[0] || {name: 'default', value: 1};
  const defaultBorderWidthKey = sanitizeCamelCase(defaultBorderWidth.name);
  if (tokens.colors[outlineColorRole] && tokens.dimensions[defaultBorderWidthKey]) {
      tokens.borders.default = {
          "$value": {
              "color": `{colors.${outlineColorRole}}`,
              "width": `{dimensions.${defaultBorderWidthKey}}`,
              "style": "{borders.styles.solid}"
          }
      };
  }

  // --- Shadows (from Elevation) ---
  properties.elevation.forEach(item => {
    const parsed = parseBoxShadowString(item.value);
    if (parsed) {
      tokens.shadows[sanitizeCamelCase(item.name)] = {
        "$value": {
          "color": parsed.color,
          "offsetX": parsed.offsetX,
          "offsetY": parsed.offsetY,
          "blur": parsed.blur,
          "spread": parsed.spread,
        },
      };
    }
  });

  // --- Opacity ---
  properties.opacity.forEach(item => {
    tokens.opacity[sanitizeCamelCase(item.name)] = { "$value": item.value.toString() }; // Figma expects string for opacity unless plugin maps it
  });

  return tokens;
}

export function generateFigmaTokens(theme: ThemeConfiguration): string {
  const figmaOutput = {
    global: { // A common top-level group for sets
        base: generateTokensForMode(theme, 'light'), // Consider "base" as light for this structure
    },
    light: generateTokensForMode(theme, 'light'), // Explicit light theme set
    dark: generateTokensForMode(theme, 'dark'),   // Explicit dark theme set
  };

  // To match the example structure more closely where some tokens are global and some are per-theme,
  // we can create a "global" set for things that don't change by mode, and "theme-specific" sets.
  // For this app, most things ARE mode-specific.
  // The provided example uses a flat structure. Let's provide both light/dark as separate complete sets.

  // Let's refine to have semantic token sets and a global set if needed by plugins.
  // However, the example format is more like a single theme.
  // So, to simplify and match the user's provided example structure (which doesn't show theme sets),
  // AND still support our app's light/dark modes, we output them as separate top-level keys.

  const output = {
    light: generateTokensForMode(theme, 'light'),
    dark: generateTokensForMode(theme, 'dark'),
  };

  // If the user's example implies a *single* token set, we'd pick one mode,
  // but Material Palette Forge is fundamentally dual-mode.
  // So, outputting both `light` and `dark` sets is the most accurate representation of the app's data.

  return JSON.stringify(output, null, 2);
}
