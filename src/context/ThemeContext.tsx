
// src/context/ThemeContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { 
  ThemeConfiguration, 
  MaterialColors, 
  ThemeFonts, 
  ThemeProperties, 
  ThemeGradient,
  ThemeSpacing,
  ThemeBorderRadius,
  ThemeBorderWidth,
  ThemeOpacity,
  ThemeElevation,
  CustomStringPropertyItem, // Changed from CustomPropertyItem
  CustomNumericPropertyItem
} from '@/types/theme';
import { INITIAL_THEME_CONFIG } from '@/lib/consts';
import { generateMaterialColorsFromSeed } from '@/lib/colorUtils';

// Adjusted to handle both string and numeric custom properties
type PropertyGroupKey = keyof Pick<ThemeProperties, 'spacing' | 'borderRadius' | 'borderWidth' | 'opacity' | 'elevation'>;
type AnyCustomPropertyItem = CustomStringPropertyItem | CustomNumericPropertyItem;


interface ThemeContextType {
  themeConfig: ThemeConfiguration;
  updateColor: (colorName: keyof MaterialColors, value: string) => void;
  generateAndApplyColorsFromSeed: (seedValue: string) => void;
  updateFont: (fontRole: keyof ThemeFonts, value: string) => void;
  
  updatePropertyListItem: (
    groupKey: PropertyGroupKey,
    itemIndex: number,
    newItemData: AnyCustomPropertyItem // Uses the union type
  ) => void;
  addPropertyListItem: (
    groupKey: PropertyGroupKey,
    newItemData: AnyCustomPropertyItem // Uses the union type
  ) => void;
  removePropertyListItem: (
    groupKey: PropertyGroupKey,
    itemIndex: number
  ) => void;

  updateGradient: (index: number, newGradient: Partial<ThemeGradient>) => void;
  addGradient: () => void;
  removeGradient: (index: number) => void;
  resetTheme: () => void;
  setThemeConfig: (config: ThemeConfiguration) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themeConfig, setThemeConfigInternal] = useState<ThemeConfiguration>(() => {
    const initialSeed = INITIAL_THEME_CONFIG.colors.seedColor;
    const generatedColors = generateMaterialColorsFromSeed(initialSeed);
    return {
      ...INITIAL_THEME_CONFIG,
      colors: {
        ...INITIAL_THEME_CONFIG.colors, 
        ...generatedColors,            
        seedColor: initialSeed,        
      },
    };
  });

  const updateThemeConfigState = setThemeConfigInternal;


  const updateColor = useCallback((colorName: keyof MaterialColors, value: string) => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      colors: {
        ...prevConfig.colors,
        [colorName]: value,
      },
    }));
  }, [updateThemeConfigState]);

  const generateAndApplyColorsFromSeed = useCallback((seedValue: string) => {
    updateThemeConfigState(prevConfig => {
      const generated = generateMaterialColorsFromSeed(seedValue);
      const newColors = {
        ...prevConfig.colors, 
        ...generated,        
        seedColor: seedValue, 
      };
      return {
        ...prevConfig,
        colors: newColors,
      };
    });
  }, [updateThemeConfigState]);

  const updateFont = useCallback((fontRole: keyof ThemeFonts, value: string) => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      fonts: {
        ...prevConfig.fonts,
        [fontRole]: value,
      },
    }));
  }, [updateThemeConfigState]);

  const updatePropertyListItem = useCallback(
    (
      groupKey: PropertyGroupKey,
      itemIndex: number,
      newItemData: AnyCustomPropertyItem
    ) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        const updatedGroup = [...currentGroup];
        updatedGroup[itemIndex] = newItemData;
        return {
          ...prevConfig,
          properties: {
            ...prevConfig.properties,
            [groupKey]: updatedGroup,
          },
        };
      });
    },
    [updateThemeConfigState]
  );

  const addPropertyListItem = useCallback(
    (
      groupKey: PropertyGroupKey,
      newItemData: AnyCustomPropertyItem
    ) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        return {
          ...prevConfig,
          properties: {
            ...prevConfig.properties,
            [groupKey]: [...currentGroup, newItemData],
          },
        };
      });
    },
    [updateThemeConfigState]
  );

  const removePropertyListItem = useCallback(
    (
      groupKey: PropertyGroupKey,
      itemIndex: number
    ) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        const updatedGroup = currentGroup.filter((_, index) => index !== itemIndex);
        return {
          ...prevConfig,
          properties: {
            ...prevConfig.properties,
            [groupKey]: updatedGroup,
          },
        };
      });
    },
    [updateThemeConfigState]
  );
  

  const updateGradient = useCallback((index: number, newGradientData: Partial<ThemeGradient>) => {
    updateThemeConfigState(prevConfig => {
      const newGradients = [...prevConfig.properties.gradients];
      newGradients[index] = { ...newGradients[index], ...newGradientData };
      return {
        ...prevConfig,
        properties: {
          ...prevConfig.properties,
          gradients: newGradients,
        },
      };
    });
  }, [updateThemeConfigState]);

  const addGradient = useCallback(() => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      properties: {
        ...prevConfig.properties,
        gradients: [
          ...prevConfig.properties.gradients,
          { name: 'New Gradient', type: 'linear', direction: 'to right', colors: ['#FFFFFF', '#000000'] }
        ]
      }
    }));
  }, [updateThemeConfigState]);

  const removeGradient = useCallback((index: number) => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      properties: {
        ...prevConfig.properties,
        gradients: prevConfig.properties.gradients.filter((_, i) => i !== index)
      }
    }));
  }, [updateThemeConfigState]);

  const resetTheme = useCallback(() => {
    const initialSeed = INITIAL_THEME_CONFIG.colors.seedColor;
    const generatedColors = generateMaterialColorsFromSeed(initialSeed);
    updateThemeConfigState({
      ...INITIAL_THEME_CONFIG, 
      colors: {
        ...INITIAL_THEME_CONFIG.colors,
        ...generatedColors,
        seedColor: initialSeed,
      },
    });
  }, [updateThemeConfigState]);
  
  const setContextThemeConfig = useCallback((newConfig: ThemeConfiguration) => {
      updateThemeConfigState(newConfig);
  }, [updateThemeConfigState]);


  return (
    <ThemeContext.Provider value={{ 
        themeConfig, 
        updateColor, 
        generateAndApplyColorsFromSeed,
        updateFont, 
        updatePropertyListItem,
        addPropertyListItem,
        removePropertyListItem,
        updateGradient,
        addGradient,
        removeGradient,
        resetTheme,
        setThemeConfig: setContextThemeConfig
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
