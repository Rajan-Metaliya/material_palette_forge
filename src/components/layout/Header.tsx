
"use client";
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

// Updated Inline SVG for Nonstop IO Logo
const NonstopIoLogo: React.FC = () => (
  <svg 
    width="150" 
    height="32" 
    viewBox="0 0 150 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className="h-8 mr-2" // Adjusted width via viewBox and width attribute
  >
    {/* Green rounded square background for N */}
    <rect width="32" height="32" rx="6" fill="hsl(var(--primary))"/>
    {/* Stylized N - using paths for a closer look */}
    <path 
      d="M9.51062 7.74792V24.011H13.2016V13.8349L18.8483 24.011H22.4287V7.74792H18.7377V17.924L13.091 7.74792H9.51062Z" 
      fill="white" 
    />
    {/* Text "NonStop" */}
    {/* Using system font as a fallback, styling can be adjusted further if specific font metrics are known */}
    <text 
      x="40" 
      y="23" 
      fontFamily="Arial, Helvetica, sans-serif" 
      fontSize="18" 
      fontWeight="bold" 
      fill="hsl(var(--foreground))"
    >
      Non
    </text>
    <text 
      x="80" // Adjusted x for spacing after "Non"
      y="23" 
      fontFamily="Arial, Helvetica, sans-serif" 
      fontSize="18" 
      fontWeight="bold" 
      fill="hsl(var(--primary))" // "S" in primary color
    >
      S
    </text>
    <text 
      x="92" // Adjusted x for spacing after "S"
      y="23" 
      fontFamily="Arial, Helvetica, sans-serif" 
      fontSize="18" 
      fontWeight="bold" 
      fill="hsl(var(--foreground))"
    >
      top
    </text>
  </svg>
);


const Header: React.FC = () => {
  const { activeMode, toggleActiveMode } = useTheme();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <NonstopIoLogo />
          <h1 className="text-xl md:text-2xl font-headline font-semibold text-foreground">
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
