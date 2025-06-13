
"use client";
import React from 'react';
import Image from 'next/image';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { activeMode, toggleActiveMode } = useTheme();

  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* Use Next/Image component for the logo */}
          <Image
            src="/nonstop-logo.png" // Assumes the logo is named nonstop-logo.png in the public folder
            alt="Nonstop IO Logo"
            width={150} // Adjust width as needed
            height={32} // Adjust height as needed
            className="h-8 mr-2" // Retain class for consistent height and margin
            priority // Add priority if the logo is critical for LCP
          />
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
