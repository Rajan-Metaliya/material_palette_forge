"use client";

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import type { ThemeFonts } from '@/types/theme';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COMMON_WEB_FONTS } from '@/lib/consts';

const FontsSection: React.FC = () => {
  const { themeConfig, updateFont } = useTheme();

  const fontRoles: { key: keyof ThemeFonts; label: string }[] = [
    { key: 'primary', label: 'Primary Font (Headlines, Display)' },
    { key: 'secondary', label: 'Secondary Font (Body, General Text)' },
    { key: 'monospace', label: 'Monospace Font (Code)' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fonts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {fontRoles.map(role => (
          <div key={role.key} className="space-y-2">
            <Label htmlFor={`${role.key}-font-select`}>{role.label}</Label>
            <Select
              value={themeConfig.fonts[role.key]}
              onValueChange={(value) => updateFont(role.key, value)}
            >
              <SelectTrigger id={`${role.key}-font-select`} className="w-full md:w-1/2">
                <SelectValue placeholder="Select a font" />
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
        ))}
      </CardContent>
    </Card>
  );
};

export default FontsSection;
