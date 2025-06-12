
"use client";

import React, { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TextStyleProperties, FontWeightValue } from '@/types/theme';
import { COMMON_WEB_FONTS } from '@/lib/consts';


// Helper to get the full font stack for CSS
const getFontStack = (fontFamilyName: string): string => {
  const font = COMMON_WEB_FONTS.find(f => f.value === fontFamilyName);
  return font ? font.stack : fontFamilyName; // Fallback to the name itself
};

// Helper to convert theme fontWeight to CSS fontWeight
const getCssFontWeight = (fontWeight: FontWeightValue): string | number => {
  if (fontWeight === 'normal') return 400;
  if (fontWeight === 'bold') return 700;
  return fontWeight;
};

// Helper to apply text style properties to a CSSProperties object
const applyTextStyle = (styleProps: TextStyleProperties): CSSProperties => {
  const cssStyle: CSSProperties = {
    fontFamily: getFontStack(styleProps.fontFamily),
    fontSize: `${styleProps.fontSize}px`, // Assuming logical pixels for preview
    fontWeight: getCssFontWeight(styleProps.fontWeight),
    letterSpacing: `${styleProps.letterSpacing}px`,
    transition: 'all 0.3s ease-in-out', // Keep transitions
  };
  if (styleProps.lineHeight !== undefined) {
    cssStyle.lineHeight = styleProps.lineHeight; // Unitless multiplier
  }
  return cssStyle;
};


