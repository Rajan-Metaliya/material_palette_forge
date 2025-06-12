
import type { ThemeConfiguration, MaterialColors, ThemeGradient, ThemeSpacing, ThemeBorderRadius, ThemeBorderWidth, ThemeOpacity, ThemeElevation } from '@/types/theme';

function toFlutterColor(hex: string): string {
  return `Color(0xFF${hex.substring(1).toUpperCase()})`;
}

// This JS function is used during generation time
function parseUnitValueJS(value: string): number {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0.0 : parsed;
}


export function generateFlutterCode(theme: ThemeConfiguration): string {
  const colors = theme.colors;
  const fonts = theme.fonts;
  const properties = theme.properties;

  let colorSchemeEntries = '';
  for (const key in colors) {
    if (Object.prototype.hasOwnProperty.call(colors, key)) {
      const colorKey = key as keyof MaterialColors;
      if (colorKey === 'primary') { // Material 3 uses primary as seedColor for ColorScheme.fromSeed
         colorSchemeEntries += `    seedColor: ${toFlutterColor(colors[colorKey])},\n`;
      }
      // Add all colors to the scheme explicitly for direct use if needed,
      // though fromSeed will generate tonal palettes.
      colorSchemeEntries += `    ${colorKey}: ${toFlutterColor(colors[colorKey])},\n`;
    }
  }

  const spacingExtensionProps = (Object.keys(properties.spacing) as Array<keyof ThemeSpacing>)
    .map(key => `  final double ${key};`).join('\n');
  const spacingExtensionConstructorArgs = (Object.keys(properties.spacing)as Array<keyof ThemeSpacing>)
    .map(key => `    required this.${key},`).join('\n');
  const spacingExtensionCopyWithArgs = (Object.keys(properties.spacing) as Array<keyof ThemeSpacing>)
    .map(key => `double? ${key},`).join('');
  const spacingExtensionCopyWithReturn = (Object.keys(properties.spacing) as Array<keyof ThemeSpacing>)
    .map(key => `      ${key}: ${key} ?? this.${key},`).join('\n');
  const spacingExtensionLerp = (Object.keys(properties.spacing) as Array<keyof ThemeSpacing>)
    .map(key => `      ${key}: lerpDouble(this.${key}, other.${key}, t)!,`).join('\n');
  const spacingInstanceArgs = (Object.keys(properties.spacing) as Array<keyof ThemeSpacing>)
    .map(key => `      ${key}: ${parseUnitValueJS(properties.spacing[key])},`).join('\n');

  const borderRadiusExtensionProps = (Object.keys(properties.borderRadius) as Array<keyof ThemeBorderRadius>)
    .map(key => `  final double ${key};`).join('\n');
  const borderRadiusExtensionConstructorArgs = (Object.keys(properties.borderRadius) as Array<keyof ThemeBorderRadius>)
    .map(key => `    required this.${key},`).join('\n');
  const borderRadiusExtensionCopyWithArgs = (Object.keys(properties.borderRadius)as Array<keyof ThemeBorderRadius>)
    .map(key => `double? ${key},`).join('');
  const borderRadiusExtensionCopyWithReturn = (Object.keys(properties.borderRadius)as Array<keyof ThemeBorderRadius>)
    .map(key => `      ${key}: ${key} ?? this.${key},`).join('\n');
  const borderRadiusExtensionLerp = (Object.keys(properties.borderRadius)as Array<keyof ThemeBorderRadius>)
    .map(key => `      ${key}: lerpDouble(this.${key}, other.${key}, t)!,`).join('\n');
  const borderRadiusInstanceArgs = (Object.keys(properties.borderRadius)as Array<keyof ThemeBorderRadius>)
    .map(key => `      ${key}: ${parseUnitValueJS(properties.borderRadius[key])},`).join('\n');

  const borderWidthExtensionProps = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `  final double ${key};`).join('\n');
  const borderWidthExtensionConstructorArgs = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `    required this.${key},`).join('\n');
  const borderWidthExtensionCopyWithArgs = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `double? ${key},`).join('');
  const borderWidthExtensionCopyWithReturn = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `      ${key}: ${key} ?? this.${key},`).join('\n');
  const borderWidthExtensionLerp = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `      ${key}: lerpDouble(this.${key}, other.${key}, t)!,`).join('\n');
  const borderWidthInstanceArgs = (Object.keys(properties.borderWidth) as Array<keyof ThemeBorderWidth>)
    .map(key => `      ${key}: ${parseUnitValueJS(properties.borderWidth[key])},`).join('\n');

  const opacityExtensionProps = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `  final double ${key};`).join('\n');
  const opacityExtensionConstructorArgs = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `    required this.${key},`).join('\n');
  const opacityExtensionCopyWithArgs = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `double? ${key},`).join('');
  const opacityExtensionCopyWithReturn = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `      ${key}: ${key} ?? this.${key},`).join('\n');
  const opacityExtensionLerp = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `      ${key}: lerpDouble(this.${key}, other.${key}, t)!,`).join('\n');
  const opacityInstanceArgs = (Object.keys(properties.opacity) as Array<keyof ThemeOpacity>)
    .map(key => `      ${key}: ${properties.opacity[key]},`).join('\n');

  const elevationExtensionProps = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `  final String ${key};`).join('\n');
  const elevationExtensionConstructorArgs = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `    required this.${key},`).join('\n');
  const elevationExtensionCopyWithArgs = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `String? ${key},`).join('');
  const elevationExtensionCopyWithReturn = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `      ${key}: ${key} ?? this.${key},`).join('\n');
  const elevationExtensionLerp = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `      ${key}: t < 0.5 ? this.${key} : other.${key},`).join('\n');
  const elevationInstanceArgs = (Object.keys(properties.elevation) as Array<keyof ThemeElevation>)
    .map(key => `      ${key}: '${properties.elevation[key].replace(/'/g, "\\'")}',`).join('\n');


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
import 'dart:ui' show lerpDouble; // For lerpDouble
import 'dart:math' show pi; // For GradientRotation

