
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  ThemeConfiguration,
  MaterialColors,
  ColorModeValues,
  ThemeFonts,
  ThemeProperties,
  ThemeGradient,
  CustomStringPropertyItem,
  CustomNumericPropertyItem,
  MaterialTextStyleKey,
  TextStyleProperties,
  FontWeightValue
} from '@/types/theme';
import { INITIAL_THEME_CONFIG, DEFAULT_MATERIAL_TEXT_STYLES, DEFAULT_COLORS } from '@/lib/consts';
import { generateMaterialColorsFromSeed, hexToHsl } from '@/lib/colorUtils';

type PropertyGroupKey = keyof Pick<ThemeProperties, 'spacing' | 'borderRadius' | 'borderWidth' | 'opacity' | 'elevation'>;
type AnyCustomPropertyItem = CustomStringPropertyItem | CustomNumericPropertyItem;
type ColorMode = 'light' | 'dark';
type MaterialColorRole = keyof Omit<MaterialColors, 'seedColor'>;


interface ThemeContextType {
  themeConfig: ThemeConfiguration;
  activeMode: ColorMode;
  toggleActiveMode: () => void;
  updateColor: (colorName: MaterialColorRole, mode: ColorMode, value: string) => void;
  getActiveColorValue: (colorSpec: ColorModeValues) => string;
  generateAndApplyColorsFromSeed: (seedValue: string) => void;
  
  updateMaterialTextStyle: (
    styleName: MaterialTextStyleKey,
    propertyName: keyof TextStyleProperties,
    value: string | number | FontWeightValue
  ) => void;
  addCustomTextStyle: (name?: string) => void;
  updateCustomTextStyleName: (index: number, newName: string) => void;
  updateCustomTextStyleProperty: (
    index: number,
    propertyName: keyof TextStyleProperties,
    value: string | number | FontWeightValue
  ) => void;
  removeCustomTextStyle: (index: number) => void;

