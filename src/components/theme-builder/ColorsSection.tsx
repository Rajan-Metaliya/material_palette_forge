
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { MaterialColors, ColorModeValues } from '@/types/theme';
import ColorInput from './ColorInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CORE_COLOR_ROLES, EXTENDED_COLOR_ROLES, UI_COLOR_INPUT_ORDER } from '@/lib/consts';
import { Gem } from 'lucide-react';

type MaterialColorRole = keyof Omit<MaterialColors, 'seedColor'>;

const ColorsSection: React.FC = () => {
  const { themeConfig, updateColor, generateAndApplyColorsFromSeed } = useTheme();

  const renderColorInputs = (key: MaterialColorRole) => {
    const colorSpec = themeConfig.colors[key] as ColorModeValues | undefined;
    if (!colorSpec || typeof colorSpec !== 'object' || !('light' in colorSpec)) {
        // Handle cases where a color might not be fully defined for light/dark (e.g. seedColor, or older configs)
        // For 'shadow' and 'scrim', which are often not mode-dependent in hex.
        if (key === 'shadow' || key === 'scrim') {
             const singleColorValue = themeConfig.colors[key]?.light || themeConfig.colors[key]?.dark || '#000000';
             return (
                <div key={`${key}-single`} className="col-span-1 md:col-span-2 lg:col-span-3">
                     <ColorInput
                        label={`${key} (Common)`}
                        color={singleColorValue}
                        onChange={(newColor) => {
                            updateColor(key, 'light', newColor);
                            updateColor(key, 'dark', newColor);
                        }}
                    />
                </div>
             )
        }
        // Fallback for misconfigured colors - render a disabled or placeholder input
        return <div key={key}>Color '{key}' not configured for light/dark modes.</div>;
    }

    return (
      <React.Fragment key={key}>
        <ColorInput
          label={`${key} (Light)`}
          color={colorSpec.light}
          onChange={(newColor) => updateColor(key, 'light', newColor)}
        />
        <ColorInput
          label={`${key} (Dark)`}
          color={colorSpec.dark}
          onChange={(newColor) => updateColor(key, 'dark', newColor)}
        />
      </React.Fragment>
    );
  };
  
  const uiOrderedColorRoles = UI_COLOR_INPUT_ORDER.filter(
    key => themeConfig.colors[key] && (key !== 'shadow' && key !== 'scrim') // Exclude shadow/scrim from main list if handled separately
  );

  const shadowScrimRoles = UI_COLOR_INPUT_ORDER.filter(key => key === 'shadow' || key === 'scrim');


  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Gem className="mr-3 h-5 w-5 text-primary" /> Seed Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Define a seed color to automatically generate base Material 3-like palettes for both light and dark modes.
            You can then fine-tune individual colors below.
          </p>
          <ColorInput
            label="Seed"
            color={themeConfig.colors.seedColor}
            onChange={(newColor) => generateAndApplyColorsFromSeed(newColor)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Color Palette (Light & Dark Modes)</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={['core-colors']} className="w-full">
            <AccordionItem value="core-colors">
              <AccordionTrigger className="text-lg font-semibold">Primary & Surface Colors</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                  {CORE_COLOR_ROLES.map(renderColorInputs)}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="extended-colors">
              <AccordionTrigger className="text-lg font-semibold">Container & Variant Colors</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                  {EXTENDED_COLOR_ROLES.map(renderColorInputs)}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="builder-ui-colors">
              <AccordionTrigger className="text-lg font-semibold">Builder UI & Special Colors</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                    {themeConfig.colors.background && renderColorInputs('background' as MaterialColorRole)}
                    {themeConfig.colors.foreground && renderColorInputs('foreground' as MaterialColorRole)}
                    {themeConfig.colors.accent && renderColorInputs('accent' as MaterialColorRole)}
                    {shadowScrimRoles.map(renderColorInputs)}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </>
  );
};

export default ColorsSection;
