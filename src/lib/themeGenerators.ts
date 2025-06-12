
import type { ThemeConfiguration, MaterialColors, ThemeGradient, CustomStringPropertyItem, CustomNumericPropertyItem } from '@/types/theme';

function toFlutterColor(hex: string): string {
  return `Color(0xFF${hex.substring(1).toUpperCase()})`;
}

// Helper to sanitize names for Dart variables
function sanitizeDartVariableName(name: string): string {
  if (!name) return 'unnamedProperty';
  let sanitized = name.replace(/[^a-zA-Z0-9_]/g, '_');
  if (sanitized.match(/^[^a-zA-Z_]/)) {
    sanitized = '_' + sanitized;
  }
  sanitized = sanitized.replace(/_([a-zA-Z])/g, (match, p1) => p1.toUpperCase());
  if (sanitized.length === 0) return 'unnamedProperty';
  return sanitized.length > 0 && sanitized[0] === sanitized[0].toUpperCase() ?
    sanitized[0].toLowerCase() + sanitized.substring(1) : sanitized;
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
const _${className.toLowerCase()} = ${className}(
${instanceArgs}
);
`;
}


export function generateFlutterCode(theme: ThemeConfiguration): string {
  const colors = theme.colors;
  const fonts = theme.fonts;
  const properties = theme.properties;

  let colorSchemeEntries = `
    brightness: Brightness.light, // TODO: Make this dynamic for dark theme
    primary: ${toFlutterColor(colors.primary)},
    onPrimary: ${toFlutterColor(colors.onPrimaryContainer)}, // Text on primary buttons/elements
    primaryContainer: ${toFlutterColor(colors.primaryContainer)},
    onPrimaryContainer: ${toFlutterColor(colors.onPrimaryContainer)}, // Text on primary container elements
    secondary: ${toFlutterColor(colors.secondary)},
    onSecondary: ${toFlutterColor(colors.onSecondaryContainer)}, // Text on secondary buttons/elements
    secondaryContainer: ${toFlutterColor(colors.secondaryContainer)},
    onSecondaryContainer: ${toFlutterColor(colors.onSecondaryContainer)}, // Text on secondary container elements
    tertiary: ${toFlutterColor(colors.tertiary)},
    onTertiary: ${toFlutterColor(colors.onTertiaryContainer)}, // Text on tertiary buttons/elements
    tertiaryContainer: ${toFlutterColor(colors.tertiaryContainer)},
    onTertiaryContainer: ${toFlutterColor(colors.onTertiaryContainer)}, // Text on tertiary container elements
    error: ${toFlutterColor(colors.error)},
    onError: ${toFlutterColor(colors.onErrorContainer)}, // Text on error buttons/elements
    errorContainer: ${toFlutterColor(colors.errorContainer)},
    onErrorContainer: ${toFlutterColor(colors.onErrorContainer)}, // Text on error container elements
    surface: ${toFlutterColor(colors.surface)}, // Was background
    onSurface: ${toFlutterColor(colors.onSurface)}, // Was onBackground
    surfaceVariant: ${toFlutterColor(colors.surfaceVariant)},
    onSurfaceVariant: ${toFlutterColor(colors.onSurfaceVariant)},
    outline: ${toFlutterColor(colors.outline)},
    outlineVariant: ${toFlutterColor(colors.outlineVariant)},
    shadow: ${toFlutterColor(colors.shadow)},
    scrim: ${toFlutterColor(colors.scrim)},
    inverseSurface: ${toFlutterColor(colors.inverseSurface)},
    onInverseSurface: ${toFlutterColor(colors.onInverseSurface)},
    inversePrimary: ${toFlutterColor(colors.inversePrimary)},
    surfaceTint: ${toFlutterColor(colors.primary)}, // M3 often uses primary as surfaceTint
  `;
  
  // For Spacing, BorderRadius, BorderWidth, Opacity: values are numbers.
  // Dart needs them as doubles, e.g., 8.0. Use toFixed(1) to ensure decimal.
  const numericValueParser = (v: string | number) => typeof v === 'number' ? v.toFixed(1) : parseFloat(v.toString()).toFixed(1);
  const stringValueParser = (v: string | number) => `'${v.toString().replace(/'/g, "\\'")}'`;

  const spacingClass = generatePropertyExtensionClass('AppSpacing', properties.spacing, 'double', numericValueParser);
  const borderRadiusClass = generatePropertyExtensionClass('AppBorderRadius', properties.borderRadius, 'double', numericValueParser);
  const borderWidthClass = generatePropertyExtensionClass('AppBorderWidth', properties.borderWidth, 'double', numericValueParser);
  const opacityClass = generatePropertyExtensionClass('AppOpacity', properties.opacity, 'double', numericValueParser); // Opacity values are already 0.0-1.0
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
    // Simple lerp: take 'other' if t > 0.5, otherwise 'this'.
    // For more complex lerping of gradient lists, custom logic would be needed.
    return t < 0.5 ? this : other;
  }
}

