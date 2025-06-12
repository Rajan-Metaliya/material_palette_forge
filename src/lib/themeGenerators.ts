
import type { ThemeConfiguration, MaterialColors, ThemeGradient, CustomStringPropertyItem, CustomNumericPropertyItem, TextStyleProperties, MaterialTextStyleKey, FontWeightValue } from '@/types/theme';

function toFlutterColor(hex: string): string {
  return `Color(0xFF${hex.substring(1).toUpperCase()})`;
}

function sanitizeDartVariableName(name: string): string {
  if (!name) return 'unnamedProperty';
  let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_');
  if (sanitized.match(/^[^a-zA-Z_]/) || sanitized.match(/^[0-9]/)) { // Dart vars can't start with _ or number if not private
    sanitized = 'style_' + sanitized; // Prefix to ensure validity
  }
   // Convert to camelCase
  sanitized = sanitized.replace(/_([a-zA-Z])/g, (match, p1) => p1.toUpperCase());
  // Ensure first letter is lowercase if it became uppercase due to prefixing or was already
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
    // If it's a string but numeric, parse it
    const numericWeight = parseInt(weight, 10);
    if (!isNaN(numericWeight)) weight = numericWeight as any; // proceed to numeric check
    else return 'FontWeight.w400'; // fallback
  }
  if (typeof weight === 'number') {
    if (weight >= 100 && weight <= 900 && weight % 100 === 0) {
      return `FontWeight.w${weight}`;
    }
  }
  return 'FontWeight.w400'; // Default
}

function generateTextStyleDart(style: TextStyleProperties): string {
  const parts = [
    `fontFamily: '${style.fontFamily}'`,
    `fontSize: ${style.fontSize.toFixed(1)}`,
    `fontWeight: ${mapFontWeightToFlutter(style.fontWeight)}`,
    `letterSpacing: ${style.letterSpacing.toFixed(2)}`,
  ];
  if (style.lineHeight !== undefined) {
    parts.push(`height: ${style.lineHeight.toFixed(2)}`); // In Flutter, TextStyle.height is line height
  }
  // color can be added here if TextStyleProperties includes it
  return `TextStyle(\n      ${parts.join(',\n      ')},\n    )`;
}


function generatePropertyExtensionClass(
  className: string,
  properties: Array<CustomNumericPropertyItem | CustomStringPropertyItem>,
  valueTypeInDart: 'double' | 'String',
  valueParserForDartInstance: (value: string | number) => string
): string {

  const props = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    return `  final ${valueTypeInDart} ${varName};`
  }).join('\n');

  const constructorArgs = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    return `    required this.${varName},`
  }).join('\n');

  const copyWithArgs = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    return `${valueTypeInDart}? ${varName},`
  }).join('');

  const copyWithReturn = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    return `      ${varName}: ${varName} ?? this.${varName},`
  }).join('\n');

  const lerpLogic = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    if (valueTypeInDart === 'double') {
      return `      ${varName}: lerpDouble(this.${varName}, other.${varName}, t)!,`;
    }
    return `      ${varName}: t < 0.5 ? this.${varName} : other.${varName},`;
  }).join('\n');

  const instanceArgs = properties.map(p => {
    const varName = sanitizeDartVariableName(p.name);
    const parsedValue = valueParserForDartInstance(p.value);
    return `      ${varName}: ${parsedValue},`;
  }).join('\n');

  return `
// ${className} Extension
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

// Instance for ${className}
const _${className.toLowerCase().replace(/\s+/g, '')} = ${className}(
${instanceArgs}
);
`;
}


