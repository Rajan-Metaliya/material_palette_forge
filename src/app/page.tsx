
"use client";

import React, { useState } from 'react'; // Import useState
import Header from '@/components/layout/Header';
import ColorsSection from '@/components/theme-builder/ColorsSection';
import FontsSection from '@/components/theme-builder/FontsSection';
import PropertiesSection from '@/components/theme-builder/PropertiesSection';
import ThemePreview from '@/components/theme-builder/ThemePreview';
import { useTheme } from '@/context/ThemeContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, Type, SlidersHorizontal, Settings2, FileCode, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const MainEditorContent = () => {
  const { resetTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("colors"); // State for active tab

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
              <FileCode className="mr-2 h-4 w-4" /> View Generated Code
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1 rounded-lg">
              <TabsTrigger 
                value="colors" 
                className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
              >
                <Palette className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Colors
              </TabsTrigger>
              <TabsTrigger 
                value="fonts" 
                className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
              >
                <Type className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Fonts
              </TabsTrigger>
              <TabsTrigger 
                value="properties" 
                className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
              >
                <SlidersHorizontal className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" /> Properties
              </TabsTrigger>
            </TabsList>
            <TabsContent value="colors" className="mt-6">
              <ColorsSection setActiveTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="fonts" className="mt-6">
              <FontsSection setActiveTab={setActiveTab} />
            </TabsContent>
            <TabsContent value="properties" className="mt-6">
              <PropertiesSection />
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1 lg:sticky lg:top-24 space-y-8">
          <ThemePreview />
        </div>
      </div>
    </main>
  );
};


export default function Home() {
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
