
"use client";

import React, { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TextStyleProperties, FontWeightValue, CustomNumericPropertyItem, CustomStringPropertyItem } from '@/types/theme';
import { COMMON_WEB_FONTS, MATERIAL_TEXT_STYLE_LABELS, MATERIAL_TEXT_STYLE_ORDER } from '@/lib/consts';
import { cn } from '@/lib/utils';

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
const applyTextStyle = (styleProps?: TextStyleProperties): CSSProperties => {
  if (!styleProps) return {};
  const cssStyle: CSSProperties = {
    fontFamily: getFontStack(styleProps.fontFamily),
    fontSize: `${styleProps.fontSize}px`,
    fontWeight: getCssFontWeight(styleProps.fontWeight),
    letterSpacing: `${styleProps.letterSpacing}px`,
    transition: 'all 0.2s ease-out',
  };
  if (styleProps.lineHeight !== undefined) {
    cssStyle.lineHeight = styleProps.lineHeight;
  }
  return cssStyle;
};

const getNumericPropertyValue = (items: CustomNumericPropertyItem[], name: string, defaultValue: number): number => {
  const item = items.find(i => i.name === name);
  return item ? item.value : defaultValue;
};

const getStringPropertyValue = (items: CustomStringPropertyItem[], name: string, defaultValue: string): string => {
  const item = items.find(i => i.name === name);
  return item ? item.value : defaultValue;
};


