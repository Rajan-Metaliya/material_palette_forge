
import type { ThemeConfiguration, MaterialColors, ThemeGradient, CustomStringPropertyItem, CustomNumericPropertyItem, TextStyleProperties, MaterialTextStyleKey, FontWeightValue, ColorModeValues } from '@/types/theme';

function toFlutterColor(hex: string): string {
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

function generateTextStyleDart(style: TextStyleProperties): string {
  const parts = [
    `fontFamily: '${style.fontFamily}'`,
    `fontSize: ${style.fontSize.toFixed(1)}`,
    `fontWeight: ${mapFontWeightToFlutter(style.fontWeight)}`,
    `letterSpacing: ${style.letterSpacing.toFixed(2)}`,
  ];
  if (style.lineHeight !== undefined) {
    parts.push(`height: ${style.lineHeight.toFixed(2)}`);
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

// Instance for ${className} using default values for now
// TODO: This instance should be generated based on the current theme state for light/dark
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
    onPrimary: ${toFlutterColor(C('onPrimaryContainer'))}, // M3 uses onPrimaryContainer generally for text on primary
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
    shadow: ${toFlutterColor(colors.shadow[mode])}, // shadow/scrim might be mode-specific in values
    scrim: ${toFlutterColor(colors.scrim[mode])},
    inverseSurface: ${toFlutterColor(C('inverseSurface'))},
    onInverseSurface: ${toFlutterColor(C('onInverseSurface'))},
    inversePrimary: ${toFlutterColor(C('inversePrimary'))},
    surfaceTint: ${toFlutterColor(C('primary'))}, // surfaceTint is usually primary
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
    // Gradient colors need to be resolved based on the *light* theme for the default instance.
    // In a real app, you might have different gradient definitions or resolve colors at runtime.
    const resolvedGradientColors = g.colors.map(hexColorRefOrActual => {
        // This is simplified: assumes gradient colors are direct hex values or map to a primary/secondary etc.
        // For a robust solution, gradient colors might need to be defined as roles too.
        // For now, let's assume they are hex literals.
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


  const materialTextThemeEntries = (Object.keys(fonts.materialTextStyles) as MaterialTextStyleKey[]).map(key => {
    const style = fonts.materialTextStyles[key];
    return `      ${key}: ${generateTextStyleDart(style)},`;
  }).join('\n');

  let customTextStylesExtension = '';
  if (fonts.customTextStyles.length > 0) {
    const customStyleProps = fonts.customTextStyles.map(cs => `  final TextStyle ${sanitizeDartVariableName(cs.name)};`).join('\n');
    const customStyleConstructorArgs = fonts.customTextStyles.map(cs => `    required this.${sanitizeDartVariableName(cs.name)},`).join('\n');
    const customStyleCopyWithArgs = fonts.customTextStyles.map(cs => `TextStyle? ${sanitizeDartVariableName(cs.name)},`).join('');
    const customStyleCopyWithReturn = fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: ${sanitizeDartVariableName(cs.name)} ?? this.${sanitizeDartVariableName(cs.name)},`).join('\n');
    const customStyleLerpLogic = fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: TextStyle.lerp(this.${sanitizeDartVariableName(cs.name)}, other.${sanitizeDartVariableName(cs.name)}, t)!,`).join('\n');
    const customStyleInstanceArgs = fonts.customTextStyles.map(cs => `      ${sanitizeDartVariableName(cs.name)}: ${generateTextStyleDart(cs.style)},`).join('\n');

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

const _apptextstyles = AppTextStyles(
${customStyleInstanceArgs}
);`;
  }

  const extensionsList = [
    '_appspacing', '_appborderradius', '_appborderwidth',
    '_appopacity', '_appelevation', '_appgradients',
  ];
  if (fonts.customTextStyles.length > 0) {
    extensionsList.push('_apptextstyles');
  }
  const themeExtensionsString = extensionsList.map(ext => `        ${ext},`).join('\n');
  
  const lightColorScheme = generateColorSchemeEntries(colors, 'light');
  const darkColorScheme = generateColorSchemeEntries(colors, 'dark');

  return `// lib/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'dart:ui' show lerpDouble;
import 'dart:math' show pi; // For gradient rotation

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
          // ... (add all other direction parsings)
        }
      }
      return angle != null ? LinearGradient(colors: colors, transform: GradientRotation(angle)) : LinearGradient(colors: colors, begin: begin, end: end);
    } else if (type == 'radial') {
      return RadialGradient(colors: colors, center: Alignment.center, radius: 0.5); // Simplified
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
  static ThemeData _buildTheme(ColorScheme colorScheme, TextTheme baseTextTheme) {
    final textTheme = baseTextTheme.apply(
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );
    final defaultCardBorderRadius = _appborderradius.md;

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      extensions: <ThemeExtension<dynamic>>[
${themeExtensionsString}
      ],
      cardTheme: CardTheme(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(defaultCardBorderRadius)),
        color: colorScheme.surfaceContainerHighest,
        surfaceTintColor: colorScheme.surfaceTint,
        elevation: parseUnitValue(_appelevation.level1.split('px')[0]), // Basic elevation parsing
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
      // Add other component themes as needed
    );
  }

  static ThemeData get lightTheme {
    final colorScheme = ColorScheme(
${lightColorScheme.trimEnd()}
    );
    final baseTextTheme = TextTheme(
${materialTextThemeEntries}
    );
    return _buildTheme(colorScheme, baseTextTheme);
  }

  static ThemeData get darkTheme {
    final colorScheme = ColorScheme(
${darkColorScheme.trimEnd()}
    );
    final baseTextTheme = TextTheme(
${materialTextThemeEntries}
    );
    return _buildTheme(colorScheme, baseTextTheme);
  }
}
`;
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

  // Populate light and dark themes
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
      modeTypography[sanitizeDartVariableName(styleKey)] = {
        value: {
          fontFamily: styleProps.fontFamily, fontSize: `${styleProps.fontSize}px`,
          fontWeight: styleProps.fontWeight.toString(), letterSpacing: `${styleProps.letterSpacing}px`,
          lineHeight: styleProps.lineHeight ? `${styleProps.lineHeight * 100}%` : 'normal',
        }, type: "typography"
      };
    }
    themeCopy.fonts.customTextStyles.forEach(customStyle => {
      modeTypography[sanitizeDartVariableName(customStyle.name)] = {
        value: {
          fontFamily: customStyle.style.fontFamily, fontSize: `${customStyle.style.fontSize}px`,
          fontWeight: customStyle.style.fontWeight.toString(), letterSpacing: `${customStyle.style.letterSpacing}px`,
          lineHeight: customStyle.style.lineHeight ? `${customStyle.style.lineHeight * 100}%` : 'normal',
        }, type: "typography"
      };
    });
    
    // Properties are typically mode-agnostic in definition but applied with mode-specific colors
    // So, we can define them once, perhaps under 'global' or duplicate if necessary.
    // For simplicity, let's put them under 'light' and they can be aliased if needed in Figma.
    if (mode === 'light') { // Define properties once, assuming they don't change structurally between modes
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
            figmaTokens.light.boxShadow[sanitizeDartVariableName(item.name)] = { value: item.value, type: "boxShadow" };
        });
        themeCopy.properties.gradients.forEach((gradient: ThemeGradient) => {
            const colorsString = gradient.colors.join(', '); // These colors are hex, resolve from theme if they were roles
            let figmaGradientValue = '';
            if (gradient.type === 'linear') figmaGradientValue = `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
            else if (gradient.type === 'radial') figmaGradientValue = `radial-gradient(${gradient.shape || 'circle'} at ${gradient.extent || 'center'}, ${colorsString})`;
            const tokenName = sanitizeDartVariableName(gradient.name) || `gradient_${Object.keys(figmaTokens.light.gradient).length + 1}`;
            figmaTokens.light.gradient[tokenName] = { value: figmaGradientValue, type: "other" };
      });
    }
  });


  return JSON.stringify(figmaTokens, null, 2);
}
