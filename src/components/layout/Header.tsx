
"use client";
import React from 'react';
import { Sun, Moon } from 'lucide-react'; // Palette icon removed
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

// Inline SVG for Nonstop IO Logo
const NonstopIoLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2 text-primary">
    <rect width="100" height="100" rx="10" fill="currentColor"/>
    <text x="50" y="55" dominantBaseline="middle" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="60" fontWeight="bold" fill="white">N</text>
  </svg>
);


const Header: React.FC = () => {
  const { activeMode, toggleActiveMode } = useTheme();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <NonstopIoLogo />
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
