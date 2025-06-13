
"use client";

import Header from '@/components/layout/Header';
import OutputSection from '@/components/theme-builder/OutputSection';
// ThemePreview is removed from direct import as it's not the primary content here
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Edit3 } from 'lucide-react'; // Icon for back to editor

const OutputPageContent = () => {
  return (
    <main className="container mx-auto px-4 py-8 flex-grow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-headline font-semibold">Generated Code Output</h2>
        <Link href="/" passHref>
          <Button variant="outline">
            <Edit3 className="mr-2 h-4 w-4 text-accent" /> Back to Editor
          </Button>
        </Link>
      </div>

      {/* Simplified layout for only showing OutputSection */}
      <div className="space-y-8">
        <OutputSection />
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
