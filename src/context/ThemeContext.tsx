// src/context/ThemeContext.tsx
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ThemeConfiguration, MaterialColors, ThemeFonts, ThemeProperties, ThemeGradient } from '@/types/theme';
import { INITIAL_THEME_CONFIG } from '@/lib/consts';

interface ThemeContextType {
  themeConfig: ThemeConfiguration;
  updateColor: (colorName: keyof MaterialColors, value: string) => void;
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
  const [themeConfig, setThemeConfig] = useState<ThemeConfiguration>(INITIAL_THEME_CONFIG);

  const updateColor = useCallback((colorName: keyof MaterialColors, value: string) => {
    setThemeConfig(prevConfig => ({
      ...prevConfig,
      colors: {
        ...prevConfig.colors,
        [colorName]: value,
      },
    }));
  }, []);

  const updateFont = useCallback((fontRole: keyof ThemeFonts, value: string) => {
    setThemeConfig(prevConfig => ({
      ...prevConfig,
      fonts: {
        ...prevConfig.fonts,
        [fontRole]: value,
      },
    }));
  }, []);

  const updateProperty = useCallback(
    <K extends keyof ThemeProperties, V extends ThemeProperties[K]>(
      propertyGroup: K,
      subKey: keyof V,
      value: V[keyof V]
    ) => {
      setThemeConfig(prevConfig => ({
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
    []
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
      setThemeConfig((prevConfig) => {
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
    []
  );

  const updateGradient = useCallback((index: number, newGradientData: Partial<ThemeGradient>) => {
    setThemeConfig(prevConfig => {
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
  }, []);

  const addGradient = useCallback(() => {
    setThemeConfig(prevConfig => ({
      ...prevConfig,
      properties: {
        ...prevConfig.properties,
        gradients: [
          ...prevConfig.properties.gradients,
          { name: 'New Gradient', type: 'linear', direction: 'to right', colors: ['#FFFFFF', '#000000'] }
        ]
      }
    }));
  }, []);

  const removeGradient = useCallback((index: number) => {
    setThemeConfig(prevConfig => ({
      ...prevConfig,
      properties: {
        ...prevConfig.properties,
        gradients: prevConfig.properties.gradients.filter((_, i) => i !== index)
      }
    }));
  }, []);

  const resetTheme = useCallback(() => {
    setThemeConfig(INITIAL_THEME_CONFIG);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
        themeConfig, 
        updateColor, 
        updateFont, 
        updateProperty, 
        updateNestedProperty,
        updateGradient,
        addGradient,
        removeGradient,
        resetTheme,
        setThemeConfig
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
