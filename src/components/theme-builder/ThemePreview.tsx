"use client";

import React, { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ThemePreview: React.FC = () => {
  const { themeConfig } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // Ensure component is mounted before applying styles to avoid SSR mismatch
  }, []);

  if (!mounted) {
    // Render a placeholder or null during server-side rendering or before hydration
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
    borderRadius: themeConfig.properties.borderRadius.md,
    boxShadow: themeConfig.properties.elevation.level2,
    transition: 'all 0.3s ease-in-out',
    fontFamily: themeConfig.fonts.secondary,
  };

  const buttonStyle: CSSProperties = {
    backgroundColor: themeConfig.colors.primary,
    color: themeConfig.colors.onPrimaryContainer, // Using onPrimaryContainer for better contrast on primary by default
    padding: `${themeConfig.properties.spacing.sm} ${themeConfig.properties.spacing.md}`,
    borderRadius: themeConfig.properties.borderRadius.sm,
    border: `1px solid ${themeConfig.colors.primaryContainer}`,
    fontFamily: themeConfig.fonts.primary,
    fontWeight: 500,
    transition: 'all 0.3s ease-in-out',
  };

  const textHeadlineStyle: CSSProperties = {
    fontFamily: themeConfig.fonts.primary,
    color: themeConfig.colors.primary,
    transition: 'color 0.3s ease-in-out',
  };
  
  const textBodyStyle: CSSProperties = {
    fontFamily: themeConfig.fonts.secondary,
    color: themeConfig.colors.onSurfaceVariant,
    transition: 'color 0.3s ease-in-out',
  };

  const gradientStyle: CSSProperties = {
    background: themeConfig.properties.gradients[0] ? 
        (themeConfig.properties.gradients[0].type === 'linear' ?
            `linear-gradient(${themeConfig.properties.gradients[0].direction || 'to right'}, ${themeConfig.properties.gradients[0].colors.join(', ')})`
          : `radial-gradient(${themeConfig.properties.gradients[0].shape || 'circle'}, ${themeConfig.properties.gradients[0].colors.join(', ')})`)
        : 'transparent',
    padding: themeConfig.properties.spacing.md,
    borderRadius: themeConfig.properties.borderRadius.sm,
    color: themeConfig.colors.onPrimaryContainer, // Assuming gradient uses primary-like colors
    textAlign: 'center',
    transition: 'background 0.3s ease-in-out',
  }


  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Theme Preview</CardTitle>
      </CardHeader>
      <CardContent style={previewCardStyle} className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl mb-2" style={textHeadlineStyle}>
            Primary Headline
          </h3>
          <p className="text-base" style={textBodyStyle}>
            This is body text using the secondary font. It shows how general content will appear.
            The quick brown fox jumps over the lazy dog.
          </p>
        </div>

        <Separator style={{backgroundColor: themeConfig.colors.outlineVariant}}/>
        
        <div className="flex flex-wrap gap-4 items-center">
          <Button style={buttonStyle}>Primary Button</Button>
          <Button variant="outline" style={{
            borderColor: themeConfig.colors.outline,
            color: themeConfig.colors.primary,
            borderRadius: themeConfig.properties.borderRadius.sm,
            fontFamily: themeConfig.fonts.primary,
            transition: 'all 0.3s ease-in-out',
            padding: `${themeConfig.properties.spacing.sm} ${themeConfig.properties.spacing.md}`,
          }}>
            Outline Button
          </Button>
           <div style={{
              backgroundColor: themeConfig.colors.errorContainer,
              color: themeConfig.colors.onErrorContainer,
              padding: themeConfig.properties.spacing.sm,
              borderRadius: themeConfig.properties.borderRadius.xs,
              border: `1px solid ${themeConfig.colors.error}`,
              fontFamily: themeConfig.fonts.secondary,
              transition: 'all 0.3s ease-in-out',
           }}>
            Error Message Area
           </div>
        </div>

        <Separator style={{backgroundColor: themeConfig.colors.outlineVariant}}/>
        
        {themeConfig.properties.gradients.length > 0 && (
            <div style={gradientStyle}>
                <p style={{fontFamily: themeConfig.fonts.primary}}>Gradient Example</p>
            </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div style={{
                padding: themeConfig.properties.spacing.md,
                border: `${themeConfig.properties.borderWidth.medium} solid ${themeConfig.colors.secondaryContainer}`,
                borderRadius: themeConfig.properties.borderRadius.lg,
                backgroundColor: themeConfig.colors.surfaceVariant,
                boxShadow: themeConfig.properties.elevation.level1,
                transition: 'all 0.3s ease-in-out',
            }}>
                <p style={{fontFamily: themeConfig.fonts.secondary, color: themeConfig.colors.onSurfaceVariant}}>
                    Component with Radius & Border (Lg)
                </p>
            </div>
            <div style={{
                padding: themeConfig.properties.spacing.sm,
                border: `${themeConfig.properties.borderWidth.thin} solid ${themeConfig.colors.tertiaryContainer}`,
                borderRadius: themeConfig.properties.borderRadius.xs,
                backgroundColor: themeConfig.colors.tertiaryContainer,
                color: themeConfig.colors.onTertiaryContainer,
                boxShadow: themeConfig.properties.elevation.level3,
                opacity: themeConfig.properties.opacity.hover, // Example of opacity, though hover is usually dynamic
                transition: 'all 0.3s ease-in-out',
            }}>
                <p style={{fontFamily: themeConfig.fonts.secondary}}>
                    Another Component (Xs Radius, Hover Opacity)
                </p>
            </div>
        </div>

      </CardContent>
    </Card>
  );
};

export default ThemePreview;
