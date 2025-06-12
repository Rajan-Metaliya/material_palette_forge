

import type { ThemeConfiguration, MaterialColors, ThemeGradient, CustomStringPropertyItem, CustomNumericPropertyItem, TextStyleProperties, MaterialTextStyleKey, FontWeightValue, ColorModeValues } from '@/types/theme';

function toFlutterColor(hex: string): string {
  if (!hex || hex.length < 4) return `Color(0xFF000000)`; // Default to black if invalid
  return `Color(0xFF${hex.substring(1).toUpperCase()})`;
}

function sanitizeDartVariableName(name: string): string {
  if (!name) return 'unnamedProperty';
  let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_');
  if (sanitized.match(/^[^a-zA-Z_]/) || sanitized.match(/^[0-9]/)) {
    sanitized = 'style_' + sanitized;
  }
  sanitized = sanitized.replace(/_([a-zA-Z])/g, (match, p1) => p1.toUpperCase());
  if (sanitized.length > 0 && sanitized[0] === sanitized[0].toUpperCase()) {
    sanitized = sanitized[0].toLowerCase() + sanitized.substring(1);
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

function generateTextStyleDart(style: TextStyleProperties, mode: 'light' | 'dark'): string {
  const parts = [
    `fontFamily: '${style.fontFamily}'`,
    `fontSize: ${style.fontSize.toFixed(1)}`,
    `fontWeight: ${mapFontWeightToFlutter(style.fontWeight)}`,
    `letterSpacing: ${style.letterSpacing.toFixed(2)}`,
  ];
  if (style.lineHeight !== undefined) {
    parts.push(`height: ${style.lineHeight.toFixed(2)}`);
  }
  if (style.color && style.color[mode]) {
    parts.push(`color: ${toFlutterColor(style.color[mode])}`);
  }
  return `const TextStyle(\n      ${parts.join(',\n      ')},\n    )`;
}

function generatePropertyExtensionClass(
  className: string,
  properties: Array<CustomNumericPropertyItem | CustomStringPropertyItem>,
  valueTypeInDart: 'double' | 'String',
  valueParserForDartInstance: (value: string | number) => string
): string {
  const props = properties.map(p => `  final ${valueTypeInDart} ${sanitizeDartVariableName(p.name)};`).join('\n');
  const constructorArgs = properties.map(p => `    required this.${sanitizeDartVariableName(p.name)},`).join('\n');
  const copyWithArgs = properties.map(p => `${valueTypeInDart}? ${sanitizeDartVariableName(p.name)},`).join('');
  const copyWithReturn = properties.map(p => `      ${sanitizeDartVariableName(p.name)}: ${sanitizeDartVariableName(p.name)} ?? this.${sanitizeDartVariableName(p.name)},`).join('\n');
  const lerpLogic = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    if (valueTypeInDart === 'double') {
      return `      ${varName}: lerpDouble(this.${varName}, other.${varName}, t)!,`;
    }
    return `      ${varName}: t < 0.5 ? this.${varName} : other.${varName},`;
  }).join('\n');
  const instanceArgs = properties.map(p => `      ${sanitizeDartVariableName(p.name)}: ${valueParserForDartInstance(p.value)},`).join('\n');

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

const _${className.toLowerCase().replace(/\s+/g, '')} = ${className}(
${instanceArgs}
);
`;
}

function generateColorSchemeEntries(colors: MaterialColors, mode: 'light' | 'dark'): string {
  const C = (role: keyof MaterialColors) => (colors[role] as ColorModeValues)[mode];
  return `
    brightness: Brightness.${mode},
    primary: ${toFlutterColor(C('primary'))},
    onPrimary: ${toFlutterColor(C('onPrimaryContainer'))}, 
    primaryContainer: ${toFlutterColor(C('primaryContainer'))},
    onPrimaryContainer: ${toFlutterColor(C('onPrimaryContainer'))},
    secondary: ${toFlutterColor(C('secondary'))},
    onSecondary: ${toFlutterColor(C('onSecondaryContainer'))},
    secondaryContainer: ${toFlutterColor(C('secondaryContainer'))},
    onSecondaryContainer: ${toFlutterColor(C('onSecondaryContainer'))},
    tertiary: ${toFlutterColor(C('tertiary'))},
    onTertiary: ${toFlutterColor(C('onTertiaryContainer'))},
    tertiaryContainer: ${toFlutterColor(C('tertiaryContainer'))},
    onTertiaryContainer: ${toFlutterColor(C('onTertiaryContainer'))},
    error: ${toFlutterColor(C('error'))},
    onError: ${toFlutterColor(C('onErrorContainer'))},
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
  const { colors, fonts, properties } = theme;

  const numericValueParser = (v: string | number) => typeof v === 'number' ? v.toFixed(1) : parseFloat(v.toString()).toFixed(1);
  const stringValueParser = (v: string | number) => `'${v.toString().replace(/'/g, "\\'")}'`;

  const spacingClass = generatePropertyExtensionClass('AppSpacing', properties.spacing, 'double', numericValueParser);
  const borderRadiusClass = generatePropertyExtensionClass('AppBorderRadius', properties.borderRadius, 'double', numericValueParser);
  const borderWidthClass = generatePropertyExtensionClass('AppBorderWidth', properties.borderWidth, 'double', numericValueParser);
  const opacityClass = generatePropertyExtensionClass('AppOpacity', properties.opacity, 'double', numericValueParser);
  const elevationClass = generatePropertyExtensionClass('AppElevation', properties.elevation, 'String', stringValueParser);

  const gradientDataInstances = properties.gradients.map(g => {
    const resolvedGradientColors = g.colors.map(hexColorRefOrActual => {
        return toFlutterColor(hexColorRefOrActual);
    }).join(', ');

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
    return (Object.keys(fonts.materialTextStyles) as MaterialTextStyleKey[]).map(key => {
      const style = fonts.materialTextStyles[key];
      return `      ${key}: ${generateTextStyleDart(style, mode)},`;
    }).join('\n');
  };

  const lightMaterialTextThemeEntries = generateTextThemeEntries('light');
  const darkMaterialTextThemeEntries = generateTextThemeEntries('dark');

  let customTextStylesExtension = '';
  if (fonts.customTextStyles.length > 0) {
    const generateCustomStyleInstanceArgs = (mode: 'light' | 'dark'): string => {
      return fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: ${generateTextStyleDart(cs.style, mode)},`).join('\n');
    };

    const customStyleProps = fonts.customTextStyles.map(cs => `  final TextStyle ${sanitizeDartVariableName(cs.name)};`).join('\n');
    const customStyleConstructorArgs = fonts.customTextStyles.map(cs => `    required this.${sanitizeDartVariableName(cs.name)},`).join('\n');
    const customStyleCopyWithArgs = fonts.customTextStyles.map(cs => `TextStyle? ${sanitizeDartVariableName(cs.name)},`).join('');
    const customStyleCopyWithReturn = fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: ${sanitizeDartVariableName(cs.name)} ?? this.${sanitizeDartVariableName(cs.name)},`).join('\n');
    const customStyleLerpLogic = fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: TextStyle.lerp(this.${sanitizeDartVariableName(cs.name)}, other.${sanitizeDartVariableName(cs.name)}, t)!,`).join('\n');
    
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

// Instances for light and dark modes
const _apptextstylesLight = AppTextStyles(
${generateCustomStyleInstanceArgs('light')}
);
const _apptextstylesDark = AppTextStyles(
${generateCustomStyleInstanceArgs('dark')}
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
  final cleanValue = value.replaceAll(RegExp(r'(deg|px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)'), '').trim();
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
      // Basic radial gradient, Figma tokens might need more specific parsing for position/extent
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
  const themeCopy = JSON.parse(JSON.stringify(theme));
  return JSON.stringify(themeCopy, null, 2);
}

export function generateFigmaTokens(theme: ThemeConfiguration): string {
  const themeCopy = JSON.parse(JSON.stringify(theme));
  const figmaTokens: any = {
    global: { /* This can hold common tokens if any */ },
    light: { color: {}, typography: {}, spacing: {}, borderRadius: {}, borderWidth: {}, opacity: {}, boxShadow: {}, gradient: {} },
    dark: { color: {}, typography: {}, spacing: {}, borderRadius: {}, borderWidth: {}, opacity: {}, boxShadow: {}, gradient: {} },
  };

  (['light', 'dark'] as const).forEach(mode => {
    const modeColors = figmaTokens[mode].color;
    for (const key in themeCopy.colors) {
      if (key === 'seedColor') continue;
      const roleKey = key as keyof MaterialColors;
      const colorSpec = themeCopy.colors[roleKey] as ColorModeValues | undefined;
      if (colorSpec && typeof colorSpec === 'object' && colorSpec[mode]) {
        modeColors[sanitizeDartVariableName(roleKey)] = { value: colorSpec[mode], type: "color" };
      }
    }

    const modeTypography = figmaTokens[mode].typography;
    for (const key in themeCopy.fonts.materialTextStyles) {
      const styleKey = key as MaterialTextStyleKey;
      const styleProps = themeCopy.fonts.materialTextStyles[styleKey];
      const figmaTextStyle: any = {
        fontFamily: styleProps.fontFamily, 
        fontSize: `${styleProps.fontSize}px`, // Figma needs unit
        fontWeight: styleProps.fontWeight.toString(), 
        letterSpacing: styleProps.letterSpacing !== 0 ? `${styleProps.letterSpacing}px` : '0', // Figma needs unit or '0' for no spacing
        lineHeight: styleProps.lineHeight ? `${styleProps.lineHeight * 100}%` : 'normal',
      };
      if (styleProps.color && styleProps.color[mode]) {
        // Figma expects color directly within the typography object for some plugins,
        // or you can reference another color token. Here, we embed it.
         figmaTextStyle.fills = [{type: 'SOLID', color: styleProps.color[mode]}]; // Example for plugin like Tokens Studio
         // Or simply: figmaTextStyle.color = styleProps.color[mode];
      }
      modeTypography[sanitizeDartVariableName(styleKey)] = { value: figmaTextStyle, type: "typography" };
    }
    themeCopy.fonts.customTextStyles.forEach(customStyle => {
      const figmaTextStyle: any = {
        fontFamily: customStyle.style.fontFamily, 
        fontSize: `${customStyle.style.fontSize}px`,
        fontWeight: customStyle.style.fontWeight.toString(), 
        letterSpacing: customStyle.style.letterSpacing !== 0 ? `${customStyle.style.letterSpacing}px` : '0',
        lineHeight: customStyle.style.lineHeight ? `${customStyle.style.lineHeight * 100}%` : 'normal',
      };
       if (customStyle.style.color && customStyle.style.color[mode]) {
         figmaTextStyle.fills = [{type: 'SOLID', color: customStyle.style.color[mode]}];
         // Or: figmaTextStyle.color = customStyle.style.color[mode];
      }
      modeTypography[sanitizeDartVariableName(customStyle.name)] = { value: figmaTextStyle, type: "typography" };
    });
    
    // Properties are typically mode-agnostic in definition.
    // We define them once, e.g., under 'light' (or 'global' if preferred).
    if (mode === 'light') { 
        (themeCopy.properties.spacing as CustomNumericPropertyItem[]).forEach(item => {
            figmaTokens.light.spacing[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "spacing" };
        });
        (themeCopy.properties.borderRadius as CustomNumericPropertyItem[]).forEach(item => {
            figmaTokens.light.borderRadius[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderRadius" };
        });
        (themeCopy.properties.borderWidth as CustomNumericPropertyItem[]).forEach(item => {
            figmaTokens.light.borderWidth[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderWidth" };
        });
        (themeCopy.properties.opacity as CustomNumericPropertyItem[]).forEach(item => {
            figmaTokens.light.opacity[sanitizeDartVariableName(item.name)] = { value: item.value.toString(), type: "opacity" };
        });
        (themeCopy.properties.elevation as CustomStringPropertyItem[]).forEach(item => {
            // Figma boxShadow needs parsing if it's a multi-shadow string
            const shadows = item.value.split(',').map(s => s.trim()).filter(s => s && s !== 'none');
            const figmaShadows = shadows.map(shadowStr => {
                const parts = shadowStr.match(/([^\s]+)\s+([^\s]+)\s+([^\s]+)\s+(([^\s]+)\s+)?(rgba?\([^\)]+\)|#[0-9a-fA-F]+)/);
                if (parts) {
                    return {
                        x: parts[1], y: parts[2], blur: parts[3], spread: parts[5] || '0px', color: parts[6], type: 'dropShadow'
                    };
                }
                return { x: '0', y: '0', blur: '0', spread: '0', color: '#00000000', type: 'dropShadow'}; // Fallback for "none" or parse error
            });
            figmaTokens.light.boxShadow[sanitizeDartVariableName(item.name)] = { 
                value: figmaShadows.length === 1 ? figmaShadows[0] : figmaShadows, // Single shadow or array
                type: "boxShadow" 
            };
        });
        themeCopy.properties.gradients.forEach((gradient: ThemeGradient) => {
            const colorsString = gradient.colors.join(', '); 
            let figmaGradientValue = '';
            if (gradient.type === 'linear') figmaGradientValue = `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
            else if (gradient.type === 'radial') figmaGradientValue = `radial-gradient(${gradient.shape || 'circle'} at ${gradient.extent || 'center'}, ${colorsString})`;
            const tokenName = sanitizeDartVariableName(gradient.name) || `gradient_${Object.keys(figmaTokens.light.gradient).length + 1}`;
            figmaTokens.light.gradient[tokenName] = { value: figmaGradientValue, type: "other" }; // Figma might need specific gradient object structure
      });
    }
  });


  return JSON.stringify(figmaTokens, null, 2);
}
