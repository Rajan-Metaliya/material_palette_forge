import React from 'react';
import { Palette } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-3 flex items-center">
        <Palette className="h-7 w-7 mr-3 text-primary" />
        <h1 className="text-2xl font-headline font-semibold text-foreground">
          Material Palette Forge
        </h1>
      </div>
    </header>
  );
};

export default Header;
