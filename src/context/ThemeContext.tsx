// src/context/ThemeContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ThemeConfiguration, MaterialColors, ThemeFonts, ThemeProperties, ThemeGradient } from '@/types/theme';
import { INITIAL_THEME_CONFIG } from '@/lib/consts';
import { generateMaterialColorsFromSeed } from '@/lib/colorUtils';

interface ThemeContextType {
  themeConfig: ThemeConfiguration;
  updateColor: (colorName: keyof MaterialColors, value: string) => void;
  generateAndApplyColorsFromSeed: (seedValue: string) => void;
  updateFont: (fontRole: keyof ThemeFonts, value: string) => void;
  updateProperty: <K extends keyof ThemeProperties, V extends ThemeProperties[K]>(
    propertyGroup: K,
    subKey: keyof V,
    value: V[keyof V]
  ) => void;
  updateNestedProperty: <
    PKey extends keyof ThemeProperties,
    NKey extends keyof ThemeProperties[PKey],
    NNKey extends keyof ThemeProperties[PKey][NKey]
  >(
    propertyGroup: PKey,
    nestedKey: NKey,
    subNestedKey: NNKey,
    value: ThemeProperties[PKey][NKey][NNKey]
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
        ...INITIAL_THEME_CONFIG.colors, // Start with defaults (e.g. error color, seedColor itself)
        ...generatedColors,             // Override with generated colors (primary, secondary etc.)
        seedColor: initialSeed,         // Ensure seedColor is explicitly set from defaults
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
        ...prevConfig.colors, // Keep existing values like error, shadow, scrim if not in `generated`
        ...generated,         // Overwrite with newly generated values
        seedColor: seedValue, // Update the seed color itself
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

  const updateProperty = useCallback(
    <K extends keyof ThemeProperties, V extends ThemeProperties[K]>(
      propertyGroup: K,
      subKey: keyof V,
      value: V[keyof V]
    ) => {
      updateThemeConfigState(prevConfig => ({
        ...prevConfig,
        properties: {
          ...prevConfig.properties,
          [propertyGroup]: {
            ...(prevConfig.properties[propertyGroup] as V),
            [subKey]: value,
          },
        },
      }));
    },
    [updateThemeConfigState]
  );
  
  const updateNestedProperty = useCallback(
    <
      PKey extends keyof ThemeProperties,
      NKey extends keyof ThemeProperties[PKey],
      NNKey extends keyof ThemeProperties[PKey][NKey]
    >(
      propertyGroup: PKey,
      nestedKey: NKey,
      subNestedKey: NNKey,
      value: ThemeProperties[PKey][NKey][NNKey]
    ) => {
      updateThemeConfigState((prevConfig) => {
        const group = prevConfig.properties[propertyGroup];
        const nestedGroup = group[nestedKey] as ThemeProperties[PKey][NKey];
        return {
          ...prevConfig,
          properties: {
            ...prevConfig.properties,
            [propertyGroup]: {
              ...group,
              [nestedKey]: {
                ...nestedGroup,
                [subNestedKey]: value,
              },
            },
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
        updateProperty, 
        updateNestedProperty,
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
