

"use client";

import React, { CSSProperties, useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { TextStyleProperties, FontWeightValue, CustomNumericPropertyItem, CustomStringPropertyItem, MaterialColors, ColorModeValues } from '@/types/theme';
import { COMMON_WEB_FONTS } from '@/lib/consts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import {
  UserCircle,
  Lightbulb,
  ChevronLeft,
  MoreVertical,
  CheckSquare,
  Leaf,
  Flower2,
  Settings2,
  ClipboardList,
  Sprout,
  Sun,
  Droplets,
  Scissors
} from 'lucide-react';

const getFontStack = (fontFamilyName: string): string => {
  const font = COMMON_WEB_FONTS.find(f => f.value === fontFamilyName);
  return font ? font.stack : fontFamilyName;
};

const getCssFontWeight = (fontWeight: FontWeightValue): string | number => {
  if (fontWeight === 'normal') return 400;
  if (fontWeight === 'bold') return 700;
  return fontWeight;
};

const applyTextStyle = (styleProps?: TextStyleProperties, defaultColor?: string, activeMode?: 'light' | 'dark'): CSSProperties => {
  if (!styleProps) return {};
  
  let textColor = defaultColor;
  if (styleProps.color && activeMode) {
    textColor = styleProps.color[activeMode] || defaultColor;
  }

  const cssStyle: CSSProperties = {
    fontFamily: getFontStack(styleProps.fontFamily),
    fontSize: `${styleProps.fontSize}px`,
    fontWeight: getCssFontWeight(styleProps.fontWeight),
    letterSpacing: `${styleProps.letterSpacing}px`,
    transition: 'color 0.2s ease-out, background-color 0.2s ease-out',
  };
  if (styleProps.lineHeight !== undefined) {
    cssStyle.lineHeight = styleProps.lineHeight;
  }
  if (textColor) {
    cssStyle.color = textColor;
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

interface PhoneScreenProps {
  children: React.ReactNode;
  colors: MaterialColors; 
  activeMode: 'light' | 'dark';
  className?: string;
}

const PhoneScreen: React.FC<PhoneScreenProps> = ({ children, colors, activeMode, className }) => {
  const { themeConfig } = useTheme(); 

  const C = (role: keyof MaterialColors) => (colors[role] as ColorModeValues)[activeMode];

  return (
    <div
      className={`w-[280px] h-[550px] rounded-xl shadow-lg overflow-hidden flex flex-col ${className}`}
      style={{
        backgroundColor: C('surface'),
        border: `1px solid ${C('outline')}`,
        boxShadow: getStringPropertyValue(themeConfig.properties.elevation, 'level3', '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px rgba(0,0,0,0.3)'),
      }}
    >
      <div className="px-3 pt-2 pb-1 flex justify-between items-center" >
        <span style={applyTextStyle(themeConfig.fonts.materialTextStyles.labelSmall, C('onSurfaceVariant'), activeMode)}>4:51</span>
        <div className="flex space-x-1" style={{color: C('onSurfaceVariant')}}>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M16 4.222V2C16 1.448 15.552 1 15 1H9C8.448 1 8 1.448 8 2V4.222C5.908 4.712 4.148 6.012 3.031 7.732L2.223 9.01C1.948 9.471 2.059 10.057 2.457 10.39L11.5 18.064C11.771 18.299 12.229 18.299 12.5 18.064L21.543 10.39C21.941 10.057 22.052 9.471 21.777 9.01L20.969 7.732C19.852 6.012 18.092 4.712 16 4.222ZM12 16.299L4.473 9.874L5.132 8.815C6.012 7.424 7.464 6.423 9 6.06V11H15V6.06C16.536 6.423 17.988 7.424 18.868 8.815L19.527 9.874L12 16.299Z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21H21V1H1V21ZM3 3H19V19H3V3Z"/></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M4 19H8V5H4V19ZM10 19H14V5H10V19ZM16 19H20V5H16V19Z"/></svg>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
        {children}
      </div>
    </div>
  );
};


const ThemePreview: React.FC = () => {
  const { themeConfig, activeMode } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
        <Card className="min-h-[600px]">
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
  const C = (role: keyof MaterialColors) => (colors[role] as ColorModeValues)[activeMode];

  const spacingSm = getNumericPropertyValue(properties.spacing, 'sm', 8);
  const spacingMd = getNumericPropertyValue(properties.spacing, 'md', 16);
  const radiusLg = getNumericPropertyValue(properties.borderRadius, 'lg', 12);
  const radiusXl = getNumericPropertyValue(properties.borderRadius, 'xl', 16);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl" style={applyTextStyle(fonts.materialTextStyles.titleLarge, C('onSurface'), activeMode)}>App Preview</CardTitle>
        <CardDescription style={applyTextStyle(fonts.materialTextStyles.bodySmall, C('onSurfaceVariant'), activeMode)}>
          Live preview of your theme in a mock app ({activeMode} mode).
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col md:flex-row gap-4 items-center justify-center p-4">

        <PhoneScreen colors={colors} activeMode={activeMode}>
          <div className="flex justify-between items-center mb-4">
            <h1 style={applyTextStyle(fonts.materialTextStyles.displayMedium, C('onSurface'), activeMode)}>Today</h1>
            <button
              style={{
                backgroundColor: C('secondaryContainer'),
                borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'full', 9999)}px`,
                padding: `${spacingSm}px`,
              }}
              aria-label="User profile"
            >
              <UserCircle size={20} style={{ color: C('onSecondaryContainer') }} />
            </button>
          </div>

          <div
            style={{
              backgroundColor: C('tertiaryContainer'),
              borderRadius: `${radiusLg}px`,
              padding: `${spacingSm}px ${spacingMd}px`,
              boxShadow: getStringPropertyValue(properties.elevation, 'level1', '0px 1px 2px rgba(0,0,0,0.3)'),
            }}
            className="flex items-center space-x-3 mb-6"
          >
            <Lightbulb size={20} style={{ color: C('tertiary') }}/>
            <p style={applyTextStyle(fonts.materialTextStyles.bodySmall, C('onTertiaryContainer'), activeMode)}>
              During the winter your plants slow down and need less water.
            </p>
          </div>

          {['Living Room', 'Kitchen', 'Bedroom'].map((room, idx) => (
            <div
              key={room}
              style={{
                backgroundColor: C('surfaceVariant'),
                borderRadius: `${radiusXl}px`,
                padding: `${spacingMd}px`,
                boxShadow: getStringPropertyValue(properties.elevation, 'level2', '0px 1px 2px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)'),
              }}
              className="mb-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 style={applyTextStyle(fonts.materialTextStyles.titleLarge, C('primary'), activeMode)}>{room}</h2>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckSquare size={16} style={{ color: C('primary') }}/>
                      <span style={applyTextStyle(fonts.materialTextStyles.bodyMedium, C('onSurfaceVariant'), activeMode)}>Water hoya australis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckSquare size={16} style={{ color: C('primary') }}/>
                      <span style={applyTextStyle(fonts.materialTextStyles.bodyMedium, C('onSurfaceVariant'), activeMode)}>Feed monstera siltepecana</span>
                    </div>
                  </div>
                </div>
                {idx === 0 && <Leaf size={40} style={{color: C('secondary'), opacity: 0.7}} className="-mt-2 -mr-2"/>}
                {idx === 1 && <Flower2 size={40} style={{color: C('tertiary'), opacity: 0.7}} className="-mt-2 -mr-2"/>}
                {idx === 2 && <Sprout size={40} style={{color: C('primary'), opacity: 0.7}} className="-mt-2 -mr-2"/>}
              </div>
            </div>
          ))}
        </PhoneScreen>

        <PhoneScreen colors={colors} activeMode={activeMode}>
          <div className="flex justify-between items-center mb-4">
            <button aria-label="Back" style={{color: C('onSurface')}}>
              <ChevronLeft size={24} />
            </button>
            <h1 style={applyTextStyle(fonts.materialTextStyles.titleLarge, C('onSurface'), activeMode)} className="invisible">Plant Details</h1>
            <button aria-label="More options" style={{color: C('onSurface')}}>
              <MoreVertical size={24} />
            </button>
          </div>

          <h1
            style={applyTextStyle(fonts.materialTextStyles.displaySmall, C('primary'), activeMode)}
            className="text-center mb-3 leading-tight"
          >
            Monstera <br /> Unique
          </h1>

          <div className="mb-6 flex justify-center">
            <Image
              src="https://placehold.co/300x200.png"
              alt="Monstera plant"
              width={220}
              height={150}
              data-ai-hint="house plant"
              style={{
                borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'xl', 24)}px`,
                boxShadow: getStringPropertyValue(properties.elevation, 'level3', '0px 4px 8px rgba(0,0,0,0.15)'),
              }}
              className="object-cover"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: Settings2, title: 'Most Popular', text: 'Popular in store', dataAiHint: 'gear tool' },
              { icon: ClipboardList, title: 'Easy Care', text: 'Great for beginners', dataAiHint: 'clipboard notes' },
              { icon: Sun, title: 'Faux Available', text: 'No maintenance', dataAiHint: 'sun light' },
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: C('tertiaryContainer'),
                  borderRadius: `${radiusLg}px`,
                  padding: `${spacingSm}px`,
                  boxShadow: getStringPropertyValue(properties.elevation, 'level1', '0px 1px 2px rgba(0,0,0,0.3)'),
                }}
                className="text-center flex flex-col items-center"
              >
                <item.icon size={18} style={{ color: C('tertiary'), marginBottom: '4px' }}/>
                <h3 style={applyTextStyle(fonts.materialTextStyles.labelSmall, C('onTertiaryContainer'), activeMode)} className="mb-0.5">
                  {item.title}
                </h3>
                <p style={applyTextStyle(fonts.materialTextStyles.bodySmall, C('onTertiaryContainer'), activeMode)} className="text-xs leading-tight">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <h2 style={applyTextStyle(fonts.materialTextStyles.titleMedium, C('onSurface'), activeMode)} className="mb-2">Care</h2>
          <div className="space-y-2">
            {[
              { icon: Droplets, text: 'Water every 7-10 days' },
              { icon: Sun, text: 'Prefers bright, indirect light' },
              { icon: Scissors, text: 'Prune dead leaves regularly' },
            ].map((item, idx) => (
               <div key={idx} className="flex items-center space-x-2" style={{
                    backgroundColor: C('surfaceVariant'),
                    padding: `${spacingSm}px`,
                    borderRadius: `${getNumericPropertyValue(properties.borderRadius, 'md', 8)}px`,
                }}>
                <item.icon size={16} style={{ color: C('secondary') }}/>
                <span style={applyTextStyle(fonts.materialTextStyles.bodyMedium, C('onSurfaceVariant'), activeMode)}>{item.text}</span>
              </div>
            ))}
          </div>
        </PhoneScreen>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
