
"use client";

import Header from '@/components/layout/Header';
import OutputSection from '@/components/theme-builder/OutputSection';
import ThemePreview from '@/components/theme-builder/ThemePreview';
// useTheme will work because ThemeProvider is in RootLayout
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit3 } from 'lucide-react'; // Icon for back to editor

const OutputPageContent = () => {
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-semibold">Preview & Output</h2>
        <Link href="/" passHref>
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4 text-accent" /> Back to Editor
          </Button>
        </Link>
      </div>

      {/* Re-introduce the two-column layout for preview and output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Preview - Sticky */}
        <div className="space-y-8 lg:sticky lg:top-24"> {/* Adjust top value as needed for header height */}
          <ThemePreview />
        </div>
        
        {/* Right Column: Output - Scrolls alongside preview or independently if preview is shorter */}
        <div className="space-y-8 lg:overflow-y-auto lg:max-h-[calc(100vh-10rem)] lg:pr-4">
          <OutputSection />
        </div>
      </div>
    </main>
  );
};

export default function OutputPage() {
  // ThemeProvider is in RootLayout
  return (
    <div className="flex flex-col min-h-screen">
      <Header /> {/* Same header for consistency */}
      <OutputPageContent />
      <footer className="text-center py-4 border-t text-sm text-muted-foreground">
        Built with Firebase Studio. Material Palette Forge © {new Date().getFullYear()}
      </footer>
    </div>
  );
}
