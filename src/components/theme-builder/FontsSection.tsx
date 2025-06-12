
"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { MaterialTextStyleKey, TextStyleProperties, FontWeightValue } from '@/types/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { COMMON_WEB_FONTS, FONT_WEIGHT_OPTIONS, MATERIAL_TEXT_STYLE_ORDER, MATERIAL_TEXT_STYLE_LABELS } from '@/lib/consts';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// Helper to get the full font stack for CSS
const getFontStack = (fontFamilyName: string): string => {
  const font = COMMON_WEB_FONTS.find(f => f.value === fontFamilyName);
  return font ? font.stack : fontFamilyName;
};

// Helper to convert theme fontWeight to CSS fontWeight
const getCssFontWeight = (fontWeight: FontWeightValue): string | number => {
  if (fontWeight === 'normal') return 400;
  if (fontWeight === 'bold') return 700;
  return fontWeight;
};


interface TextStyleEditorProps {
  styleKey: MaterialTextStyleKey | string;
  styleProps: TextStyleProperties;
  onPropertyChange: (propertyName: keyof TextStyleProperties, value: any) => void;
  onNameChange?: (newName: string) => void;
  isCustomStyle?: boolean;
  styleDisplayName?: string;
}

const TextStyleEditor: React.FC<TextStyleEditorProps> = ({
  styleKey,
  styleProps,
  onPropertyChange,
  onNameChange,
  isCustomStyle = false,
  styleDisplayName
}) => {
  const { toast } = useToast();
  const { themeConfig } = useTheme(); // For preview colors

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onNameChange) {
        const newName = e.target.value;
        if (newName.trim() === '') {
            toast({ title: "Validation Error", description: "Custom style name cannot be empty.", variant: "destructive" });
            return;
        }
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(newName)) {
            toast({ title: "Naming Suggestion", description: "Consider using camelCase or snake_case for names for better code generation.", variant: "default" });
        }
        onNameChange(newName);
    }
  };
  
  const handleNumericChange = (propName: keyof TextStyleProperties, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onPropertyChange(propName, numValue);
    } else if (value === '' && (propName === 'lineHeight')) { 
      onPropertyChange(propName, undefined);
    } else {
        toast({ title: "Invalid Input", description: `Please enter a valid number for ${propName}.`, variant: "destructive" });
    }
  };

  const previewStyle: React.CSSProperties = {
    fontFamily: getFontStack(styleProps.fontFamily),
    fontSize: `${styleProps.fontSize}px`,
    fontWeight: getCssFontWeight(styleProps.fontWeight),
    letterSpacing: `${styleProps.letterSpacing}px`,
    color: themeConfig.colors.onSurface,
    backgroundColor: themeConfig.colors.surfaceVariant,
    padding: '8px 12px',
    borderRadius: '4px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease-out',
  };
  if (styleProps.lineHeight !== undefined) {
    previewStyle.lineHeight = styleProps.lineHeight;
  }


  return (
    <Card className="p-4 space-y-4 mb-4">
      {isCustomStyle && typeof styleKey === 'string' && onNameChange && (
        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-name`}>Custom Style Name</Label>
          <Input
            id={`${styleKey}-name`}
            value={styleKey} 
            onChange={handleNameChange}
            placeholder="e.g., smallCaption"
          />
        </div>
      )}
      {!isCustomStyle && styleDisplayName && (
        <h4 className="text-md font-medium text-foreground">{styleDisplayName}</h4>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 items-end">
        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-fontFamily`}>Font Family</Label>
          <Select
            value={styleProps.fontFamily}
            onValueChange={(value) => onPropertyChange('fontFamily', value)}
          >
            <SelectTrigger id={`${styleKey}-fontFamily`}>
              <SelectValue placeholder="Select font family" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_WEB_FONTS.map(font => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-fontSize`}>Font Size (px)</Label>
          <Input
            id={`${styleKey}-fontSize`}
            type="number"
            value={styleProps.fontSize.toString()}
            onChange={(e) => handleNumericChange('fontSize', e.target.value)}
            placeholder="e.g., 16"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-fontWeight`}>Font Weight</Label>
          <Select
            value={styleProps.fontWeight.toString()} 
            onValueChange={(value) => onPropertyChange('fontWeight', FONT_WEIGHT_OPTIONS.find(opt => opt.value.toString() === value)?.value || 400)}
          >
            <SelectTrigger id={`${styleKey}-fontWeight`}>
              <SelectValue placeholder="Select font weight" />
            </SelectTrigger>
            <SelectContent>
              {FONT_WEIGHT_OPTIONS.map(weight => (
                <SelectItem key={weight.label} value={weight.value.toString()}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-letterSpacing`}>Letter Spacing (px)</Label>
          <Input
            id={`${styleKey}-letterSpacing`}
            type="number"
            step="0.01"
            value={styleProps.letterSpacing.toString()}
            onChange={(e) => handleNumericChange('letterSpacing', e.target.value)}
            placeholder="e.g., 0.15"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor={`${styleKey}-lineHeight`}>Line Height (multiplier, optional)</Label>
          <Input
            id={`${styleKey}-lineHeight`}
            type="number"
            step="0.01"
            value={styleProps.lineHeight?.toString() || ''}
            onChange={(e) => handleNumericChange('lineHeight', e.target.value)}
            placeholder="e.g., 1.5"
          />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t">
        <Label className="text-xs text-muted-foreground mb-1 block">Preview:</Label>
        <p style={previewStyle}>
          The quick brown fox
        </p>
      </div>
    </Card>
  );
};


const FontsSection: React.FC = () => {
  const {
    themeConfig,
    updateMaterialTextStyle,
    addCustomTextStyle,
    updateCustomTextStyleName,
    updateCustomTextStyleProperty,
    removeCustomTextStyle,
  } = useTheme();

  return (
    <Accordion type="multiple" defaultValue={['material-styles']} className="w-full space-y-6">
      <AccordionItem value="material-styles">
        <AccordionTrigger className="text-xl font-semibold">
          Material Text Styles
        </AccordionTrigger>
        <AccordionContent className="pt-4">
          <CardDescription className="mb-4">
            Configure the standard Material Design text styles. These will directly map to the TextTheme in Flutter.
          </CardDescription>
          {MATERIAL_TEXT_STYLE_ORDER.map(styleKey => (
            <TextStyleEditor
              key={styleKey}
              styleKey={styleKey}
              styleDisplayName={MATERIAL_TEXT_STYLE_LABELS[styleKey]}
              styleProps={themeConfig.fonts.materialTextStyles[styleKey]}
              onPropertyChange={(propName, value) => updateMaterialTextStyle(styleKey, propName, value)}
              isCustomStyle={false}
            />
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="custom-styles">
        <AccordionTrigger className="text-xl font-semibold">
          Custom Text Styles
        </AccordionTrigger>
        <AccordionContent className="pt-4">
           <CardDescription className="mb-4">
            Define additional text styles for your application. These will be available via a ThemeExtension in Flutter.
          </CardDescription>
          {themeConfig.fonts.customTextStyles.map((customStyle, index) => (
            <div key={index} className="relative">
              <TextStyleEditor
                styleKey={customStyle.name} 
                styleProps={customStyle.style}
                onPropertyChange={(propName, value) => updateCustomTextStyleProperty(index, propName, value)}
                onNameChange={(newName) => updateCustomTextStyleName(index, newName)}
                isCustomStyle={true}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-destructive hover:text-destructive-foreground hover:bg-destructive/90"
                onClick={() => removeCustomTextStyle(index)}
                aria-label={`Remove ${customStyle.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={() => addCustomTextStyle()} variant="outline" className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Custom Text Style
          </Button>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default FontsSection;