export function generateFlutterCode(theme: ThemeConfiguration): string {
  const colors = theme.colors;
  const fonts = theme.fonts;
  const properties = theme.properties;

  let colorSchemeEntries = `
    brightness: Brightness.light,
    primary: ${toFlutterColor(colors.primary)},
    onPrimary: ${toFlutterColor(colors.onPrimaryContainer)},
    primaryContainer: ${toFlutterColor(colors.primaryContainer)},
    onPrimaryContainer: ${toFlutterColor(colors.onPrimaryContainer)},
    secondary: ${toFlutterColor(colors.secondary)},
    onSecondary: ${toFlutterColor(colors.onSecondaryContainer)},
    secondaryContainer: ${toFlutterColor(colors.secondaryContainer)},
    onSecondaryContainer: ${toFlutterColor(colors.onSecondaryContainer)},
    tertiary: ${toFlutterColor(colors.tertiary)},
    onTertiary: ${toFlutterColor(colors.onTertiaryContainer)},
    tertiaryContainer: ${toFlutterColor(colors.tertiaryContainer)},
    onTertiaryContainer: ${toFlutterColor(colors.onTertiaryContainer)},
    error: ${toFlutterColor(colors.error)},
    onError: ${toFlutterColor(colors.onErrorContainer)},
    errorContainer: ${toFlutterColor(colors.errorContainer)},
    onErrorContainer: ${toFlutterColor(colors.onErrorContainer)},
    surface: ${toFlutterColor(colors.surface)},
    onSurface: ${toFlutterColor(colors.onSurface)},
    surfaceVariant: ${toFlutterColor(colors.surfaceVariant)},
    onSurfaceVariant: ${toFlutterColor(colors.onSurfaceVariant)},
    outline: ${toFlutterColor(colors.outline)},
    outlineVariant: ${toFlutterColor(colors.outlineVariant)},
    shadow: ${toFlutterColor(colors.shadow)},
    scrim: ${toFlutterColor(colors.scrim)},
    inverseSurface: ${toFlutterColor(colors.inverseSurface)},
    onInverseSurface: ${toFlutterColor(colors.onInverseSurface)},
    inversePrimary: ${toFlutterColor(colors.inversePrimary)},
    surfaceTint: ${toFlutterColor(colors.primary)},
  `;

  const numericValueParser = (v: string | number) => typeof v === 'number' ? v.toFixed(1) : parseFloat(v.toString()).toFixed(1);
  const stringValueParser = (v: string | number) => `'${v.toString().replace(/'/g, "\\'")}'`;

  const spacingClass = generatePropertyExtensionClass('AppSpacing', properties.spacing, 'double', numericValueParser);
  const borderRadiusClass = generatePropertyExtensionClass('AppBorderRadius', properties.borderRadius, 'double', numericValueParser);
  const borderWidthClass = generatePropertyExtensionClass('AppBorderWidth', properties.borderWidth, 'double', numericValueParser);
  const opacityClass = generatePropertyExtensionClass('AppOpacity', properties.opacity, 'double', numericValueParser);
  const elevationClass = generatePropertyExtensionClass('AppElevation', properties.elevation, 'String', stringValueParser);


  const gradientDataInstances = properties.gradients.map(g => {
    const colorsList = g.colors.map(c => toFlutterColor(c)).join(', ');
    return `    AppGradientData(
      name: '${g.name.replace(/'/g, "\\'")}',
      type: '${g.type}',
      direction: ${g.direction ? `'${g.direction.replace(/'/g, "\\'")}'` : 'null'},
      shape: ${g.shape ? `'${g.shape.replace(/'/g, "\\'")}'` : 'null'},
      extent: ${g.extent ? `'${g.extent.replace(/'/g, "\\'")}'` : 'null'},
      colors: [${colorsList}],
    )`;
  }).join(',\n');

  // Generate Material TextTheme entries
  const materialTextThemeEntries = (Object.keys(fonts.materialTextStyles) as MaterialTextStyleKey[]).map(key => {
    const style = fonts.materialTextStyles[key];
    return `      ${key}: ${generateTextStyleDart(style)},`;
  }).join('\n');

  // Generate AppTextStyles ThemeExtension for custom text styles
  let customTextStylesExtension = '';
  if (fonts.customTextStyles.length > 0) {
    const customStyleProps = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      return `  final TextStyle ${varName};`;
    }).join('\n');

    const customStyleConstructorArgs = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      return `    required this.${varName},`;
    }).join('\n');
    
    const customStyleCopyWithArgs = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      return `TextStyle? ${varName},`;
    }).join('');

    const customStyleCopyWithReturn = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      return `      ${varName}: ${varName} ?? this.${varName},`;
    }).join('\n');

    const customStyleLerpLogic = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      // TextStyle.lerp is nullable, so handle it.
      return `      ${varName}: TextStyle.lerp(this.${varName}, other.${varName}, t)!,`;
    }).join('\n');
    
    const customStyleInstanceArgs = fonts.customTextStyles.map(customStyle => {
      const varName = sanitizeDartVariableName(customStyle.name);
      return `      ${varName}: ${generateTextStyleDart(customStyle.style)},`;
    }).join('\n');

    customTextStylesExtension = `
// AppTextStyles Extension for Custom Styles
@immutable
class AppTextStyles extends ThemeExtension<AppTextStyles> {
  const AppTextStyles({
${customStyleConstructorArgs}
  });

${customStyleProps}

  @override
  AppTextStyles copyWith({
    ${customStyleCopyWithArgs}
  }) {
    return AppTextStyles(
${customStyleCopyWithReturn}
    );
  }

  @override
  AppTextStyles lerp(ThemeExtension<AppTextStyles>? other, double t) {
    if (other is! AppTextStyles) {
      return this;
    }
    return AppTextStyles(
${customStyleLerpLogic}
    );
  }
}