// Instance for AppGradients - ensuring lowercase name for consistency
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
      displayLarge: TextStyle(fontFamily: '${fonts.primary}'),
      displayMedium: TextStyle(fontFamily: '${fonts.primary}'),
      displaySmall: TextStyle(fontFamily: '${fonts.primary}'),
      headlineLarge: TextStyle(fontFamily: '${fonts.primary}'),
      headlineMedium: TextStyle(fontFamily: '${fonts.primary}'),
      headlineSmall: TextStyle(fontFamily: '${fonts.primary}'),
      titleLarge: TextStyle(fontFamily: '${fonts.primary}'),
      titleMedium: TextStyle(fontFamily: '${fonts.secondary}'),
      titleSmall: TextStyle(fontFamily: '${fonts.secondary}'),
      bodyLarge: TextStyle(fontFamily: '${fonts.secondary}'),
      bodyMedium: TextStyle(fontFamily: '${fonts.secondary}'),
      bodySmall: TextStyle(fontFamily: '${fonts.secondary}'),
      labelLarge: TextStyle(fontFamily: '${fonts.secondary}', fontWeight: FontWeight.w500),
      labelMedium: TextStyle(fontFamily: '${fonts.secondary}', fontWeight: FontWeight.w500),
      labelSmall: TextStyle(fontFamily: '${fonts.secondary}', fontWeight: FontWeight.w500),
    ).apply(
      bodyColor: colorScheme.onSurface,
      displayColor: colorScheme.onSurface,
    );
    
    final appSpacing = _appspacing;
    final appBorderRadius = _appborderradius;
    final appBorderWidth = _appborderwidth;
    final appOpacity = _appopacity;
    final appElevation = _appelevation;
    final appGradients = _appgradients; // Corrected to use lowercase instance

    final defaultCardBorderRadius = appBorderRadius.md ?? 8.0; 
    // Example for elevation string parsing - careful with direct use
    // String defaultElevationLevel1 = appElevation.level1 ?? '0px 1px 2px rgba(0,0,0,0.1)';
    // double cardElevation = parseUnitValue(defaultElevationLevel1.split(' ')[1]); // Highly simplified, not for robust shadow parsing

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      textTheme: textTheme,
      extensions: <ThemeExtension<dynamic>>[
        appSpacing,
        appBorderRadius,
        appBorderWidth,
        appOpacity,
        appElevation,
        appGradients,
      ],
      cardTheme: CardTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(defaultCardBorderRadius),
        ),
        // elevation: cardElevation, // Elevation in Flutter is a single double, complex shadows need BoxShadow list
        color: colorScheme.surfaceContainerHighest, 
        surfaceTintColor: colorScheme.surfaceTint, 
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.full ?? 9999.0),
        ),
        padding: EdgeInsets.symmetric(horizontal: appSpacing.lg ?? 24.0, vertical: appSpacing.sm ?? 8.0),
      ),
       filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full ?? 9999.0),
            ),
            padding: EdgeInsets.symmetric(horizontal: appSpacing.lg ?? 24.0, vertical: appSpacing.md ?? 16.0),
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
        )
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
         style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full ?? 9999.0),
            ),
             padding: EdgeInsets.symmetric(horizontal: appSpacing.lg ?? 24.0, vertical: appSpacing.md ?? 16.0),
             side: BorderSide(color: colorScheme.outline, width: appBorderWidth.thin ?? 1.0),
        )
      ),
      textButtonTheme: TextButtonThemeData(
         style: TextButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full ?? 9999.0),
            ),
             padding: EdgeInsets.symmetric(horizontal: appSpacing.lg ?? 24.0, vertical: appSpacing.md ?? 16.0),
        )
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm ?? 4.0),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm ?? 4.0),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm ?? 4.0),
            borderSide: BorderSide(color: colorScheme.primary, width: appBorderWidth.medium ?? 2.0),
        ),
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest, // Or surfaceVariant
        contentPadding: EdgeInsets.symmetric(horizontal: appSpacing.md ?? 16.0, vertical: appSpacing.sm ?? 12.0),
      ),
      dialogTheme: DialogTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.lg ?? 12.0),
        ),
        backgroundColor: colorScheme.surfaceContainerHigh,
        titleTextStyle: textTheme.headlineSmall?.copyWith(color: colorScheme.onSurface),
        contentTextStyle: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.md ?? 8.0),
        ),
        backgroundColor: colorScheme.secondaryContainer,
        labelStyle: textTheme.labelLarge?.copyWith(color: colorScheme.onSecondaryContainer),
        padding: EdgeInsets.symmetric(horizontal: appSpacing.md ?? 12.0, vertical: appSpacing.sm ?? 8.0),
        side: BorderSide.none,
      )
    );
  }
}
`
}


export function generateJson(theme: ThemeConfiguration): string {
  return JSON.stringify(theme, null, 2); 
}

export function generateFigmaTokens(theme: ThemeConfiguration): string {
  const figmaTokens: any = {
    global: { 
      color: {},
      fontFamily: {},
      spacing: {}, // Will store numbers
      borderRadius: {}, // Will store numbers
      borderWidth: {}, // Will store numbers
      opacity: {}, // Will store numbers (as string for Figma)
      boxShadow: {}, 
      gradient: {},
    }
  };

  const colorsTarget = figmaTokens.global.color;
  for (const key in theme.colors) {
    if (key === 'seedColor') continue; 
    if (Object.prototype.hasOwnProperty.call(theme.colors, key)) {
      colorsTarget[sanitizeDartVariableName(key)] = { value: theme.colors[key as keyof MaterialColors], type: "color" };
    }
  }
  
  const fontsTarget = figmaTokens.global.fontFamily;
  fontsTarget.primary = { value: theme.fonts.primary, type: "fontFamily" };
  fontsTarget.secondary = { value: theme.fonts.secondary, type: "fontFamily" };
  fontsTarget.monospace = { value: theme.fonts.monospace, type: "fontFamily" };
  
  // Spacing, BorderRadius, BorderWidth now store numbers directly, with "px" implied by Figma's type
  (theme.properties.spacing as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.spacing[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "spacing" };
  });

  (theme.properties.borderRadius as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.borderRadius[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderRadius" };
  });
  
  (theme.properties.borderWidth as CustomNumericPropertyItem[]).forEach(item => {
    figmaTokens.global.borderWidth[sanitizeDartVariableName(item.name)] = { value: `${item.value}px`, type: "borderWidth" };
  });
  
  (theme.properties.opacity as CustomNumericPropertyItem[]).forEach(item => {
    // Figma opacity is often 0-1 or 0-100%, let's stick to 0-1 as string
    figmaTokens.global.opacity[sanitizeDartVariableName(item.name)] = { value: item.value.toString(), type: "opacity" };
  });
  
  (theme.properties.elevation as CustomStringPropertyItem[]).forEach(item => {
    figmaTokens.global.boxShadow[sanitizeDartVariableName(item.name)] = { value: item.value, type: "boxShadow" };
  });

  theme.properties.gradients.forEach((gradient: ThemeGradient) => {
    const colorsString = gradient.colors.join(', ');
    let figmaGradientValue = '';
    if (gradient.type === 'linear') {
        figmaGradientValue = `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
    } else if (gradient.type === 'radial') {
        figmaGradientValue = `radial-gradient(${gradient.shape || 'circle'} at ${gradient.extent || 'center'}, ${colorsString})`;
    }
    
    const tokenName = sanitizeDartVariableName(gradient.name) || `gradient-${figmaTokens.global.gradient.length + 1}`;
    figmaTokens.global.gradient[tokenName] = {
      value: figmaGradientValue,
      type: "other" // Figma Tokens plugin might need specific type for gradients if supported directly
    };
  });

  return JSON.stringify(figmaTokens, null, 2);
}