const ThemePreview: React.FC = () => {
  const { themeConfig } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <Card>
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

  const { colors, fonts, properties } = themeConfig;

  const previewCardStyle: CSSProperties = {
    backgroundColor: colors.surface,
    color: colors.onSurface,
    border: `1px solid ${colors.outline}`,
    borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'md', 8)}px`,
    boxShadow: getStringPropertyValue(properties.elevation, 'level2', '0px 1px 2px rgba(0, 0, 0, 0.3), 0px 2px 6px 2px rgba(0, 0, 0, 0.15)'),
    transition: 'all 0.2s ease-out',
    ...applyTextStyle(fonts.materialTextStyles.bodyMedium),
  };

  const spacingMd = getNumericPropertyValue(properties.spacing, 'md', 16);
  const spacingSm = getNumericPropertyValue(properties.spacing, 'sm', 8);

  const buttonPrimaryStyle: CSSProperties = {
    ...applyTextStyle(fonts.materialTextStyles.labelLarge),
    backgroundColor: colors.primary,
    color: colors.onPrimaryContainer, // M3 often uses onPrimaryContainer for text on primary button
    padding: `${spacingSm}px ${spacingMd}px`,
    borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'full', 9999)}px`,
    border: `1px solid ${colors.primaryContainer}`,
  };

  const buttonOutlineStyle: CSSProperties = {
    ...applyTextStyle(fonts.materialTextStyles.labelLarge),
    borderColor: colors.outline,
    color: colors.primary,
    padding: `${spacingSm}px ${spacingMd}px`,
    borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'full', 9999)}px`,
  };

  const gradientStyle: CSSProperties = properties.gradients.length > 0 ? {
    background: properties.gradients[0].type === 'linear' ?
        `linear-gradient(${properties.gradients[0].direction || 'to right'}, ${properties.gradients[0].colors.join(', ')})`
      : `radial-gradient(${properties.gradients[0].shape || 'circle'}, ${properties.gradients[0].colors.join(', ')})`,
    padding: `${spacingMd}px`,
    borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'sm', 4)}px`,
    color: colors.onPrimaryContainer, // Assuming gradient is primary-like
    textAlign: 'center',
    transition: 'background 0.2s ease-out',
    ...applyTextStyle(fonts.materialTextStyles.titleMedium)
  } : {};


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl" style={applyTextStyle(fonts.materialTextStyles.titleLarge)}>Theme Preview</CardTitle>
        <CardDescription style={applyTextStyle(fonts.materialTextStyles.bodySmall)}>
          Live preview of your Material 3 inspired theme.
        </CardDescription>
      </CardHeader>
      <CardContent style={previewCardStyle} className="p-6 space-y-6">
        
        {/* Text Styles Showcase */}
        <div>
            <h4 style={{...applyTextStyle(fonts.materialTextStyles.titleSmall), color: colors.onSurfaceVariant, marginBottom: '0.5rem'}}>Text Styles:</h4>
            {MATERIAL_TEXT_STYLE_ORDER.slice(0, 3).map(key => ( // Show first 3 Material styles
                <p key={key} style={{...applyTextStyle(fonts.materialTextStyles[key]), color: colors.onSurface, marginBottom: '0.25rem' }}>
                    {MATERIAL_TEXT_STYLE_LABELS[key]}: Quick brown fox.
                </p>
            ))}
            {fonts.customTextStyles.length > 0 && (
                 <p style={{...applyTextStyle(fonts.customTextStyles[0].style), color: colors.onSurface, marginTop: '0.25rem' }}>
                    {fonts.customTextStyles[0].name} (Custom): Jumps over the lazy dog.
                </p>
            )}
        </div>

        <Separator style={{backgroundColor: colors.outlineVariant}}/>

        {/* Buttons and Interaction Elements */}
        <div className="flex flex-wrap gap-4 items-center">
          <Button style={buttonPrimaryStyle}>Primary</Button>
          <Button variant="outline" style={buttonOutlineStyle}>Outline</Button>
           <div style={{
              ...applyTextStyle(fonts.materialTextStyles.bodySmall),
              backgroundColor: colors.errorContainer,
              color: colors.onErrorContainer,
              padding: `${getNumericPropertyValue(properties.spacing, 'xs', 4)}px ${spacingSm}px`,
              borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'xs', 2)}px`,
              border: `1px solid ${colors.error}`,
           }}>
            Error Message
           </div>
        </div>

        {properties.gradients.length > 0 && (
          <>
            <Separator style={{backgroundColor: colors.outlineVariant}}/>
            <div style={gradientStyle}>
                <p>{properties.gradients[0].name}</p>
            </div>
          </>
        )}
        
        <Separator style={{backgroundColor: colors.outlineVariant}}/>
        
        {/* Properties Showcase */}
        <div>
            <h4 style={{...applyTextStyle(fonts.materialTextStyles.titleSmall), color: colors.onSurfaceVariant, marginBottom: '0.75rem'}}>Properties Showcase:</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Spacing Example */}
                <div className="flex flex-col items-center">
                    <p style={{...applyTextStyle(fonts.materialTextStyles.labelSmall), marginBottom: '0.25rem'}}>Spacing (md)</p>
                    <div style={{ padding: `${spacingMd}px`, backgroundColor: colors.surfaceVariant, borderRadius: '4px' }}>
                        <div style={{ width: '20px', height: '20px', backgroundColor: colors.primaryContainer }}></div>
                    </div>
                </div>

                {/* Border Radius Example */}
                <div className="flex flex-col items-center">
                    <p style={{...applyTextStyle(fonts.materialTextStyles.labelSmall), marginBottom: '0.25rem'}}>Radius (lg)</p>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: colors.secondaryContainer, 
                        borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'lg', 12)}px`,
                        border: `1px solid ${colors.outline}`
                    }}></div>
                </div>

                {/* Border Width Example */}
                <div className="flex flex-col items-center">
                    <p style={{...applyTextStyle(fonts.materialTextStyles.labelSmall), marginBottom: '0.25rem'}}>Border (medium)</p>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: 'transparent', 
                        borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'sm', 4)}px`,
                        border: `${getNumericPropertyValue(properties.borderWidth, 'medium', 2)}px solid ${colors.tertiary}`
                    }}></div>
                </div>
                
                {/* Opacity Example */}
                <div className="flex flex-col items-center">
                    <p style={{...applyTextStyle(fonts.materialTextStyles.labelSmall), marginBottom: '0.25rem'}}>Opacity (hover)</p>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: colors.primary, 
                        borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'xs', 2)}px`,
                        opacity: getNumericPropertyValue(properties.opacity, 'hover', 0.8)
                    }}></div>
                </div>

                {/* Elevation Example */}
                 <div className="flex flex-col items-center col-span-2 sm:col-span-1">
                    <p style={{...applyTextStyle(fonts.materialTextStyles.labelSmall), marginBottom: '0.25rem'}}>Elevation (level3)</p>
                    <div style={{ 
                        width: '80px', 
                        height: '50px', 
                        backgroundColor: colors.surfaceContainerHigh || colors.surface, 
                        borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'md', 8)}px`,
                        boxShadow: getStringPropertyValue(properties.elevation, 'level3', '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)'),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.5rem',
                        textAlign: 'center'
                    }}>
                        <span style={applyTextStyle(fonts.materialTextStyles.bodySmall)}>Card</span>
                    </div>
                </div>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ThemePreview;
