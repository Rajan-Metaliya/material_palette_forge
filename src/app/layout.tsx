
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { COMMON_WEB_FONTS } from '@/lib/consts'; // Import COMMON_WEB_FONTS

export const metadata: Metadata = {
  title: 'Material Palette Forge',
  description: 'A Material 3 Theme Builder by Firebase Studio',
};

// Function to generate font links
const generateFontLinks = () => {
  const uniqueFontFamilies = new Set<string>();
  COMMON_WEB_FONTS.forEach(font => {
    if (font.value !== 'monospace' && font.value !== 'Arial' && font.value !== 'Verdana' && font.value !== 'Georgia' && font.value !== 'Times New Roman' && font.value !== 'Courier New') { // Exclude system fonts
        // Extract family name for Google Fonts URL (e.g., "Space Grotesk" from "Space Grotesk, sans-serif")
        const familyName = font.stack.split(',')[0].replace(/"/g, '').trim();
        if (familyName) {
            uniqueFontFamilies.add(familyName.replace(/\s+/g, '+'));
        }
    }
  });

  // Construct Google Fonts API URL with weights. Adjust weights as needed.
  // For simplicity, including common weights. This could be dynamic based on ThemeConfig in future.
  const weights = ':wght@300;400;500;600;700;800;900';
  const fontFamiliesString = Array.from(uniqueFontFamilies).map(family => `family=${family}${weights}`).join('&');
  
  if (fontFamiliesString) {
    return `https://fonts.googleapis.com/css2?${fontFamiliesString}&display=swap`;
  }
  return null;
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const googleFontsUrl = generateFontLinks();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Old static links - to be replaced or augmented by dynamic one */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}
        {/* <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" /> */}
        {googleFontsUrl && <link href={googleFontsUrl} rel="stylesheet" />}
      </head>
      {/* Default font applied here, but individual components/text styles will override */}
      <body className="font-sans antialiased min-h-screen flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