const ThemePreview: React.FC = () => {
  const { themeConfig } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <Card className="mt-8">
            <CardHeader><CardTitle className="text-xl">Theme Preview</CardTitle></CardHeader>
            <CardContent className="animate-pulse">
                <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-muted rounded w-1/3"></div>
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded w-full"></div>
                    <div className="h-6 bg-muted rounded w-3/4"></div>
                </div>
            </CardContent>
        </Card>
    );
  }

  const previewCardStyle: CSSProperties = {
    backgroundColor: themeConfig.colors.surface,
    color: themeConfig.colors.onSurface,
    border: `1px solid ${themeConfig.colors.outline}`,
    borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'md')?.value || 8}px`,
    boxShadow: themeConfig.properties.elevation.find(e => e.name === 'level2')?.value || 'none',
    transition: 'all 0.3s ease-in-out',
    // Base font for card, specific text styles will override
    ...applyTextStyle(themeConfig.fonts.materialTextStyles.bodyMedium), 
  };

  const buttonStyle: CSSProperties = {
    ...applyTextStyle(themeConfig.fonts.materialTextStyles.labelLarge), // Use labelLarge for button text
    backgroundColor: themeConfig.colors.primary,
    color: themeConfig.colors.onPrimaryContainer,
    padding: `${themeConfig.properties.spacing.find(s => s.name === 'sm')?.value || 8}px ${themeConfig.properties.spacing.find(s => s.name === 'md')?.value || 16}px`,
    borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'full')?.value || 999}px`, // Use full for M3 like buttons
    border: `1px solid ${themeConfig.colors.primaryContainer}`, // Or primary for a stronger border
  };
  
  const textHeadlineStyle: CSSProperties = {
    ...applyTextStyle(themeConfig.fonts.materialTextStyles.headlineMedium), // Example: headlineMedium
    color: themeConfig.colors.primary, // Or onSurface
  };
  
  const textBodyStyle: CSSProperties = {
    ...applyTextStyle(themeConfig.fonts.materialTextStyles.bodyLarge), // Example: bodyLarge
    color: themeConfig.colors.onSurfaceVariant, // Or onSurface
  };

  const gradientStyle: CSSProperties = {
    background: themeConfig.properties.gradients[0] ? 
        (themeConfig.properties.gradients[0].type === 'linear' ?
            `linear-gradient(${themeConfig.properties.gradients[0].direction || 'to right'}, ${themeConfig.properties.gradients[0].colors.join(', ')})`
          : `radial-gradient(${themeConfig.properties.gradients[0].shape || 'circle'}, ${themeConfig.properties.gradients[0].colors.join(', ')})`)
        : 'transparent',
    padding: `${themeConfig.properties.spacing.find(s => s.name === 'md')?.value || 16}px`,
    borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'sm')?.value || 4}px`,
    color: themeConfig.colors.onPrimaryContainer,
    textAlign: 'center',
    transition: 'background 0.3s ease-in-out',
  }


  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl" style={applyTextStyle(themeConfig.fonts.materialTextStyles.titleLarge)}>Theme Preview</CardTitle>
      </CardHeader>
      <CardContent style={previewCardStyle} className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl mb-2" style={textHeadlineStyle}>
            Display Text Example
          </h3>
          <p className="text-base" style={textBodyStyle}>
            This is body text. It demonstrates how general content will appear within the theme.
            The quick brown fox jumps over the lazy dog, showcasing various characters and spacing.
          </p>
        </div>

        <Separator style={{backgroundColor: themeConfig.colors.outlineVariant}}/>
        
        <div className="flex flex-wrap gap-4 items-center">
          <Button style={buttonStyle}>Primary Button</Button>
          <Button variant="outline" style={{
            ...applyTextStyle(themeConfig.fonts.materialTextStyles.labelLarge),
            borderColor: themeConfig.colors.outline,
            color: themeConfig.colors.primary,
            borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'full')?.value || 999}px`,
            padding: `${themeConfig.properties.spacing.find(s => s.name === 'sm')?.value || 8}px ${themeConfig.properties.spacing.find(s => s.name === 'md')?.value || 16}px`,
          }}>
            Outline Button
          </Button>
           <div style={{
              ...applyTextStyle(themeConfig.fonts.materialTextStyles.bodySmall),
              backgroundColor: themeConfig.colors.errorContainer,
              color: themeConfig.colors.onErrorContainer,
              padding: `${themeConfig.properties.spacing.find(s => s.name === 'sm')?.value || 8}px`,
              borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'xs')?.value || 2}px`,
              border: `1px solid ${themeConfig.colors.error}`,
           }}>
            Error Message Area
           </div>
        </div>

        <Separator style={{backgroundColor: themeConfig.colors.outlineVariant}}/>
        
        {themeConfig.properties.gradients.length > 0 && (
            <div style={{...gradientStyle, ...applyTextStyle(themeConfig.fonts.materialTextStyles.titleMedium)}}>
                <p>Gradient Example</p>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div style={{
                padding: `${themeConfig.properties.spacing.find(s => s.name === 'md')?.value || 16}px`,
                border: `${themeConfig.properties.borderWidth.find(bw => bw.name === 'medium')?.value || 2}px solid ${themeConfig.colors.secondaryContainer}`,
                borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'lg')?.value || 12}px`,
                backgroundColor: themeConfig.colors.surfaceVariant,
                boxShadow: themeConfig.properties.elevation.find(e => e.name === 'level1')?.value || 'none',
                transition: 'all 0.3s ease-in-out',
            }}>
                <p style={{...applyTextStyle(themeConfig.fonts.materialTextStyles.bodyMedium), color: themeConfig.colors.onSurfaceVariant}}>
                    Component with Radius & Border (Lg)
                </p>
            </div>
            <div style={{
                padding: `${themeConfig.properties.spacing.find(s => s.name === 'sm')?.value || 8}px`,
                border: `${themeConfig.properties.borderWidth.find(bw => bw.name === 'thin')?.value || 1}px solid ${themeConfig.colors.tertiaryContainer}`,
                borderRadius: `${themeConfig.properties.borderRadius.find(r => r.name === 'xs')?.value || 2}px`,
                backgroundColor: themeConfig.colors.tertiaryContainer,
                color: themeConfig.colors.onTertiaryContainer,
                boxShadow: themeConfig.properties.elevation.find(e => e.name === 'level3')?.value || 'none',
                opacity: themeConfig.properties.opacity.find(o => o.name === 'hover')?.value || 1, // Example opacity
                transition: 'all 0.3s ease-in-out',
            }}>
                <p style={applyTextStyle(themeConfig.fonts.materialTextStyles.labelMedium)}>
                    Another Component (Xs Radius)
                </p>
            </div>
        </div>
        
        {themeConfig.fonts.customTextStyles.length > 0 && (
          <div>
            <Separator style={{backgroundColor: themeConfig.colors.outlineVariant, marginBlock: '1rem'}}/>
            <h4 style={applyTextStyle(themeConfig.fonts.materialTextStyles.titleSmall)}>Custom Text Styles:</h4>
            {themeConfig.fonts.customTextStyles.map((custom, index) => (
              <p key={index} style={{...applyTextStyle(custom.style), color: themeConfig.colors.onSurface, marginTop: '0.5rem'}}>
                {custom.name}: "Themed text with custom style."
              </p>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default ThemePreview;
