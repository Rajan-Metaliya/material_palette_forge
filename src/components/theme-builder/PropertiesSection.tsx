
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ThemeGradient, CustomPropertyItem, CustomNumericPropertyItem, ThemeProperties } from '@/types/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorInput from './ColorInput';

type PropertyGroupKey = keyof Pick<ThemeProperties, 'spacing' | 'borderRadius' | 'borderWidth' | 'opacity' | 'elevation'>;

interface CustomPropertyEditorProps {
  groupKey: PropertyGroupKey;
  groupLabel: string;
  itemType?: 'string' | 'number'; // Default is string
  itemPlaceholder?: string;
  itemUnit?: string; // e.g. px, for display or help text
}

const CustomPropertyEditor: React.FC<CustomPropertyEditorProps> = ({
  groupKey,
  groupLabel,
  itemType = 'string',
  itemPlaceholder = "e.g., value",
  itemUnit
}) => {
  const { themeConfig, updatePropertyListItem, addPropertyListItem, removePropertyListItem } = useTheme();
  
  const items = themeConfig.properties[groupKey] as Array<CustomPropertyItem | CustomNumericPropertyItem>;

  const handleNameChange = (index: number, newName: string) => {
    const currentItem = items[index];
    updatePropertyListItem(groupKey, index, { ...currentItem, name: newName });
  };

  const handleValueChange = (index: number, newValue: string) => {
    const currentItem = items[index];
    if (itemType === 'number') {
      const numValue = parseFloat(newValue);
      updatePropertyListItem(groupKey, index, { ...currentItem, value: isNaN(numValue) ? 0 : numValue } as CustomNumericPropertyItem);
    } else {
      updatePropertyListItem(groupKey, index, { ...currentItem, value: newValue } as CustomPropertyItem);
    }
  };

  const handleAddItem = () => {
    const newItemName = `new${groupLabel.replace(/\s+/g, '')}${items.length + 1}`;
    if (itemType === 'number') {
      addPropertyListItem(groupKey, { name: newItemName, value: 0 } as CustomNumericPropertyItem);
    } else {
      addPropertyListItem(groupKey, { name: newItemName, value: itemPlaceholder.startsWith("e.g., ") ? itemPlaceholder.substring(6).split(" ")[0] : '0px' } as CustomPropertyItem);
    }
  };

  return (
    <AccordionItem value={groupKey}>
      <AccordionTrigger className="text-lg font-semibold">{groupLabel}</AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="p-4 space-y-3 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <Label htmlFor={`${groupKey}-name-${index}`}>Name (Variable)</Label>
                <Input
                  id={`${groupKey}-name-${index}`}
                  value={item.name}
                  onChange={(e) => handleNameChange(index, e.target.value)}
                  placeholder="e.g., smallMargin"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${groupKey}-value-${index}`}>Value {itemUnit ? `(${itemUnit})` : ''}</Label>
                <Input
                  id={`${groupKey}-value-${index}`}
                  type={itemType === 'number' ? 'number' : 'text'}
                  value={item.value.toString()} // toString for number values
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={itemPlaceholder}
                  {...(itemType === 'number' ? { step: "0.01", min: "0", max: groupKey === 'opacity' ? "1" : undefined } : {})}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
              onClick={() => removePropertyListItem(groupKey, index)}
              aria-label={`Remove ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Card>
        ))}
        <Button onClick={handleAddItem} variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" /> Add {groupLabel.slice(0,-1)} Item
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
};


const PropertiesSection: React.FC = () => {
  const { themeConfig, updateGradient, addGradient, removeGradient } = useTheme();

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
          
          <CustomPropertyEditor groupKey="spacing" groupLabel="Spacing" itemPlaceholder="e.g., 8px" itemUnit="px, rem, etc." />
          <CustomPropertyEditor groupKey="borderRadius" groupLabel="Border Radiuses" itemPlaceholder="e.g., 4px" itemUnit="px, %" />
          <CustomPropertyEditor groupKey="borderWidth" groupLabel="Border Widths" itemPlaceholder="e.g., 1px" itemUnit="px" />
          
          {/* Gradients (Keeps its existing structure, as it's already an array of complex objects) */}
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
                        const newColors = [...gradient.colors, '#CCCCCC']; // Default new color stop
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

          <CustomPropertyEditor groupKey="opacity" groupLabel="Opacities" itemType="number" itemPlaceholder="e.g., 0.5" itemUnit="0.0 - 1.0" />
          <CustomPropertyEditor groupKey="elevation" groupLabel="Elevations (Shadows)" itemPlaceholder="e.g., 0px 1px 3px rgba(0,0,0,0.2)" itemUnit="CSS boxShadow" />

        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PropertiesSection;
