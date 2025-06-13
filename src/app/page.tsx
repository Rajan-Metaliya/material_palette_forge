
"use client";

import Header from '@/components/layout/Header';
import ColorsSection from '@/components/theme-builder/ColorsSection';
import FontsSection from '@/components/theme-builder/FontsSection';
import PropertiesSection from '@/components/theme-builder/PropertiesSection';
import { useTheme } from '@/context/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, SlidersHorizontal, Settings2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MainEditorContent = () => {
  const { resetTheme } = useTheme();
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-semibold">Theme Customizer</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={resetTheme} variant="outline">
            <Settings2 className="mr-2 h-4 w-4 text-accent" /> Reset to Defaults
          </Button>
          <Link href="/output" passHref>
            <Button>
              <Eye className="mr-2 h-4 w-4" /> View Output & Preview
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-8">
        <Tabs defaultValue="colors" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="colors" className="text-xs sm:text-sm">
              <Palette className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Colors
            </TabsTrigger>
            <TabsTrigger value="fonts" className="text-xs sm:text-sm">
              <Type className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Fonts
            </TabsTrigger>
            <TabsTrigger value="properties" className="text-xs sm:text-sm">
              <SlidersHorizontal className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Properties
            </TabsTrigger>
          </TabsList>
          <TabsContent value="colors" className="mt-6">
            <ColorsSection />
          </TabsContent>
          <TabsContent value="fonts" className="mt-6">
            <FontsSection />
          </TabsContent>
          <TabsContent value="properties" className="mt-6">
            <PropertiesSection />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};


export default function Home() {
  // ThemeProvider is now in RootLayout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <MainEditorContent />
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
        Built with Firebase Studio. Material Palette Forge © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
