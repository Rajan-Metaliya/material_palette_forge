
"use client";
import React from 'react';
import { Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { activeMode, toggleActiveMode } = useTheme();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Palette className="h-7 w-7 mr-3 text-primary" />
          <h1 className="text-2xl font-headline font-semibold text-foreground">
            Material Palette Forge
          </h1>
        </div>
        <Button onClick={toggleActiveMode} variant="outline" size="icon" aria-label={`Switch to ${activeMode === 'light' ? 'dark' : 'light'} mode`}>
          {activeMode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </div>
    </header>
  );
};

export default Header;
