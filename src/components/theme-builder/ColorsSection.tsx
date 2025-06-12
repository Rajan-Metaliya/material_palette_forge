"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { MaterialColors } from '@/types/theme';
import ColorInput from './ColorInput';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CORE_COLOR_KEYS, EXTENDED_COLOR_KEYS } from '@/lib/consts';

const ColorsSection: React.FC = () => {
  const { themeConfig, updateColor } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Colors</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['core-colors']} className="w-full">
          <AccordionItem value="core-colors">
            <AccordionTrigger className="text-lg font-semibold">Core Colors</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {CORE_COLOR_KEYS.map((key) => (
                  <ColorInput
                    key={key}
                    label={key}
                    color={themeConfig.colors[key]}
                    onChange={(newColor) => updateColor(key as keyof MaterialColors, newColor)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="extended-colors">
            <AccordionTrigger className="text-lg font-semibold">Extended Colors (Material 3 Roles)</AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                {EXTENDED_COLOR_KEYS.map((key) => (
                  <ColorInput
                    key={key}
                    label={key}
                    color={themeConfig.colors[key]}
                    onChange={(newColor) => updateColor(key as keyof MaterialColors, newColor)}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ColorsSection;