// Instance for AppTextStyles
const _apptextstyles = AppTextStyles(
${customStyleInstanceArgs}
);
`;
  }


  const extensionsList = [
    'appSpacing',
    'appBorderRadius',
    'appBorderWidth',
    'appOpacity',
    'appElevation',
    'appGradients', // Ensure this matches the instance name _appgradients
  ];
  if (fonts.customTextStyles.length > 0) {
    extensionsList.push('appTextStyles'); // Add custom text styles if they exist
  }
  
  const themeExtensionsString = extensionsList.map(ext => `        _${ext.toLowerCase()},`).join('\n');


  return `// lib/theme/app_theme.dart
import 'package:flutter/material.dart';
import 'dart:ui' show lerpDouble;
import 'dart:math' show pi;

// Generated by Material Palette Forge

// Utility function to parse numeric values from strings with units (e.g., from elevation strings)
double parseUnitValue(String value) {
  if (value.isEmpty) return 0.0;
  final cleanValue = value
      .replaceAll(RegExp(r'(deg|px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)'), '')
      .trim();
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

// Gradient Data Holder
@immutable
class AppGradientData {
  const AppGradientData({
    required this.name,
    required this.type,
    this.direction,
    this.shape,
    this.extent,
    required this.colors,
  });

  final String name;
  final String type;
  final String? direction;
  final String? shape;
  final String? extent;
  final List<Color> colors;

  Gradient? toGradient() {
    if (type == 'linear') {
      Alignment begin = Alignment.centerLeft;
      Alignment end = Alignment.centerRight;
      double? angle;

      if (direction != null) {
        if (direction!.contains('deg')) {
            angle = (parseUnitValue(direction!) * pi / 180);
        } else {
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

      return angle != null
        ? LinearGradient(colors: colors, transform: GradientRotation(angle))
        : LinearGradient(colors: colors, begin: begin, end: end);

    } else if (type == 'radial') {
      TileMode tileMode = TileMode.clamp;
      Alignment center = Alignment.center;
      double radius = 0.5;
      // TODO: Parse shape and extent for more precise radial gradients
      return RadialGradient(
        colors: colors,
        center: center,
        radius: radius,
        tileMode: tileMode,
      );
    }
    return null;
  }
}

// Gradients Extension
@immutable
class AppGradients extends ThemeExtension<AppGradients> {
  const AppGradients({
    required this.gradients,
  });

  final List<AppGradientData> gradients;

  AppGradientData? getGradientByName(String name) {
    try {
      return gradients.firstWhere((g) => g.name == name);
    } catch (e) {
      return null;
    }
  }

  @override
  AppGradients copyWith({
    List<AppGradientData>? gradients,
  }) {
    return AppGradients(
      gradients: gradients ?? this.gradients,
    );
  }

  @override
  AppGradients lerp(ThemeExtension<AppGradients>? other, double t) {
    if (other is! AppGradients) {
      return this;
    }
    return t < 0.5 ? this : other;
  }
}

final _appgradients = AppGradients(
  gradients: [
${gradientDataInstances}
  ],
);

// --- Main AppTheme Class ---
class AppTheme {
  static ThemeData get lightTheme {
    final colorScheme = ColorScheme(
${colorSchemeEntries.trimEnd()}
    );

    final textTheme = TextTheme(
${materialTextThemeEntries}
    ).apply(
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );

    final _appspacing = _appspacing; // Referencing the generated instance
    final _appborderradius = _appborderradius;
    final _appborderwidth = _appborderwidth;
    final _appopacity = _appopacity;
    final _appelevation = _appelevation;
    // _appgradients is already defined above
    // _apptextstyles will be defined if custom styles exist

    final defaultCardBorderRadius = _appborderradius.md;

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      extensions: <ThemeExtension<dynamic>>[
${themeExtensionsString}
      ],
      cardTheme: CardTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(defaultCardBorderRadius),
        ),
        color: colorScheme.surfaceContainerHighest,
        surfaceTintColor: colorScheme.surfaceTint,
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(_appborderradius.full),
        ),
        padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.sm),
      ),
       filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(_appborderradius.full),
            ),
            padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.md),
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
        )
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
         style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(_appborderradius.full),
            ),
             padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.md),
             side: BorderSide(color: colorScheme.outline, width: _appborderwidth.thin),
        )
      ),
      textButtonTheme: TextButtonThemeData(
         style: TextButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(_appborderradius.full),
            ),
             padding: EdgeInsets.symmetric(horizontal: _appspacing.lg, vertical: _appspacing.md),
        )
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_appborderradius.sm),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_appborderradius.sm),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(_appborderradius.sm),
            borderSide: BorderSide(color: colorScheme.primary, width: _appborderwidth.medium),
        ),
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest,
        contentPadding: EdgeInsets.symmetric(horizontal: _appspacing.md, vertical: _appspacing.sm),
      ),
      dialogTheme: DialogTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(_appborderradius.lg),
        ),
        backgroundColor: colorScheme.surfaceContainerHigh,
        titleTextStyle: textTheme.headlineSmall?.copyWith(color: colorScheme.onSurface),
        contentTextStyle: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(_appborderradius.md),
        ),
        backgroundColor: colorScheme.secondaryContainer,
        labelStyle: textTheme.labelLarge?.copyWith(color: colorScheme.onSecondaryContainer),
        padding: EdgeInsets.symmetric(horizontal: _appspacing.md, vertical: _appspacing.sm),
        side: BorderSide.none,
      )
    );
  }
}
`
}

export function generateJson(theme: ThemeConfiguration): string {
  // Deep copy to avoid modifying original themeConfig in useTheme
  const themeCopy = JSON.parse(JSON.stringify(theme));
  return JSON.stringify(themeCopy, null, 2);
}

export function generateFigmaTokens(theme: ThemeConfiguration): string {
  // Deep copy
  const themeCopy = JSON.parse(JSON.stringify(theme));

  const figmaTokens: any = {
    global: {
      color: {},
      typography: {}, // Changed from fontFamily to typography for structured text styles
      spacing: {},
      borderRadius: {},
      borderWidth: {},
      opacity: {},
      boxShadow: {},
      gradient: {},
    }
  };

  const colorsTarget = figmaTokens.global.color;
  for (const key in themeCopy.colors) {
    if (key === 'seedColor') continue;
    if (Object.prototype.hasOwnProperty.call(themeCopy.colors, key)) {
      colorsTarget[sanitizeDartVariableName(key)] = { value: themeCopy.colors[key as keyof MaterialColors], type: "color" };
    }
  }

  const typographyTarget = figmaTokens.global.typography;
  // Material Text Styles
  for (const key in themeCopy.fonts.materialTextStyles) {
    const styleKey = key as MaterialTextStyleKey;
    const styleProps = themeCopy.fonts.materialTextStyles[styleKey];
    typographyTarget[sanitizeDartVariableName(styleKey)] = {
      value: {
        fontFamily: styleProps.fontFamily,
        fontSize: `${styleProps.fontSize}px`, // Figma expects units
        fontWeight: styleProps.fontWeight.toString(), // Figma can take number or string for weight
        letterSpacing: `${styleProps.letterSpacing}px`, // Figma expects units, or %
        lineHeight: styleProps.lineHeight ? `${styleProps.lineHeight * 100}%` : 'normal', // Figma often uses % for line height
      },
      type: "typography"
    };
  }
  // Custom Text Styles
  themeCopy.fonts.customTextStyles.forEach(customStyle => {
    typographyTarget[sanitizeDartVariableName(customStyle.name)] = {
      value: {
        fontFamily: customStyle.style.fontFamily,
        fontSize: `${customStyle.style.fontSize}px`,
        fontWeight: customStyle.style.fontWeight.toString(),
        letterSpacing: `${customStyle.style.letterSpacing}px`,
        lineHeight: customStyle.style.lineHeight ? `${customStyle.style.lineHeight * 100}%` : 'normal',
      },
      type: "typography"
    };
  });


  (themeCopy.properties.spacing as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.spacing[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "spacing" };
  });

  (themeCopy.properties.borderRadius as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.borderRadius[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderRadius" };
  });

  (themeCopy.properties.borderWidth as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.borderWidth[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderWidth" };
  });

  (themeCopy.properties.opacity as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.opacity[sanitizeDartVariableName(item.name)] = { value: item.value.toString(), type: "opacity" };
  });

  (themeCopy.properties.elevation as CustomStringPropertyItem[]).forEach(item => {
    figmaTokens.global.boxShadow[sanitizeDartVariableName(item.name)] = { value: item.value, type: "boxShadow" };
  });

  themeCopy.properties.gradients.forEach((gradient: ThemeGradient) => {
    const colorsString = gradient.colors.join(', ');
    let figmaGradientValue = '';
    if (gradient.type === 'linear') {
      figmaGradientValue = `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
    } else if (gradient.type === 'radial') {
      figmaGradientValue = `radial-gradient(${gradient.shape || 'circle'} at ${gradient.extent || 'center'}, ${colorsString})`;
    }

    const tokenName = sanitizeDartVariableName(gradient.name) || `gradient_${Object.keys(figmaTokens.global.gradient).length + 1}`;
    figmaTokens.global.gradient[tokenName] = {
      value: figmaGradientValue,
      type: "other"
    };
  });

  return JSON.stringify(figmaTokens, null, 2);
}
