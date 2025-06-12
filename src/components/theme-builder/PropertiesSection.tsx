"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ThemeSpacing, ThemeBorderRadius, ThemeBorderWidth, ThemeOpacity, ThemeElevation, ThemeGradient } from '@/types/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorInput from './ColorInput';


const PropertiesSection: React.FC = () => {
  const { themeConfig, updateProperty, updateGradient, addGradient, removeGradient } = useTheme();

  const handlePropertyChange = <K extends keyof ThemeSpacing | keyof ThemeBorderRadius | keyof ThemeBorderWidth | keyof ThemeOpacity | keyof ThemeElevation>(
    group: 'spacing' | 'borderRadius' | 'borderWidth' | 'opacity' | 'elevation',
    key: K,
    value: string | number
  ) => {
    // Type assertion is tricky here, this simplified approach assumes correct types are passed.
    // A more robust solution might involve type guards or a more specific update function signature.
    updateProperty(group, key as any, value as any);
  };

  const handleGradientChange = (index: number, field: keyof ThemeGradient, value: string | string[]) => {
    updateGradient(index, { [field]: value });
  };
  
  const handleGradientColorChange = (gradientIndex: number, colorIndex: number, newColor: string) => {
    const gradient = themeConfig.properties.gradients[gradientIndex];
    if (gradient) {
      const newColors = [...gradient.colors];
      newColors[colorIndex] = newColor;
      updateGradient(gradientIndex, { colors: newColors });
    }
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={['spacing']} className="w-full space-y-4">
          
          {/* Spacing */}
          <AccordionItem value="spacing">
            <AccordionTrigger className="text-lg font-semibold">Spacing</AccordionTrigger>
            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {(Object.keys(themeConfig.properties.spacing) as Array<keyof ThemeSpacing>).map(key => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`spacing-${key}`} className="capitalize">{key}</Label>
                  <Input
                    id={`spacing-${key}`}
                    value={themeConfig.properties.spacing[key]}
                    onChange={(e) => handlePropertyChange('spacing', key, e.target.value)}
                    placeholder="e.g., 8px"
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Border Radius */}
          <AccordionItem value="borderRadius">
            <AccordionTrigger className="text-lg font-semibold">Border Radius</AccordionTrigger>
            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {(Object.keys(themeConfig.properties.borderRadius) as Array<keyof ThemeBorderRadius>).map(key => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`borderRadius-${key}`} className="capitalize">{key}</Label>
                  <Input
                    id={`borderRadius-${key}`}
                    value={themeConfig.properties.borderRadius[key]}
                    onChange={(e) => handlePropertyChange('borderRadius', key, e.target.value)}
                    placeholder="e.g., 8px"
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Border Width */}
          <AccordionItem value="borderWidth">
            <AccordionTrigger className="text-lg font-semibold">Border Width</AccordionTrigger>
            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {(Object.keys(themeConfig.properties.borderWidth) as Array<keyof ThemeBorderWidth>).map(key => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`borderWidth-${key}`} className="capitalize">{key}</Label>
                  <Input
                    id={`borderWidth-${key}`}
                    value={themeConfig.properties.borderWidth[key]}
                    onChange={(e) => handlePropertyChange('borderWidth', key, e.target.value)}
                    placeholder="e.g., 1px"
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Gradients */}
          <AccordionItem value="gradients">
            <AccordionTrigger className="text-lg font-semibold">Gradients</AccordionTrigger>
            <AccordionContent className="pt-4 space-y-6">
              {themeConfig.properties.gradients.map((gradient, index) => (
                <Card key={index} className="p-4 space-y-3 relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => removeGradient(index)}
                    aria-label="Remove gradient"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-1.5">
                    <Label htmlFor={`gradient-name-${index}`}>Name</Label>
                    <Input
                      id={`gradient-name-${index}`}
                      value={gradient.name}
                      onChange={(e) => handleGradientChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor={`gradient-type-${index}`}>Type</Label>
                    <Select
                      value={gradient.type}
                      onValueChange={(value: 'linear' | 'radial') => handleGradientChange(index, 'type', value)}
                    >
                      <SelectTrigger id={`gradient-type-${index}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {gradient.type === 'linear' && (
                    <div className="space-y-1.5">
                      <Label htmlFor={`gradient-direction-${index}`}>Direction/Angle</Label>
                      <Input
                        id={`gradient-direction-${index}`}
                        value={gradient.direction || ''}
                        onChange={(e) => handleGradientChange(index, 'direction', e.target.value)}
                        placeholder="e.g., to right, 45deg"
                      />
                    </div>
                  )}
                  {/* TODO: Add inputs for radial gradient properties (shape, extent) if needed */}
                  <div className="space-y-2">
                    <Label>Colors</Label>
                    {gradient.colors.map((color, colorIndex) => (
                       <div key={colorIndex} className="flex items-center space-x-2">
                         <ColorInput
                           label={`Color ${colorIndex + 1}`}
                           color={color}
                           onChange={(newColor) => handleGradientColorChange(index, colorIndex, newColor)}
                           labelClassName="sr-only"
                         />
                         {gradient.colors.length > 2 && (
                            <Button variant="ghost" size="icon" onClick={() => {
                                const newColors = gradient.colors.filter((_, i) => i !== colorIndex);
                                handleGradientChange(index, 'colors', newColors);
                            }}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                         )}
                       </div>
                    ))}
                     <Button variant="outline" size="sm" onClick={() => {
                        const newColors = [...gradient.colors, '#CCCCCC'];
                        handleGradientChange(index, 'colors', newColors);
                     }}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Color Stop
                    </Button>
                  </div>
                </Card>
              ))}
              <Button onClick={addGradient} variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" /> Add Gradient
              </Button>
            </AccordionContent>
          </AccordionItem>

          {/* Opacity */}
          <AccordionItem value="opacity">
            <AccordionTrigger className="text-lg font-semibold">Opacity</AccordionTrigger>
            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              {(Object.keys(themeConfig.properties.opacity) as Array<keyof ThemeOpacity>).map(key => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`opacity-${key}`} className="capitalize">{key}</Label>
                  <Input
                    id={`opacity-${key}`}
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={themeConfig.properties.opacity[key]}
                    onChange={(e) => handlePropertyChange('opacity', key, parseFloat(e.target.value))}
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

          {/* Elevation */}
          <AccordionItem value="elevation">
            <AccordionTrigger className="text-lg font-semibold">Elevation (Shadows)</AccordionTrigger>
            <AccordionContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {(Object.keys(themeConfig.properties.elevation) as Array<keyof ThemeElevation>).map(key => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`elevation-${key}`} className="capitalize">{key.replace('level', 'Level ')}</Label>
                  <Input
                    id={`elevation-${key}`}
                    value={themeConfig.properties.elevation[key]}
                    onChange={(e) => handlePropertyChange('elevation', key, e.target.value)}
                    placeholder="e.g., 0px 1px 3px rgba(0,0,0,0.2)"
                  />
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PropertiesSection;
