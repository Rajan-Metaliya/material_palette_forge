
"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

interface ColorInputProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  className?: string;
  labelClassName?: string;
  inputClassName?: string;
  colorPickerClassName?: string;
}

const ColorInput: React.FC<ColorInputProps> = ({
  label,
  color,
  onChange,
  className,
  labelClassName,
  inputClassName,
  colorPickerClassName
}) => {
  const [inputValue, setInputValue] = useState(color);
  const { toast } = useToast();

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const isValidHex = (value: string) => /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleBlur = () => {
    if (!isValidHex(inputValue)) {
       setInputValue(color); // Revert to original color if input is invalid
       toast({
         title: "Invalid Color",
         description: `"${inputValue}" is not a valid hex color. Reverted to ${color}.`,
         variant: "destructive"
       });
    } else {
        // Ensure the potentially valid intermediate input value (if not yet propagated by onChange) is sent
        if (inputValue !== color) {
             onChange(inputValue);
        }
    }
  };


  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`${label}-hex`} className={cn("capitalize", labelClassName)}>{label.replace(/([A-Z])/g, ' $1')}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          id={`${label}-picker`}
          value={color} // Color picker always reflects the committed valid color
          onChange={handleColorPickerChange}
          className={cn("w-10 h-10 p-1 border-none cursor-pointer", colorPickerClassName)}
          aria-label={`${label} color picker`}
        />
        <Input
          type="text"
          id={`${label}-hex`}
          value={inputValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className={cn("font-mono", inputClassName)}
          placeholder="#RRGGBB"
        />
      </div>
    </div>
  );
};

export default ColorInput;

