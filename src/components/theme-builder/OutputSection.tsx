
"use client";

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, FileJson2, Figma, Copy } from 'lucide-react';
import { generateFlutterCode, generateJson, generateFigmaTokens } from '@/lib/themeGenerators';
import { useToast } from "@/hooks/use-toast";

type OutputFormat = 'flutter' | 'json' | 'figma';

const OutputSection: React.FC = () => {
  const { themeConfig } = useTheme();
  const [output, setOutput] = useState('');
  const [activeFormat, setActiveFormat] = useState<OutputFormat>('flutter');
  const { toast } = useToast();

  useEffect(() => {
    switch (activeFormat) {
      case 'flutter':
        setOutput(generateFlutterCode(themeConfig));
        break;
      case 'json':
        setOutput(generateJson(themeConfig));
        break;
      case 'figma':
        setOutput(generateFigmaTokens(themeConfig));
        break;
      default:
        setOutput('');
    }
  }, [themeConfig, activeFormat]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(output)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `${activeFormat.toUpperCase()} code has been copied.`,
        });
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        toast({
          title: "Error copying",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };

  const getIcon = (format: OutputFormat) => {
    const iconProps = { className: "mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5 text-accent" }; // Matched icon styling from main page
    switch (format) {
      case 'flutter':
        return <Smartphone {...iconProps} />;
      case 'json':
        return <FileJson2 {...iconProps} />;
      case 'figma':
        return <Figma {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="text-xl">Generated Output</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeFormat} onValueChange={(value) => setActiveFormat(value as OutputFormat)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/60 p-1 rounded-lg shadow-md mb-4">
            <TabsTrigger 
              value="flutter" 
              className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
            >
              {getIcon('flutter')} Flutter
            </TabsTrigger>
            <TabsTrigger 
              value="json" 
              className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
            >
              {getIcon('json')} JSON
            </TabsTrigger>
            <TabsTrigger 
              value="figma" 
              className="text-xs sm:text-sm data-[state=active]:bg-card data-[state=active]:text-card-foreground data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-border rounded-md focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 transition-colors data-[state=inactive]:hover:bg-muted"
            >
              {getIcon('figma')} Figma Tokens
            </TabsTrigger>
          </TabsList>
          
          <div className="relative">
            <Textarea
              value={output}
              readOnly
              className="min-h-[300px] font-mono text-sm bg-muted/30 border rounded-md p-4 focus-visible:ring-accent"
              aria-label={`Generated ${activeFormat} code`}
            />
            <Button
              onClick={handleCopyToClipboard}
              variant="outline"
              size="icon"
              className="absolute top-3 right-3 bg-background hover:bg-accent/10"
              aria-label="Copy to clipboard"
            >
              <Copy className="h-4 w-4 text-accent" />
            </Button>
          </div>

          {(['flutter', 'json', 'figma'] as OutputFormat[]).map(format => (
            <TabsContent key={format} value={format} className="mt-0 pt-0"></TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OutputSection;
