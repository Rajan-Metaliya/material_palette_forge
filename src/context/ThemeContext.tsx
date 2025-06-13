

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
  FontWeightValue,
  CustomColorItem
} from '@/types/theme';
import { INITIAL_THEME_CONFIG, DEFAULT_MATERIAL_TEXT_STYLES, DEFAULT_COLORS, DEFAULT_FONTS, DEFAULT_CUSTOM_COLORS } from '@/lib/consts';
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
    value: string | number | FontWeightValue | ColorModeValues | undefined,
    colorMode?: ColorMode
  ) => void;
  addCustomTextStyle: (name?: string) => void;
  updateCustomTextStyleName: (index: number, newName: string) => void;
  updateCustomTextStyleProperty: (
    index: number,
    propertyName: keyof TextStyleProperties,
    value: string | number | FontWeightValue | ColorModeValues | undefined,
    colorMode?: ColorMode
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

  addCustomColor: (name?: string, initialLightValue?: string, initialDarkValue?: string) => void;
  updateCustomColorName: (index: number, newName: string) => void;
  updateCustomColorValue: (index: number, mode: ColorMode, newValue: string) => void;
  removeCustomColor: (index: number) => void;

  resetTheme: () => void;
  setThemeConfig: (config: ThemeConfiguration) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [activeMode, setActiveMode] = useState<ColorMode>('light');

  const [themeConfig, setThemeConfigInternal] = useState<ThemeConfiguration>(() => {
    const initialSeed = INITIAL_THEME_CONFIG.colors.seedColor;
    const generatedM3Colors = generateMaterialColorsFromSeed(initialSeed);
    return {
      ...INITIAL_THEME_CONFIG,
      colors: {
        ...INITIAL_THEME_CONFIG.colors,
        ...generatedM3Colors,
        seedColor: initialSeed,
      },
      fonts: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.fonts)),
      properties: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.properties)),
      customColors: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.customColors)),
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

    const shadcnColorMap: Record<string, MaterialColorRole | undefined> = {
      'primary': 'primary', 'primary-foreground': 'onPrimaryContainer',
      'secondary': 'secondary', 'secondary-foreground': 'onSecondaryContainer',
      'background': 'background', 'foreground': 'onSurface',
      'card': 'surfaceVariant', 'card-foreground': 'onSurfaceVariant',
      'popover': 'surface', 'popover-foreground': 'onSurface',
      'muted': 'surfaceVariant', 'muted-foreground': 'onSurfaceVariant',
      'accent': 'accent', 'accent-foreground': 'onPrimary',
      'destructive': 'error', 'destructive-foreground': 'onErrorContainer',
      'border': 'outline',
      'input': 'surfaceVariant',
      'ring': 'primary',
    };

    (Object.keys(shadcnColorMap) as (keyof typeof shadcnColorMap)[]).forEach(cssVarBase => {
      const roleName = shadcnColorMap[cssVarBase];
      if (roleName && themeConfig.colors[roleName]) {
        const colorSpec = themeConfig.colors[roleName] as ColorModeValues | undefined;
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
          ...prevConfig.colors,
          ...generatedM3Colors,
          seedColor: seedValue,
        },
      };
    });
  }, [updateThemeConfigState]);

  const updateMaterialTextStyle = useCallback(
    (
      styleName: MaterialTextStyleKey,
      propertyName: keyof TextStyleProperties,
      value: string | number | FontWeightValue | ColorModeValues | undefined,
      colorMode?: ColorMode
    ) => {
      updateThemeConfigState(prevConfig => {
        const newMaterialTextStyles = { ...prevConfig.fonts.materialTextStyles };
        const currentStyle = { ...newMaterialTextStyles[styleName] };

        if (propertyName === 'color' && colorMode && typeof value === 'string') {
          currentStyle.color = {
            ...(currentStyle.color || DEFAULT_MATERIAL_TEXT_STYLES[styleName].color), // Ensure color object exists
            [colorMode]: value,
          } as ColorModeValues;
        } else if (propertyName !== 'color') {
          (currentStyle[propertyName] as any) = value;
        }

        newMaterialTextStyles[styleName] = currentStyle;
        return {
          ...prevConfig,
          fonts: {
            ...prevConfig.fonts,
            materialTextStyles: newMaterialTextStyles,
          },
        };
      });
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
            style: {
              ...DEFAULT_MATERIAL_TEXT_STYLES.bodyMedium, // Base style
              color: JSON.parse(JSON.stringify(DEFAULT_MATERIAL_TEXT_STYLES.bodyMedium.color)) // Deep copy default color
            },
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
    (
      index: number,
      propertyName: keyof TextStyleProperties,
      value: string | number | FontWeightValue | ColorModeValues | undefined,
      colorMode?: ColorMode
    ) => {
      updateThemeConfigState(prevConfig => {
        const newCustomStyles = [...prevConfig.fonts.customTextStyles];
        if (newCustomStyles[index]) {
          const currentStyle = { ...newCustomStyles[index].style };
          if (propertyName === 'color' && colorMode && typeof value === 'string') {
            currentStyle.color = {
              ...(currentStyle.color || DEFAULT_MATERIAL_TEXT_STYLES.bodyMedium.color), // Ensure color object exists
              [colorMode]: value,
            } as ColorModeValues;
          } else if (propertyName !== 'color') {
            (currentStyle[propertyName] as any) = value;
          }
          newCustomStyles[index] = {
            ...newCustomStyles[index],
            style: currentStyle,
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

  // Custom Colors Management
  const addCustomColor = useCallback((name: string = 'newCustomColor', initialLightValue: string = '#CCCCCC', initialDarkValue: string = '#333333') => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      customColors: [
        ...prevConfig.customColors,
        {
          name: name + (prevConfig.customColors.length + 1),
          value: { light: initialLightValue, dark: initialDarkValue },
        },
      ],
    }));
  }, [updateThemeConfigState]);

  const updateCustomColorName = useCallback((index: number, newName: string) => {
    updateThemeConfigState(prevConfig => {
      const newCustomColors = [...prevConfig.customColors];
      if (newCustomColors[index]) {
        newCustomColors[index] = { ...newCustomColors[index], name: newName };
      }
      return { ...prevConfig, customColors: newCustomColors };
    });
  }, [updateThemeConfigState]);

  const updateCustomColorValue = useCallback((index: number, mode: ColorMode, newValue: string) => {
    updateThemeConfigState(prevConfig => {
      const newCustomColors = [...prevConfig.customColors];
      if (newCustomColors[index]) {
        const currentColorValue = { ...newCustomColors[index].value };
        currentColorValue[mode] = newValue;
        newCustomColors[index] = { ...newCustomColors[index], value: currentColorValue };
      }
      return { ...prevConfig, customColors: newCustomColors };
    });
  }, [updateThemeConfigState]);

  const removeCustomColor = useCallback((index: number) => {
    updateThemeConfigState(prevConfig => ({
      ...prevConfig,
      customColors: prevConfig.customColors.filter((_, i) => i !== index),
    }));
  }, [updateThemeConfigState]);


  const resetTheme = useCallback(() => {
    const initialSeed = INITIAL_THEME_CONFIG.colors.seedColor;
    const generatedM3Colors = generateMaterialColorsFromSeed(initialSeed);
    updateThemeConfigState({
      ...INITIAL_THEME_CONFIG,
      colors: {
        ...INITIAL_THEME_CONFIG.colors,
        ...generatedM3Colors,
        seedColor: initialSeed,
      },
      fonts: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.fonts)),
      properties: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.properties)),
      customColors: JSON.parse(JSON.stringify(INITIAL_THEME_CONFIG.customColors)),
    });
    setActiveMode('light');
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
      addCustomColor,
      updateCustomColorName,
      updateCustomColorValue,
      removeCustomColor,
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