// Generated by Material Palette Forge
//
// How to use custom extensions:
// final appSpacing = Theme.of(context).extension<AppSpacing>();
// double padding = appSpacing!.md;
//
// final appGradients = Theme.of(context).extension<AppGradients>();
// final primaryGradient = appGradients!.gradients.firstWhere((g) => g.name == 'Primary to Secondary');

// --- Utility Functions ---

// Utility function to parse numeric values from strings with units
double parseUnitValue(String value) {
  if (value.isEmpty) return 0.0;

  // Remove common units and extract the numeric part
  final cleanValue = value
      .replaceAll(RegExp(r'(deg|px|em|rem|%|pt|pc|in|cm|mm|ex|ch|vw|vh|vmin|vmax)'), '')
      .trim();

  // Try to parse the numeric value
  final parsed = double.tryParse(cleanValue);
  return parsed ?? 0.0;
}

// --- Custom Theme Extensions ---

// Spacing Extension
@immutable
class AppSpacing extends ThemeExtension<AppSpacing> {
  const AppSpacing({
${spacingExtensionConstructorArgs}
  });

${spacingExtensionProps}

  @override
  AppSpacing copyWith({
    ${spacingExtensionCopyWithArgs}
  }) {
    return AppSpacing(
${spacingExtensionCopyWithReturn}
    );
  }

  @override
  AppSpacing lerp(ThemeExtension<AppSpacing>? other, double t) {
    if (other is! AppSpacing) {
      return this;
    }
    return AppSpacing(
${spacingExtensionLerp}
    );
  }
}

// Border Radius Extension
@immutable
class AppBorderRadius extends ThemeExtension<AppBorderRadius> {
  const AppBorderRadius({
${borderRadiusExtensionConstructorArgs}
  });

${borderRadiusExtensionProps}

  @override
  AppBorderRadius copyWith({
    ${borderRadiusExtensionCopyWithArgs}
  }) {
    return AppBorderRadius(
${borderRadiusExtensionCopyWithReturn}
    );
  }

