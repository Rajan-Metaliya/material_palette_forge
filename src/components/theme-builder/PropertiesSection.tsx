
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Trash2, PlusCircle } from 'lucide-react';
import type { ThemeGradient, ThemeProperties, CustomStringPropertyItem, CustomNumericPropertyItem } from '@/types/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ColorInput from './ColorInput';
import { useToast } from "@/hooks/use-toast";
import { GRADIENT_TYPES, GRADIENT_LINEAR_DIRECTIONS, GRADIENT_RADIAL_SHAPES, GRADIENT_RADIAL_EXTENTS } from '@/lib/consts';

type PropertyGroupKey = keyof Pick<ThemeProperties, 'spacing' | 'borderRadius' | 'borderWidth' | 'opacity' | 'elevation'>;
type AnyCustomPropertyItem = CustomStringPropertyItem | CustomNumericPropertyItem;


interface CustomPropertyEditorProps {
  groupKey: PropertyGroupKey;
  groupLabel: string;
  itemValueType: 'string' | 'number';
  namePlaceholder?: string;
  valuePlaceholder?: string;
  displayUnitDescriptor?: string;
}

const CustomPropertyEditor: React.FC<CustomPropertyEditorProps> = ({
  groupKey,
  groupLabel,
  itemValueType,
  namePlaceholder = "e.g., itemKey",
  valuePlaceholder = "e.g., value",
  displayUnitDescriptor,
}) => {
  const { themeConfig, updatePropertyListItem, addPropertyListItem, removePropertyListItem } = useTheme();
  const { toast } = useToast();

  const items = themeConfig.properties[groupKey] as Array<AnyCustomPropertyItem>;

  const handleNameChange = (index: number, newName: string) => {
    if (newName.trim() === '') {
      toast({ title: "Validation Error", description: "Property name cannot be empty.", variant: "destructive" });
      return;
    }
    const isValidChars = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newName);
    if (!isValidChars) {
        toast({ title: "Naming Suggestion", description: "Consider using camelCase or snake_case without spaces/special characters for names.", variant: "default" });
    }

    const currentItem = items[index];
    if (itemValueType === 'number') {
        const numericItem = currentItem as CustomNumericPropertyItem;
        updatePropertyListItem(groupKey, index, { ...numericItem, name: newName });
    } else {
        const stringItem = currentItem as CustomStringPropertyItem;
        updatePropertyListItem(groupKey, index, { ...stringItem, name: newName });
    }
  };

  const handleValueChange = (index: number, newValueFromInput: string) => {
    const currentItem = items[index];
    if (itemValueType === 'number') {
      const numValue = parseFloat(newValueFromInput);
      if (isNaN(numValue)) {
        toast({ title: "Validation Error", description: "Invalid number for value.", variant: "destructive" });
        return;
      }
      const numericItem = currentItem as CustomNumericPropertyItem;
      updatePropertyListItem(groupKey, index, { ...numericItem, value: numValue });
    } else { // string value (e.g., for elevation)
      const stringItem = currentItem as CustomStringPropertyItem;
      updatePropertyListItem(groupKey, index, { ...stringItem, value: newValueFromInput });
    }
  };

  const handleAddItem = () => {
    const newItemName = `new${groupLabel.replace(/\s+/g, '')}${items.length + 1}`;
    if (itemValueType === 'number') {
        let defaultValue = 0;
        if (valuePlaceholder && !isNaN(parseFloat(valuePlaceholder))) { // from default placeholder value
             defaultValue = parseFloat(valuePlaceholder);
        } else if (groupKey === 'opacity') { // specific default for opacity
            defaultValue = 0.5;
        } else { // generic numeric default
             defaultValue = 0;
        }
      addPropertyListItem(groupKey, { name: newItemName, value: defaultValue } as CustomNumericPropertyItem);
    } else {
      const defaultValue = valuePlaceholder && valuePlaceholder.startsWith("e.g., ") ? valuePlaceholder.substring(6) : (valuePlaceholder || "default value");
      addPropertyListItem(groupKey, { name: newItemName, value: defaultValue } as CustomStringPropertyItem);
    }
  };
  
  const checkerboardBg = 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADBJREFUOE9jfPbs2X8GPEBTIBwkDAGZcAxDUIbC2jAFdIC6hRkh8wAuGEMAVyEAlB3fWwMAAAAASUVORK5CYII=) repeat';


  return (
    <AccordionItem value={groupKey}>
      <AccordionTrigger className="text-lg font-semibold">{groupLabel}</AccordionTrigger>
      <AccordionContent className="pt-4 space-y-4">
        {items.map((item, index) => {
          const displayValueForInput = item.value.toString();
          const itemValueAsNumber = typeof item.value === 'number' ? item.value : parseFloat(item.value.toString());

          return (
            <Card key={index} className="p-4 space-y-3 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                onClick={() => removePropertyListItem(groupKey, index)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
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
                    {displayUnitDescriptor ? ` (${displayUnitDescriptor})` : ''}
                  </Label>
                  <Input
                    id={`${groupKey}-value-${index}`}
                    type={itemValueType === 'number' ? 'number' : 'text'}
                    value={displayValueForInput}
                    onChange={(e) => handleValueChange(index, e.target.value)}
                    placeholder={valuePlaceholder === "Value (px)" ? "e.g., 8" : valuePlaceholder}
                    {...(itemValueType === 'number' && groupKey === 'opacity' ? { step: "0.01", min: "0", max: "1" } : {})}
                    {...(itemValueType === 'number' && (groupKey === 'spacing' || groupKey === 'borderRadius' || groupKey === 'borderWidth') ? { min: "0", step: "1" } : {})}
                  />
                </div>
              </div>

              {/* Inline Preview */}
              <div className="mt-3 pt-3 border-t">
                <Label className="text-xs text-muted-foreground mb-1 block">Preview:</Label>
                <div className="flex items-center justify-start h-16 p-2 rounded" style={{ backgroundColor: groupKey !== 'opacity' && groupKey !== 'elevation' ? themeConfig.colors.surfaceVariant : undefined }}>
                  {groupKey === 'spacing' && !isNaN(itemValueAsNumber) && (
                    <div style={{ display: 'flex', alignItems: 'center', height: '30px', backgroundColor: themeConfig.colors.surface, padding: '4px', border: `1px dashed ${themeConfig.colors.outline}`}}>
                      <div style={{ width: '20px', height: '20px', backgroundColor: themeConfig.colors.primary, borderRadius:'2px' }}></div>
                      <div style={{ width: `${Math.max(0, Math.min(50, itemValueAsNumber))}px`, height: '20px', backgroundColor: themeConfig.colors.secondaryContainer, opacity: 0.5 }}></div>
                      <div style={{ width: '20px', height: '20px', backgroundColor: themeConfig.colors.primary, borderRadius:'2px' }}></div>
                    </div>
                  )}
                  {groupKey === 'borderRadius' && !isNaN(itemValueAsNumber) && (
                    <div style={{ width: '40px', height: '40px', backgroundColor: themeConfig.colors.primary, border: `1px solid ${themeConfig.colors.outline}`, borderRadius: `${itemValueAsNumber}px` }}></div>
                  )}
                  {groupKey === 'borderWidth' && !isNaN(itemValueAsNumber) && (
                    <div style={{ width: '40px', height: '40px', backgroundColor: themeConfig.colors.surface, border: `${Math.max(0, itemValueAsNumber)}px solid ${themeConfig.colors.primary}` }}></div>
                  )}
                  {groupKey === 'opacity' && !isNaN(itemValueAsNumber) && (
                     <div style={{ width: '40px', height: '40px', background: checkerboardBg, borderRadius: '4px' }}>
                        <div style={{ width: '100%', height: '100%', backgroundColor: themeConfig.colors.primary, opacity: itemValueAsNumber, borderRadius: '4px' }}></div>
                     </div>
                  )}
                  {groupKey === 'elevation' && typeof item.value === 'string' && (
                    <div style={{ width: '50px', height: '50px', backgroundColor: themeConfig.colors.surface, boxShadow: item.value, borderRadius:'4px', border: `1px solid ${themeConfig.colors.outline}` }}></div>
                  )}
                </div>
              </div>

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
  const { toast } = useToast();

  const handleGradientChange = (index: number, field: keyof ThemeGradient, value: string | string[]) => {
    if (field === 'name' && typeof value === 'string' && value.trim() === '') {
        toast({ title: "Validation Error", description: "Gradient name cannot be empty.", variant: "destructive" });
        return;
    }
    let updates: Partial<ThemeGradient> = { [field]: value };
    if (field === 'type') {
        if (value === 'radial') {
            updates.direction = undefined;
            if(!themeConfig.properties.gradients[index].shape) updates.shape = 'circle';
            if(!themeConfig.properties.gradients[index].extent) updates.extent = 'farthest-corner';

        } else if (value === 'linear') {
            updates.shape = undefined;
            updates.extent = undefined;
            if(!themeConfig.properties.gradients[index].direction) updates.direction = 'to right';
        }
    }
    updateGradient(index, updates);
  };

  const handleGradientColorChange = (gradientIndex: number, colorIndex: number, newColor: string) => {
    const gradient = themeConfig.properties.gradients[gradientIndex];
    if (gradient) {
      const newColors = [...gradient.colors];
      newColors[colorIndex] = newColor;
      updateGradient(gradientIndex, { colors: newColors });
    }
  };
  
  const generateCssGradient = (gradient: ThemeGradient): string => {
    const colorsString = gradient.colors.join(', ');
    if (gradient.type === 'linear') {
      return `linear-gradient(${gradient.direction || 'to right'}, ${colorsString})`;
    } else if (gradient.type === 'radial') {
      const shape = gradient.shape || 'circle';
      const extent = gradient.extent || 'farthest-corner';
      return `radial-gradient(${shape} ${extent}, ${colorsString})`;
    }
    return 'none';
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
            itemValueType="number"
            valuePlaceholder="8" 
            displayUnitDescriptor="px"
            namePlaceholder="e.g., small"
          />
          <CustomPropertyEditor
            groupKey="borderRadius"
            groupLabel="Border Radiuses"
            itemValueType="number"
            valuePlaceholder="4" 
            displayUnitDescriptor="px"
            namePlaceholder="e.g., buttonRadius"
          />
          <CustomPropertyEditor
            groupKey="borderWidth"
            groupLabel="Border Widths"
            itemValueType="number"
            valuePlaceholder="1" 
            displayUnitDescriptor="px"
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor={`gradient-type-${index}`}>Type</Label>
                        <Select
                          value={gradient.type}
                          onValueChange={(value: 'linear' | 'radial') => handleGradientChange(index, 'type', value)}
                        >
                          <SelectTrigger id={`gradient-type-${index}`}>
                            <SelectValue placeholder="Select gradient type" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADIENT_TYPES.map(typeOpt => (
                              <SelectItem key={typeOpt.value} value={typeOpt.value}>{typeOpt.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {gradient.type === 'linear' && (
                        <div className="space-y-1.5">
                          <Label htmlFor={`gradient-direction-${index}`}>Direction/Angle</Label>
                          <Select
                            value={gradient.direction || ''}
                            onValueChange={(value: string) => handleGradientChange(index, 'direction', value)}
                          >
                            <SelectTrigger id={`gradient-direction-${index}`}>
                              <SelectValue placeholder="Select direction/angle" />
                            </SelectTrigger>
                            <SelectContent>
                              {GRADIENT_LINEAR_DIRECTIONS.map(dirOpt => (
                                <SelectItem key={dirOpt.value} value={dirOpt.value}>{dirOpt.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                       {gradient.type === 'radial' && (
                        <>
                            <div className="space-y-1.5">
                                <Label htmlFor={`gradient-shape-${index}`}>Shape</Label>
                                 <Select
                                    value={gradient.shape || ''}
                                    onValueChange={(value: string) => handleGradientChange(index, 'shape', value)}
                                >
                                    <SelectTrigger id={`gradient-shape-${index}`}>
                                    <SelectValue placeholder="Select shape" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {GRADIENT_RADIAL_SHAPES.map(shapeOpt => (
                                        <SelectItem key={shapeOpt.value} value={shapeOpt.value}>{shapeOpt.label}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`gradient-extent-${index}`}>Extent/Position</Label>
                                <Select
                                    value={gradient.extent || ''}
                                    onValueChange={(value: string) => handleGradientChange(index, 'extent', value)}
                                >
                                    <SelectTrigger id={`gradient-extent-${index}`}>
                                    <SelectValue placeholder="Select extent/position" />
                                    </SelectTrigger>
                                    <SelectContent>
                                    {GRADIENT_RADIAL_EXTENTS.map(extentOpt => (
                                        <SelectItem key={extentOpt.value} value={extentOpt.value}>{extentOpt.label}</SelectItem>
                                    ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </>
                      )}
                    </div>
                     <div className="space-y-1.5">
                        <Label className="block">Preview:</Label>
                        <div
                            className="h-24 w-full rounded border"
                            style={{ background: generateCssGradient(gradient) }}
                        ></div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t">
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
            itemValueType="number"
            valuePlaceholder="0.5" 
            displayUnitDescriptor="0.0 - 1.0"
            namePlaceholder="e.g., imageHover"
          />
          <CustomPropertyEditor
            groupKey="elevation"
            groupLabel="Elevations (Shadows)"
            itemValueType="string" 
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