  updatePropertyListItem: (
    groupKey: PropertyGroupKey,
    itemIndex: number,
    newItemData: AnyCustomPropertyItem
  ) => void;
  addPropertyListItem: (
    groupKey: PropertyGroupKey,
    newItemData: AnyCustomPropertyItem
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

// Helper function to map your color role names to CSS variable base names
// (e.g., primaryContainer -> primary-container)
const colorRoleToCssVarBase = (role: string): string => {
  return role.replace(/([A-Z])/g, '-$1').toLowerCase();
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [activeMode, setActiveMode] = useState<ColorMode>('light');
  
  const [themeConfig, setThemeConfigInternal] = useState<ThemeConfiguration>(() => {
    const initialSeed = INITIAL_THEME_CONFIG.colors.seedColor;
    const generatedM3Colors = generateMaterialColorsFromSeed(initialSeed);
    return {
      ...INITIAL_THEME_CONFIG,
      colors: {
        ...INITIAL_THEME_CONFIG.colors, // This includes background, foreground, accent from consts
        ...generatedM3Colors, // This overwrites M3 roles like primary, secondary, etc.
        seedColor: initialSeed,
      },
      fonts: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.fonts)),
      properties: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.properties)),
    };
  });

  const updateThemeConfigState = setThemeConfigInternal;

  const toggleActiveMode = useCallback(() => {
    setActiveMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  }, []);

  const getActiveColorValue = useCallback((colorSpec: ColorModeValues): string => {
    return colorSpec[activeMode];
  }, [activeMode]);


  useEffect(() => {
    const root = document.documentElement;
    if (activeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update CSS HSL variables
    // For ShadCN/Tailwind CSS variables like --primary, --background, etc.
    const shadcnColorMap: Record<string, MaterialColorRole | undefined> = {
      'primary': 'primary', 'primary-foreground': 'onPrimaryContainer', // Adjusted based on typical contrast needs
      'secondary': 'secondary', 'secondary-foreground': 'onSecondaryContainer',
      'background': 'background', 'foreground': 'onSurface', // Map general background/foreground
      'card': 'surfaceVariant', 'card-foreground': 'onSurfaceVariant', // Example mapping for card
      'popover': 'surface', 'popover-foreground': 'onSurface', // Example mapping for popover
      'muted': 'surfaceVariant', 'muted-foreground': 'onSurfaceVariant', // Muted often maps to variants
      'accent': 'accent', 'accent-foreground': 'onPrimary', // Accent foreground might be onPrimary or similar high contrast
      'destructive': 'error', 'destructive-foreground': 'onErrorContainer',
      'border': 'outline',
      'input': 'surfaceVariant', // Input background
      'ring': 'primary', // Ring color often primary
    };
    
    (Object.keys(shadcnColorMap) as (keyof typeof shadcnColorMap)[]).forEach(cssVarBase => {
      const roleName = shadcnColorMap[cssVarBase];
      if (roleName && themeConfig.colors[roleName]) {
        const colorSpec = themeConfig.colors[roleName] as ColorModeValues | undefined; // Ensure this is ColorModeValues
        if (colorSpec && typeof colorSpec === 'object' && 'light' in colorSpec && 'dark' in colorSpec) {
          const lightHsl = hexToHsl(colorSpec.light);
          const darkHsl = hexToHsl(colorSpec.dark);

          if (lightHsl) {
            root.style.setProperty(`--${cssVarBase}-light-h`, `${lightHsl.h}`);
            root.style.setProperty(`--${cssVarBase}-light-s`, `${lightHsl.s}%`);
            root.style.setProperty(`--${cssVarBase}-light-l`, `${lightHsl.l}%`);
          }
          if (darkHsl) {
            root.style.setProperty(`--${cssVarBase}-dark-h`, `${darkHsl.h}`);
            root.style.setProperty(`--${cssVarBase}-dark-s`, `${darkHsl.s}%`);
            root.style.setProperty(`--${cssVarBase}-dark-l`, `${darkHsl.l}%`);
          }
        }
      }
    });

  }, [themeConfig.colors, activeMode]);


  const updateColor = useCallback((colorName: MaterialColorRole, mode: ColorMode, value: string) => {
    updateThemeConfigState(prevConfig => {
      const newColors = { ...prevConfig.colors };
      const currentColorSpec = newColors[colorName];

      if (currentColorSpec && typeof currentColorSpec === 'object' && 'light' in currentColorSpec && 'dark' in currentColorSpec) {
         // Create a new object for the specific color role to ensure re-render
        newColors[colorName] = {
          ...currentColorSpec,
          [mode]: value,
        };
      }
      return { ...prevConfig, colors: newColors };
    });
  }, [updateThemeConfigState]);

  const generateAndApplyColorsFromSeed = useCallback((seedValue: string) => {
    updateThemeConfigState(prevConfig => {
      const generatedM3Colors = generateMaterialColorsFromSeed(seedValue);
      return {
        ...prevConfig,
        colors: {
          ...prevConfig.colors, // Retain existing background, foreground, accent unless they are also M3 generated
          ...generatedM3Colors,
          seedColor: seedValue,
        },
      };
    });
  }, [updateThemeConfigState]);

  const updateMaterialTextStyle = useCallback(
    (styleName: MaterialTextStyleKey, propertyName: keyof TextStyleProperties, value: string | number | FontWeightValue) => {
      updateThemeConfigState(prevConfig => ({
        ...prevConfig,
        fonts: {
          ...prevConfig.fonts,
          materialTextStyles: {
            ...prevConfig.fonts.materialTextStyles,
            [styleName]: {
              ...prevConfig.fonts.materialTextStyles[styleName],
              [propertyName]: value,
            },
          },
        },
      }));
    },
    [updateThemeConfigState]
  );

  const addCustomTextStyle = useCallback((name: string = 'newCustomStyle') => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      fonts: {
        ...prevConfig.fonts,
        customTextStyles: [
          ...prevConfig.fonts.customTextStyles,
          {
            name: name + (prevConfig.fonts.customTextStyles.length + 1),
            style: { ...DEFAULT_MATERIAL_TEXT_STYLES.bodyMedium },
          },
        ],
      },
    }));
  }, [updateThemeConfigState]);

  const updateCustomTextStyleName = useCallback((index: number, newName: string) => {
    updateThemeConfigState(prevConfig => {
      const newCustomStyles = [...prevConfig.fonts.customTextStyles];
      if (newCustomStyles[index]) {
        newCustomStyles[index] = { ...newCustomStyles[index], name: newName };
      }
      return {
        ...prevConfig,
        fonts: { ...prevConfig.fonts, customTextStyles: newCustomStyles },
      };
    });
  }, [updateThemeConfigState]);
  
  const updateCustomTextStyleProperty = useCallback(
    (index: number, propertyName: keyof TextStyleProperties, value: string | number | FontWeightValue) => {
      updateThemeConfigState(prevConfig => {
        const newCustomStyles = [...prevConfig.fonts.customTextStyles];
        if (newCustomStyles[index]) {
          newCustomStyles[index] = {
            ...newCustomStyles[index],
            style: {
              ...newCustomStyles[index].style,
              [propertyName]: value,
            },
          };
        }
        return {
          ...prevConfig,
          fonts: { ...prevConfig.fonts, customTextStyles: newCustomStyles },
        };
      });
    },
    [updateThemeConfigState]
  );

  const removeCustomTextStyle = useCallback((index: number) => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      fonts: {
        ...prevConfig.fonts,
        customTextStyles: prevConfig.fonts.customTextStyles.filter((_, i) => i !== index),
      },
    }));
  }, [updateThemeConfigState]);

  const updatePropertyListItem = useCallback(
    (groupKey: PropertyGroupKey, itemIndex: number, newItemData: AnyCustomPropertyItem) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        const updatedGroup = [...currentGroup];
        updatedGroup[itemIndex] = newItemData;
        return {
          ...prevConfig,
          properties: { ...prevConfig.properties, [groupKey]: updatedGroup },
        };
      });
    }, [updateThemeConfigState]
  );

  const addPropertyListItem = useCallback(
    (groupKey: PropertyGroupKey, newItemData: AnyCustomPropertyItem) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        return {
          ...prevConfig,
          properties: { ...prevConfig.properties, [groupKey]: [...currentGroup, newItemData] },
        };
      });
    }, [updateThemeConfigState]
  );

  const removePropertyListItem = useCallback(
    (groupKey: PropertyGroupKey, itemIndex: number) => {
      updateThemeConfigState(prevConfig => {
        const currentGroup = prevConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;
        const updatedGroup = currentGroup.filter((_, index) => index !== itemIndex);
        return {
          ...prevConfig,
          properties: { ...prevConfig.properties, [groupKey]: updatedGroup },
        };
      });
    }, [updateThemeConfigState]
  );

  const updateGradient = useCallback((index: number, newGradientData: Partial<ThemeGradient>) => {
    updateThemeConfigState(prevConfig => {
      const newGradients = [...prevConfig.properties.gradients];
      newGradients[index] = { ...newGradients[index], ...newGradientData };
      return {
        ...prevConfig,
        properties: { ...prevConfig.properties, gradients: newGradients },
      };
    });
  }, [updateThemeConfigState]);

  const addGradient = useCallback(() => {
    updateThemeConfigState(prevConfig => {
      // Use default light mode colors for the new gradient initially
      const primaryLight = prevConfig.colors.primary?.light || DEFAULT_COLORS.primary.light;
      const secondaryLight = prevConfig.colors.secondary?.light || DEFAULT_COLORS.secondary.light;
      return {
        ...prevConfig,
        properties: {
          ...prevConfig.properties,
          gradients: [
            ...prevConfig.properties.gradients,
            { name: 'New Gradient', type: 'linear', direction: 'to right', colors: [primaryLight, secondaryLight] }
          ]
        }
      }
    });
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
    const generatedM3Colors = generateMaterialColorsFromSeed(initialSeed);
    updateThemeConfigState({
      ...INITIAL_THEME_CONFIG,
      colors: {
        ...INITIAL_THEME_CONFIG.colors, // Includes background, foreground, accent defaults
        ...generatedM3Colors,         // Overwrites M3 roles
        seedColor: initialSeed,
      },
      fonts: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.fonts)),
      properties: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.properties)),
    });
    setActiveMode('light'); // Reset to light mode
  }, [updateThemeConfigState]);

  const setContextThemeConfig = useCallback((newConfig: ThemeConfiguration) => {
    updateThemeConfigState(newConfig);
  }, [updateThemeConfigState]);


  return (
    <ThemeContext.Provider value={{
      themeConfig,
      activeMode,
      toggleActiveMode,
      updateColor,
      getActiveColorValue,
      generateAndApplyColorsFromSeed,
      updateMaterialTextStyle,
      addCustomTextStyle,
      updateCustomTextStyleName,
      updateCustomTextStyleProperty,
      removeCustomTextStyle,
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
