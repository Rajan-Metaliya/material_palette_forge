
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { MaterialColors, ColorModeValues, CustomColorItem } from '@/types/theme';
import ColorInput from './ColorInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CORE_COLOR_ROLES, EXTENDED_COLOR_ROLES, UI_COLOR_INPUT_ORDER, DEFAULT_COLORS } from '@/lib/consts';
import { Gem, Palette, PlusCircle, Trash2, ArrowRight } from 'lucide-react'; // Added ArrowRight
import { useToast } from "@/hooks/use-toast";


interface ColorsSectionProps {
  setActiveTab: (tab: string) => void;
}

const ColorsSection: React.FC<ColorsSectionProps> = ({ setActiveTab }) => {
  const {
    themeConfig,
    updateColor,
    generateAndApplyColorsFromSeed,
    addCustomColor,
    updateCustomColorName,
    updateCustomColorValue,
    removeCustomColor,
    activeMode
  } = useTheme();
  const { toast } = useToast();

  const renderColorInputs = (key: MaterialColorRole) => {
    const colorSpec = themeConfig.colors[key] as ColorModeValues | undefined;
    if (!colorSpec || typeof colorSpec !== 'object' || !('light' in colorSpec)) {
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
    key => themeConfig.colors[key] && (key !== 'shadow' && key !== 'scrim')
  );

  const shadowScrimRoles = UI_COLOR_INPUT_ORDER.filter(key => key === 'shadow' || key === 'scrim');

  const handleCustomColorNameChange = (index: number, newName: string) => {
    if (newName.trim() === '') {
      toast({ title: "Validation Error", description: "Custom color name cannot be empty.", variant: "destructive" });
      return;
    }
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newName)) {
        toast({ title: "Naming Suggestion", description: "Consider using camelCase or snake_case for names for better code generation.", variant: "default" });
    }
    updateCustomColorName(index, newName);
  };


  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Gem className="mr-3 h-5 w-5 text-primary" /> Seed Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-muted-foreground mb-4">
            Define a seed color to automatically generate base Material 3-like palettes for both light and dark modes.
            You can then fine-tune individual colors below.
          </CardDescription>
          <ColorInput
            label="Seed"
            color={themeConfig.colors.seedColor}
            onChange={(newColor) => generateAndApplyColorsFromSeed(newColor)}
          />
        </CardContent>
      </Card>

      <Accordion type="multiple" defaultValue={['core-colors', 'custom-colors']} className="w-full space-y-6">
        <AccordionItem value="core-colors">
          <AccordionTrigger className="text-lg font-semibold">
             <Palette className="mr-3 h-5 w-5 text-primary" /> Core Color Palette
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <CardDescription className="text-sm text-muted-foreground mb-4">
                Edit the primary, secondary, surface, error, and other foundational colors for your theme in both light and dark modes.
            </CardDescription>
            <Accordion type="multiple" defaultValue={['primary-surface-colors']} className="w-full">
                <AccordionItem value="primary-surface-colors">
                <AccordionTrigger className="text-md font-medium">Primary & Surface Colors</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                    {CORE_COLOR_ROLES.map(renderColorInputs)}
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="extended-colors">
                <AccordionTrigger className="text-md font-medium">Container & Variant Colors</AccordionTrigger>
                <AccordionContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 pt-4">
                    {EXTENDED_COLOR_ROLES.map(renderColorInputs)}
                    </div>
                </AccordionContent>
                </AccordionItem>
                <AccordionItem value="builder-ui-colors">
                <AccordionTrigger className="text-md font-medium">Builder UI & Special Colors</AccordionTrigger>
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
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="custom-colors">
            <AccordionTrigger className="text-lg font-semibold">
                <Palette className="mr-3 h-5 w-5 text-accent" /> Custom Theme Colors
            </AccordionTrigger>
            <AccordionContent className="pt-2">
                <CardDescription className="text-sm text-muted-foreground mb-4">
                    Define additional named colors with light and dark variants. These will be available in a custom Flutter ThemeExtension.
                </CardDescription>
                <div className="space-y-4">
                    {themeConfig.customColors.map((item, index) => (
                        <Card key={index} className="p-4 relative">
                             <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-2 right-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                                onClick={() => removeCustomColor(index)}
                                aria-label={`Remove ${item.name}`}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="flex flex-col space-y-3">
                                <div className="flex items-end space-x-3">
                                    <div className="flex-grow space-y-1.5">
                                        <Label htmlFor={`custom-color-name-${index}`}>Name (Variable)</Label>
                                        <Input
                                        id={`custom-color-name-${index}`}
                                        value={item.name}
                                        onChange={(e) => handleCustomColorNameChange(index, e.target.value)}
                                        placeholder="e.g., brandHighlight"
                                        />
                                    </div>
                                    <div
                                        className="w-10 h-10 rounded-md border"
                                        style={{ backgroundColor: item.value[activeMode] }}
                                        title={`Preview: ${item.value[activeMode]}`}
                                    ></div>
                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                                    <ColorInput
                                        label="Light Mode Value"
                                        color={item.value.light}
                                        onChange={(newColor) => updateCustomColorValue(index, 'light', newColor)}
                                    />
                                    <ColorInput
                                        label="Dark Mode Value"
                                        color={item.value.dark}
                                        onChange={(newColor) => updateCustomColorValue(index, 'dark', newColor)}
                                    />
                                </div>
                            </div>
                        </Card>
                    ))}
                    <Button
                        onClick={() => addCustomColor('myCustomColor', DEFAULT_COLORS.accent.light, DEFAULT_COLORS.accent.dark)}
                        variant="outline"
                        className="mt-2"
                    >
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Color
                    </Button>
                </div>
            </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8 flex justify-end">
        <Button onClick={() => setActiveTab("fonts")} className="shadow-md">
          Next: Fonts <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default ColorsSection;
