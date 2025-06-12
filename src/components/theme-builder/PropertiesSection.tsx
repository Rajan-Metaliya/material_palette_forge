
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
  itemType?: 'string' | 'number'; // Default is string. 'string' for CustomPropertyItem, 'number' for CustomNumericPropertyItem (like opacity)
  
  namePlaceholder?: string; // Placeholder for the name input, e.g., "smallMargin"
  valuePlaceholder?: string; // Placeholder for the value input, e.g., "8" or "0.5" or "0px 1px 3px..."

  // If valueSuffix is provided, the input field for value will be numeric-only (type="number").
  // This suffix will be appended to the number for storage if itemType is 'string'.
  // It will also be displayed in the label, e.g., "Value (px)".
  valueSuffix?: string; // e.g., "px", "%"

  // For free-form string values (like elevation) or numeric values (like opacity) where a suffix isn't appropriate for storage,
  // this describes the unit/type in the label, e.g., "Value (CSS boxShadow)" or "Value (0.0 - 1.0)".
  displayUnitDescriptor?: string; 
}

const CustomPropertyEditor: React.FC<CustomPropertyEditorProps> = ({
  groupKey,
  groupLabel,
  itemType = 'string',
  namePlaceholder = "e.g., itemKey",
  valuePlaceholder = "e.g., value",
  valueSuffix,
  displayUnitDescriptor,
}) => {
  const { themeConfig, updatePropertyListItem, addPropertyListItem, removePropertyListItem } = useTheme();
  
  const items = themeConfig.properties[groupKey] as Array<CustomPropertyItem | CustomNumericPropertyItem>;

  const handleNameChange = (index: number, newName: string) => {
    const currentItem = items[index];
    updatePropertyListItem(groupKey, index, { ...currentItem, name: newName });
  };

  const handleValueChange = (index: number, newValueFromInput: string) => {
    const currentItem = items[index];
    if (itemType === 'number') { // For Opacity (CustomNumericPropertyItem, value is number)
      const numValue = parseFloat(newValueFromInput);
      updatePropertyListItem(groupKey, index, { ...currentItem, value: isNaN(numValue) ? 0 : numValue } as CustomNumericPropertyItem);
    } else { // For Spacing, BorderRadius, BorderWidth (CustomPropertyItem, value is string) or Elevation
      if (valueSuffix) { // Input was numeric, append suffix for storage as string
        const num = parseFloat(newValueFromInput);
        const finalValue = isNaN(num) ? `0${valueSuffix}` : `${num}${valueSuffix}`;
        updatePropertyListItem(groupKey, index, { ...currentItem, value: finalValue } as CustomPropertyItem);
      } else { // For Elevation (free-form string)
        updatePropertyListItem(groupKey, index, { ...currentItem, value: newValueFromInput } as CustomPropertyItem);
      }
    }
  };

  const handleAddItem = () => {
    const newItemName = `new${groupLabel.replace(/\s+/g, '')}${items.length + 1}`;
    if (itemType === 'number') { // For Opacity
      addPropertyListItem(groupKey, { name: newItemName, value: 0 } as CustomNumericPropertyItem);
    } else { // For Spacing, BorderRadius, BorderWidth, Elevation
      let defaultValue: string;
      if (valueSuffix) {
        // Use the numeric part of valuePlaceholder if available, otherwise default to "0" + suffix
        const phNumericPart = valuePlaceholder.match(/^\d+(\.\d+)?/); // extracts leading number
        defaultValue = phNumericPart ? `${phNumericPart[0]}${valueSuffix}` : `0${valueSuffix}`;
      } else {
        // For free-form strings like elevation, use the placeholder directly or a simple default
        defaultValue = valuePlaceholder.startsWith("e.g., ") ? valuePlaceholder.substring(6) : (valuePlaceholder || "default value");
      }
      addPropertyListItem(groupKey, { name: newItemName, value: defaultValue } as CustomPropertyItem);
    }
  };

  const isNumericOnlyValueInput = !!valueSuffix || itemType === 'number';

  return (
    <AccordionItem value={groupKey}>
      <AccordionTrigger className="text-lg font-semibold">{groupLabel}</AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {items.map((item, index) => {
          let displayValueForInput = item.value.toString();
          if (valueSuffix && itemType === 'string' && typeof item.value === 'string') {
            if (item.value.endsWith(valueSuffix)) {
              displayValueForInput = item.value.slice(0, -item.value.length + item.value.lastIndexOf(valueSuffix));
            }
            // Ensure it's a valid number string for the input type="number"
            const numPart = parseFloat(displayValueForInput);
            displayValueForInput = isNaN(numPart) ? "0" : numPart.toString();
          }

          return (
            <Card key={index} className="p-4 space-y-3 relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <Label htmlFor={`${groupKey}-name-${index}`}>Name (Variable)</Label>
                  <Input
                    id={`${groupKey}-name-${index}`}
                    value={item.name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    placeholder={namePlaceholder}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor={`${groupKey}-value-${index}`}>
                    Value 
                    {valueSuffix ? ` (${valueSuffix})` : (displayUnitDescriptor ? ` (${displayUnitDescriptor})` : '')}
                  </Label>
                  <Input
                    id={`${groupKey}-value-${index}`}
                    type={isNumericOnlyValueInput ? 'number' : 'text'}
                    value={displayValueForInput}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder={valuePlaceholder}
                    {...(itemType === 'number' && groupKey === 'opacity' ? { step: "0.01", min: "0", max: "1" } : {})}
                    {...(valueSuffix ? { step: "1", min: "0" } : {})}
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
          );
        })}
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
          
          <CustomPropertyEditor 
            groupKey="spacing" 
            groupLabel="Spacing" 
            valuePlaceholder="8" 
            valueSuffix="px" 
            namePlaceholder="e.g., small"
          />
          <CustomPropertyEditor 
            groupKey="borderRadius" 
            groupLabel="Border Radiuses" 
            valuePlaceholder="4" 
            valueSuffix="px"
            namePlaceholder="e.g., buttonRadius"
          />
          <CustomPropertyEditor 
            groupKey="borderWidth" 
            groupLabel="Border Widths" 
            valuePlaceholder="1" 
            valueSuffix="px"
            namePlaceholder="e.g., cardBorder"
          />
          
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
                      placeholder="e.g., primaryGradient"
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
                   {gradient.type === 'radial' && (
                    <>
                        <div className="space-y-1.5">
                            <Label htmlFor={`gradient-shape-${index}`}>Shape (optional)</Label>
                            <Input
                            id={`gradient-shape-${index}`}
                            value={gradient.shape || ''}
                            onChange={(e) => handleGradientChange(index, 'shape', e.target.value)}
                            placeholder="e.g., circle, ellipse"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor={`gradient-extent-${index}`}>Extent/Position (optional)</Label>
                            <Input
                            id={`gradient-extent-${index}`}
                            value={gradient.extent || ''}
                            onChange={(e) => handleGradientChange(index, 'extent', e.target.value)}
                            placeholder="e.g., farthest-corner, center"
                            />
                        </div>
                    </>
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

          <CustomPropertyEditor 
            groupKey="opacity" 
            groupLabel="Opacities" 
            itemType="number" 
            valuePlaceholder="0.5"
            displayUnitDescriptor="0.0 - 1.0"
            namePlaceholder="e.g., imageHover"
          />
          <CustomPropertyEditor 
            groupKey="elevation" 
            groupLabel="Elevations (Shadows)" 
            valuePlaceholder="0px 1px 3px rgba(0,0,0,0.2)" 
            displayUnitDescriptor="CSS boxShadow"
            namePlaceholder="e.g., cardShadow"
          />

        </Accordion>
      </CardContent>
    </Card>
  );
};

export default PropertiesSection;

