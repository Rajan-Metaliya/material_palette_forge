"use client";

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

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

  useEffect(() => {
    setInputValue(color);
  }, [color]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (/^#[0-9A-Fa-f]{6}$/.test(newValue) || /^#[0-9A-Fa-f]{3}$/.test(newValue)) {
      onChange(newValue);
    }
  };

  const handleColorPickerChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };
  
  const handleBlur = () => {
    // If input is invalid on blur, revert to original color
    if (!(/^#[0-9A-Fa-f]{6}$/.test(inputValue) || /^#[0-9A-Fa-f]{3}$/.test(inputValue))) {
       setInputValue(color);
    } else {
        onChange(inputValue); // Ensure final valid value is propagated
    }
  };


  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={`${label}-hex`} className={cn("capitalize", labelClassName)}>{label.replace(/([A-Z])/g, ' $1')}</Label>
      <div className="flex items-center space-x-2">
        <Input
          type="color"
          id={`${label}-picker`}
          value={color}
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
