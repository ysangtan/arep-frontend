import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DesignTokens } from '@/components/design-system/DesignTokens';
import { ComponentsLibrary } from '@/components/design-system/ComponentsLibrary';
import { Download, Palette, Box } from 'lucide-react';
import { toast } from 'sonner';

export default function DesignSystem() {
  const exportTokens = () => {
    const tokens = {
      colors: {
        primary: 'hsl(221.2 83.2% 53.3%)',
        'primary-foreground': 'hsl(210 40% 98%)',
        secondary: 'hsl(210 40% 96.1%)',
        'secondary-foreground': 'hsl(222.2 47.4% 11.2%)',
        accent: 'hsl(210 40% 96.1%)',
        'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(210 40% 98%)',
        muted: 'hsl(210 40% 96.1%)',
        'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(221.2 83.2% 53.3%)',
      },
      typography: {
        fontFamily: {
          sans: ['Inter', 'system-ui', 'sans-serif'],
          mono: ['Monaco', 'Courier New', 'monospace'],
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
        },
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      borderRadius: {
        none: '0px',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
        full: '9999px',
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
      },
    };

    const json = JSON.stringify(tokens, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arep-design-tokens.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Design tokens exported successfully');
  };

  const exportTailwindConfig = () => {
    const config = `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: 'hsl(221.2 83.2% 53.3%)',
        'primary-foreground': 'hsl(210 40% 98%)',
        secondary: 'hsl(210 40% 96.1%)',
        'secondary-foreground': 'hsl(222.2 47.4% 11.2%)',
        accent: 'hsl(210 40% 96.1%)',
        'accent-foreground': 'hsl(222.2 47.4% 11.2%)',
        destructive: 'hsl(0 84.2% 60.2%)',
        'destructive-foreground': 'hsl(210 40% 98%)',
        muted: 'hsl(210 40% 96.1%)',
        'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
        border: 'hsl(214.3 31.8% 91.4%)',
        input: 'hsl(214.3 31.8% 91.4%)',
        ring: 'hsl(221.2 83.2% 53.3%)',
      },
    },
  },
}`;

    const blob = new Blob([config], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tailwind.config.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Tailwind config exported successfully');
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Design System</h1>
          <p className="text-muted-foreground mt-1">
            Explore design tokens, components, and patterns used in AREP
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportTailwindConfig}>
            <Download className="w-4 h-4 mr-2" />
            Export Tailwind Config
          </Button>
          <Button onClick={exportTokens}>
            <Download className="w-4 h-4 mr-2" />
            Export Tokens (JSON)
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Design Tokens</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Color palette, typography, spacing, shadows, and border radius values
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Box className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Components</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Interactive UI components with live previews and code examples
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Export</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Download design tokens as JSON or Tailwind configuration file
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tokens" className="space-y-6">
        <TabsList>
          <TabsTrigger value="tokens">Design Tokens</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="patterns">Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="tokens" className="space-y-6">
          <DesignTokens />
        </TabsContent>

        <TabsContent value="components" className="space-y-6">
          <ComponentsLibrary />
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Design Patterns</CardTitle>
              <CardDescription>
                Common patterns and best practices for consistent UX
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Form Layout</h3>
                  <p className="text-sm text-muted-foreground">
                    Use consistent spacing between form fields. Group related inputs together.
                    Always include labels and validation feedback.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Data Tables</h3>
                  <p className="text-sm text-muted-foreground">
                    Implement search, filter, and sort functionality. Use pagination for large
                    datasets. Provide row actions and bulk operations where applicable.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Modals & Dialogs</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep modal content focused. Always provide a clear way to close. Use
                    destructive actions with confirmation dialogs.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Feedback & Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Use toast notifications for success/error messages. Display inline validation
                    errors. Provide loading states for async operations.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Responsive Design</h3>
                  <p className="text-sm text-muted-foreground">
                    Design mobile-first. Use responsive grid layouts. Hide secondary information
                    on mobile. Ensure touch targets are at least 44x44px.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Use semantic HTML. Provide proper ARIA labels. Ensure keyboard navigation
                    works. Maintain sufficient color contrast (WCAG AA).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