  @override
  AppBorderRadius lerp(ThemeExtension<AppBorderRadius>? other, double t) {
    if (other is! AppBorderRadius) {
      return this;
    }
    return AppBorderRadius(
${borderRadiusExtensionLerp}
    );
  }
}

// Border Width Extension
@immutable
class AppBorderWidth extends ThemeExtension<AppBorderWidth> {
  const AppBorderWidth({
${borderWidthExtensionConstructorArgs}
  });

${borderWidthExtensionProps}

  @override
  AppBorderWidth copyWith({
    ${borderWidthExtensionCopyWithArgs}
  }) {
    return AppBorderWidth(
${borderWidthExtensionCopyWithReturn}
    );
  }

  @override
  AppBorderWidth lerp(ThemeExtension<AppBorderWidth>? other, double t) {
    if (other is! AppBorderWidth) {
      return this;
    }
    return AppBorderWidth(
${borderWidthExtensionLerp}
    );
  }
}

// Opacity Extension
@immutable
class AppOpacity extends ThemeExtension<AppOpacity> {
  const AppOpacity({
${opacityExtensionConstructorArgs}
  });

${opacityExtensionProps}

  @override
  AppOpacity copyWith({
    ${opacityExtensionCopyWithArgs}
  }) {
    return AppOpacity(
${opacityExtensionCopyWithReturn}
    );
  }

  @override
  AppOpacity lerp(ThemeExtension<AppOpacity>? other, double t) {
    if (other is! AppOpacity) {
      return this;
    }
    return AppOpacity(
${opacityExtensionLerp}
    );
  }
}

// Elevation Extension
@immutable
class AppElevation extends ThemeExtension<AppElevation> {
  const AppElevation({
${elevationExtensionConstructorArgs}
  });

${elevationExtensionProps}

  @override
  AppElevation copyWith({
    ${elevationExtensionCopyWithArgs}
  }) {
    return AppElevation(
${elevationExtensionCopyWithReturn}
    );
  }

