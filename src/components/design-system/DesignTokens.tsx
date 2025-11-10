import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export function DesignTokens() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(label);
    toast.success(`Copied ${label} to clipboard`);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const colors = [
    { name: 'Primary', var: '--primary', value: 'hsl(221.2 83.2% 53.3%)', bg: 'bg-primary' },
    { name: 'Primary Foreground', var: '--primary-foreground', value: 'hsl(210 40% 98%)', bg: 'bg-primary-foreground' },
    { name: 'Secondary', var: '--secondary', value: 'hsl(210 40% 96.1%)', bg: 'bg-secondary' },
    { name: 'Secondary Foreground', var: '--secondary-foreground', value: 'hsl(222.2 47.4% 11.2%)', bg: 'bg-secondary-foreground' },
    { name: 'Accent', var: '--accent', value: 'hsl(210 40% 96.1%)', bg: 'bg-accent' },
    { name: 'Accent Foreground', var: '--accent-foreground', value: 'hsl(222.2 47.4% 11.2%)', bg: 'bg-accent-foreground' },
    { name: 'Destructive', var: '--destructive', value: 'hsl(0 84.2% 60.2%)', bg: 'bg-destructive' },
    { name: 'Destructive Foreground', var: '--destructive-foreground', value: 'hsl(210 40% 98%)', bg: 'bg-destructive-foreground' },
    { name: 'Muted', var: '--muted', value: 'hsl(210 40% 96.1%)', bg: 'bg-muted' },
    { name: 'Muted Foreground', var: '--muted-foreground', value: 'hsl(215.4 16.3% 46.9%)', bg: 'bg-muted-foreground' },
    { name: 'Border', var: '--border', value: 'hsl(214.3 31.8% 91.4%)', bg: 'bg-border' },
    { name: 'Input', var: '--input', value: 'hsl(214.3 31.8% 91.4%)', bg: 'bg-input' },
    { name: 'Ring', var: '--ring', value: 'hsl(221.2 83.2% 53.3%)', bg: 'bg-ring' },
  ];

  const typography = [
    { name: 'Display', class: 'text-4xl font-bold', example: 'The quick brown fox' },
    { name: 'H1', class: 'text-3xl font-bold', example: 'The quick brown fox' },
    { name: 'H2', class: 'text-2xl font-semibold', example: 'The quick brown fox' },
    { name: 'H3', class: 'text-xl font-semibold', example: 'The quick brown fox' },
    { name: 'Body Large', class: 'text-lg', example: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Body', class: 'text-base', example: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Small', class: 'text-sm', example: 'The quick brown fox jumps over the lazy dog' },
    { name: 'Mono', class: 'text-sm font-mono', example: 'const x = "Hello World";' },
  ];

  const spacing = [
    { name: '0', value: '0px', class: 'w-0 h-4' },
    { name: '1', value: '4px', class: 'w-1 h-4' },
    { name: '2', value: '8px', class: 'w-2 h-4' },
    { name: '3', value: '12px', class: 'w-3 h-4' },
    { name: '4', value: '16px', class: 'w-4 h-4' },
    { name: '5', value: '20px', class: 'w-5 h-4' },
    { name: '6', value: '24px', class: 'w-6 h-4' },
    { name: '8', value: '32px', class: 'w-8 h-4' },
    { name: '10', value: '40px', class: 'w-10 h-4' },
    { name: '12', value: '48px', class: 'w-12 h-4' },
    { name: '16', value: '64px', class: 'w-16 h-4' },
  ];

  const shadows = [
    { name: 'Small', class: 'shadow-sm', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
    { name: 'Medium', class: 'shadow-md', value: '0 4px 6px -1px rgb(0 0 0 / 0.1)' },
    { name: 'Large', class: 'shadow-lg', value: '0 10px 15px -3px rgb(0 0 0 / 0.1)' },
    { name: 'Extra Large', class: 'shadow-xl', value: '0 20px 25px -5px rgb(0 0 0 / 0.1)' },
  ];

  const borderRadius = [
    { name: 'None', value: '0px', class: 'rounded-none' },
    { name: 'Small', value: '2px', class: 'rounded-sm' },
    { name: 'Default', value: '4px', class: 'rounded' },
    { name: 'Medium', value: '6px', class: 'rounded-md' },
    { name: 'Large', value: '8px', class: 'rounded-lg' },
    { name: 'Extra Large', value: '12px', class: 'rounded-xl' },
    { name: 'Full', value: '9999px', class: 'rounded-full' },
  ];

  return (
    <div className="space-y-8">
      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Color Palette</CardTitle>
          <CardDescription>
            Semantic color tokens based on HSL values. These colors adapt to light/dark themes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.var} className="space-y-2">
                <div className={`${color.bg} h-20 rounded-lg border`}></div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{color.name}</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{color.var}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(color.var, color.name)}
                    >
                      {copiedToken === color.name ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{color.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>
            Text styles and font sizes used throughout the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {typography.map((type) => (
              <div key={type.name} className="space-y-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="w-32">
                    {type.name}
                  </Badge>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{type.class}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => copyToClipboard(type.class, type.name)}
                  >
                    {copiedToken === type.name ? (
                      <Check className="w-3 h-3 text-green-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </Button>
                </div>
                <div className={type.class}>{type.example}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Spacing */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>
            Consistent spacing based on 4px increments (8-point grid system).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {spacing.map((space) => (
              <div key={space.name} className="flex items-center gap-4">
                <Badge variant="outline" className="w-16 font-mono">
                  {space.name}
                </Badge>
                <div className={`${space.class} bg-primary`}></div>
                <span className="text-sm text-muted-foreground">{space.value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => copyToClipboard(`p-${space.name}`, `Spacing ${space.name}`)}
                >
                  {copiedToken === `Spacing ${space.name}` ? (
                    <Check className="w-3 h-3 text-green-600" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>Elevation / Shadows</CardTitle>
          <CardDescription>
            Shadow styles for creating depth and hierarchy.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {shadows.map((shadow) => (
              <div key={shadow.name} className="space-y-3">
                <div className={`${shadow.class} h-24 bg-card border rounded-lg`}></div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{shadow.name}</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded">{shadow.class}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => copyToClipboard(shadow.class, shadow.name)}
                    >
                      {copiedToken === shadow.name ? (
                        <Check className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Border Radius */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
          <CardDescription>
            Corner radius styles for consistent component shapes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {borderRadius.map((radius) => (
              <div key={radius.name} className="space-y-2">
                <div
                  className={`${radius.class} h-20 bg-primary border-2 border-primary-foreground`}
                ></div>
                <div className="space-y-1">
                  <div className="font-medium text-sm">{radius.name}</div>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">{radius.class}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0"
                      onClick={() => copyToClipboard(radius.class, radius.name)}
                    >
                      {copiedToken === radius.name ? (
                        <Check className="w-2.5 h-2.5 text-green-600" />
                      ) : (
                        <Copy className="w-2.5 h-2.5" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">{radius.value}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