  @override
  AppElevation lerp(ThemeExtension<AppElevation>? other, double t) {
    if (other is! AppElevation) {
      return this;
    }
    return AppElevation(
${elevationExtensionLerp}
    );
  }
}

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
  final String type; // 'linear' or 'radial'
  final String? direction; // For linear, e.g., 'to right', '45deg'
  final String? shape; // For radial, e.g., 'circle'
  final String? extent; // For radial, e.g., 'farthest-corner'
  final List<Color> colors;

  // Helper to get a Flutter Gradient object
  Gradient? toGradient() {
    if (type == 'linear') {
      Alignment begin = Alignment.centerLeft;
      Alignment end = Alignment.centerRight;
      double? angle;

      if (direction != null) {
        if (direction!.contains('deg')) {
            angle = (parseUnitValue(direction!) * pi / 180); // to radians
        } else {
            // Simplified: 'to right', 'to left', 'to top', 'to bottom'
            // 'to top left', etc. would require more complex parsing
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
      double radius = 0.5; // Default for 'circle' if not further specified by extent

      // Note: Flutter's RadialGradient is quite different from CSS radial gradients.
      // This is a simplified interpretation.
      // 'shape' can be 'circle' or 'ellipse'. 'extent' can further refine this.
      
      // A more complete mapping would be very complex. This covers basic cases.
      // For instance, 'farthest-corner' for a circle might imply radius = 1.0 (sqrt(0.5^2 + 0.5^2) * sqrt(2) approx)
      // if center is 0,0 and container is square.
      // if (shape == 'ellipse') { /* Use different defaults or logic */ }

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


// --- Main AppTheme Class ---
class AppTheme {
  static ThemeData get lightTheme {
    final colorScheme = ColorScheme.fromSeed(
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
    
    final appSpacing = AppSpacing(
${spacingInstanceArgs}
    );

    final appBorderRadius = AppBorderRadius(
${borderRadiusInstanceArgs}
    );

    final appBorderWidth = AppBorderWidth(
${borderWidthInstanceArgs}
    );

    final appOpacity = AppOpacity(
${opacityInstanceArgs}
    );

    final appElevation = AppElevation(
${elevationInstanceArgs}
    );
    
    final appGradients = AppGradients(
      gradients: [
${gradientDataInstances}
      ],
    );

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
          borderRadius: BorderRadius.circular(appBorderRadius.md),
        ),
        // Elevation in CardTheme is a double, not a string of box-shadows.
        // We parse one of the AppElevation values or use a default.
        // For simplicity, let's assume level1's first numeric value might be desired height.
        // A more robust solution involves parsing the shadow string correctly.
        elevation: parseUnitValue(appElevation.level1.split(' ')[1]), 
        color: colorScheme.surfaceContainerHighest, // M3 card color
        surfaceTintColor: colorScheme.surfaceTint, 
      ),
      buttonTheme: ButtonThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.full),
        ),
        padding: EdgeInsets.symmetric(horizontal: appSpacing.lg, vertical: appSpacing.sm),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full),
            ),
            padding: EdgeInsets.symmetric(horizontal: appSpacing.lg, vertical: appSpacing.md),
            backgroundColor: colorScheme.primary,
            foregroundColor: colorScheme.onPrimary,
        )
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
         style: OutlinedButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full),
            ),
             padding: EdgeInsets.symmetric(horizontal: appSpacing.lg, vertical: appSpacing.md),
             side: BorderSide(color: colorScheme.outline, width: appBorderWidth.thin),
        )
      ),
      textButtonTheme: TextButtonThemeData(
         style: TextButton.styleFrom(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(appBorderRadius.full),
            ),
             padding: EdgeInsets.symmetric(horizontal: appSpacing.lg, vertical: appSpacing.md),
        )
      ),
      inputDecorationTheme: InputDecorationTheme(
        border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm),
            borderSide: BorderSide(color: colorScheme.outline),
        ),
        focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(appBorderRadius.sm),
            borderSide: BorderSide(color: colorScheme.primary, width: appBorderWidth.medium),
        ),
        filled: true,
        fillColor: colorScheme.surfaceContainerHighest,
        contentPadding: EdgeInsets.symmetric(horizontal: appSpacing.md, vertical: appSpacing.sm),
      ),
      dialogTheme: DialogTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.lg),
        ),
        backgroundColor: colorScheme.surfaceContainerHigh,
        titleTextStyle: textTheme.headlineSmall?.copyWith(color: colorScheme.onSurface),
        contentTextStyle: textTheme.bodyMedium?.copyWith(color: colorScheme.onSurfaceVariant),
      ),
      chipTheme: ChipThemeData(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(appBorderRadius.md),
        ),
        backgroundColor: colorScheme.secondaryContainer,
        labelStyle: textTheme.labelLarge?.copyWith(color: colorScheme.onSecondaryContainer),
        padding: EdgeInsets.symmetric(horizontal: appSpacing.md, vertical: appSpacing.sm),
        side: BorderSide.none,
      )
    );
  }

  // Optional: Define a darkTheme similarly if needed
  // static ThemeData get darkTheme => lightTheme.copyWith(brightness: Brightness.dark, /* add dark specific overrides */);
}
`
}


export function generateJson(theme: ThemeConfiguration): string {
  // Convert theme object to the specified JSON structure
  const outputJson = {
    colors: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      tertiary: theme.colors.tertiary,
      error: theme.colors.error,
      extended: {
        surface: theme.colors.surface,
        onSurface: theme.colors.onSurface,
        primaryContainer: theme.colors.primaryContainer,
        onPrimaryContainer: theme.colors.onPrimaryContainer,
        secondaryContainer: theme.colors.secondaryContainer,
        onSecondaryContainer: theme.colors.onSecondaryContainer,
        tertiaryContainer: theme.colors.tertiaryContainer,
        onTertiaryContainer: theme.colors.onTertiaryContainer,
        errorContainer: theme.colors.errorContainer,
        onErrorContainer: theme.colors.onErrorContainer,
        surfaceVariant: theme.colors.surfaceVariant,
        onSurfaceVariant: theme.colors.onSurfaceVariant,
        outline: theme.colors.outline,
        outlineVariant: theme.colors.outlineVariant,
        shadow: theme.colors.shadow,
        scrim: theme.colors.scrim,
        inverseSurface: theme.colors.inverseSurface,
        onInverseSurface: theme.colors.onInverseSurface,
        inversePrimary: theme.colors.inversePrimary,
        // seedColor is intentionally not in output JSON by default
      }
    },
    fonts: {
      primary: theme.fonts.primary,
      secondary: theme.fonts.secondary,
      extended: { 
        monospace: theme.fonts.monospace,
      }
    },
    properties: theme.properties
  };
  return JSON.stringify(outputJson, null, 2);
}

export function generateFigmaTokens(theme: ThemeConfiguration): string {
  const figmaTokens: any = {
    global: { // Using a "global" top-level key as often seen in token structures
      color: {},
      fontFamily: {},
      spacing: {},
      borderRadius: {},
      borderWidth: {},
      opacity: {},
      boxShadow: {}, 
      gradient: {},
    }
  };

  const colorsTarget = figmaTokens.global.color;
  for (const key in theme.colors) {
    if (key === 'seedColor') continue; // Do not export seedColor to tokens
    if (Object.prototype.hasOwnProperty.call(theme.colors, key)) {
      colorsTarget[key] = { value: theme.colors[key as keyof MaterialColors], type: "color" };
    }
  }
  
  const fontsTarget = figmaTokens.global.fontFamily;
  fontsTarget.primary = { value: theme.fonts.primary, type: "fontFamily" };
  fontsTarget.secondary = { value: theme.fonts.secondary, type: "fontFamily" };
  fontsTarget.monospace = { value: theme.fonts.monospace, type: "fontFamily" };
  
  const spacingTarget = figmaTokens.global.spacing;
  for (const key in theme.properties.spacing) {
    spacingTarget[key] = { value: theme.properties.spacing[key as keyof typeof theme.properties.spacing], type: "spacing" };
  }

  const borderRadiusTarget = figmaTokens.global.borderRadius;
  for (const key in theme.properties.borderRadius) {
    borderRadiusTarget[key] = { value: theme.properties.borderRadius[key as keyof typeof theme.properties.borderRadius], type: "borderRadius" };
  }
  
  const borderWidthTarget = figmaTokens.global.borderWidth;
  for (const key in theme.properties.borderWidth) {
    borderWidthTarget[key] = { value: theme.properties.borderWidth[key as keyof typeof theme.properties.borderWidth], type: "borderWidth" };
  }
  
  const opacityTarget = figmaTokens.global.opacity;
  for (const key in theme.properties.opacity) {
    opacityTarget[key] = { value: theme.properties.opacity[key as keyof typeof theme.properties.opacity].toString(), type: "opacity" };
  }
  
  const elevationTarget = figmaTokens.global.boxShadow; // Figma uses boxShadow for elevation
  for (const key in theme.properties.elevation) {
    const levelKey = key.replace('level', ''); // e.g. level1 -> 1
    elevationTarget[levelKey] = { value: theme.properties.elevation[key as keyof typeof theme.properties.elevation], type: "boxShadow" };
  }

  const gradientTarget = figmaTokens.global.gradient;
  theme.properties.gradients.forEach((gradient: ThemeGradient, index: number) => {
    const colorsString = gradient.colors.join(', ');
    let figmaGradientValue = '';
    if (gradient.type === 'linear') {
        figmaGradientValue = `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
    } else if (gradient.type === 'radial') {
        // Figma doesn't directly support complex radial gradient strings like CSS.
        // It's better to provide a simplified representation or instruct users to recreate it manually.
        // For now, outputting a string that describes it.
        figmaGradientValue = `radial-gradient(${gradient.shape || 'circle'} at ${gradient.extent || 'center'}, ${colorsString})`;
    }
    
    const tokenName = gradient.name.replace(/\s+/g, '-').toLowerCase() || `gradient-${index + 1}`;
    gradientTarget[tokenName] = {
      value: figmaGradientValue,
      type: "other" // "gradient" is not a standard type, "other" or string type can be used
    };
  });


  return JSON.stringify(figmaTokens, null, 2);
}

