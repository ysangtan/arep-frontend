import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Copy, Check, AlertCircle, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ComponentExampleProps {
  title: string;
  description: string;
  preview: React.ReactNode;
  code: string;
}

function ComponentExample({ title, description, preview, code }: ComponentExampleProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={copyCode}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-6 border rounded-lg bg-muted/50">{preview}</div>
        <Accordion type="single" collapsible>
          <AccordionItem value="code" className="border-none">
            <AccordionTrigger className="text-sm hover:no-underline">
              View Code
            </AccordionTrigger>
            <AccordionContent>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-xs">{code}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function ComponentsLibrary() {
  return (
    <div className="space-y-6">
      {/* Buttons */}
      <ComponentExample
        title="Button"
        description="Trigger actions and events with various styles and sizes"
        preview={
          <div className="flex flex-wrap gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
        }
        code={`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>`}
      />

      {/* Badges */}
      <ComponentExample
        title="Badge"
        description="Display status, categories, or metadata"
        preview={
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        }
        code={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>`}
      />

      {/* Inputs */}
      <ComponentExample
        title="Input"
        description="Text input field with label"
        preview={
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" />
          </div>
        }
        code={`<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="name@example.com" />
</div>`}
      />

      {/* Textarea */}
      <ComponentExample
        title="Textarea"
        description="Multi-line text input"
        preview={
          <div className="space-y-2 max-w-sm">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Enter your message..." rows={4} />
          </div>
        }
        code={`<div className="space-y-2">
  <Label htmlFor="message">Message</Label>
  <Textarea id="message" placeholder="Enter your message..." rows={4} />
</div>`}
      />

      {/* Switch */}
      <ComponentExample
        title="Switch"
        description="Toggle between two states"
        preview={
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode">Airplane Mode</Label>
          </div>
        }
        code={`<div className="flex items-center space-x-2">
  <Switch id="airplane-mode" />
  <Label htmlFor="airplane-mode">Airplane Mode</Label>
</div>`}
      />

      {/* Checkbox */}
      <ComponentExample
        title="Checkbox"
        description="Select multiple options"
        preview={
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="marketing" />
              <Label htmlFor="marketing">Receive marketing emails</Label>
            </div>
          </div>
        }
        code={`<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`}
      />

      {/* Radio Group */}
      <ComponentExample
        title="Radio Group"
        description="Select a single option from a group"
        preview={
          <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-one" id="option-one" />
              <Label htmlFor="option-one">Option One</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="option-two" id="option-two" />
              <Label htmlFor="option-two">Option Two</Label>
            </div>
          </RadioGroup>
        }
        code={`<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <Label htmlFor="option-one">Option One</Label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <Label htmlFor="option-two">Option Two</Label>
  </div>
</RadioGroup>`}
      />

      {/* Alert */}
      <ComponentExample
        title="Alert"
        description="Display important messages and notifications"
        preview={
          <div className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational message for the user.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Something went wrong. Please try again.
              </AlertDescription>
            </Alert>
          </div>
        }
        code={`<Alert>
  <Info className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational message for the user.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Something went wrong. Please try again.
  </AlertDescription>
</Alert>`}
      />

      {/* Progress */}
      <ComponentExample
        title="Progress"
        description="Show task completion status"
        preview={
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>60%</span>
              </div>
              <Progress value={60} />
            </div>
          </div>
        }
        code={`<div className="space-y-2">
  <div className="flex justify-between text-sm">
    <span>Progress</span>
    <span>60%</span>
  </div>
  <Progress value={60} />
</div>`}
      />

      {/* Tabs */}
      <ComponentExample
        title="Tabs"
        description="Organize content into separate views"
        preview={
          <Tabs defaultValue="account" className="w-full">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              <p className="text-sm text-muted-foreground">Account settings content</p>
            </TabsContent>
            <TabsContent value="password">
              <p className="text-sm text-muted-foreground">Password settings content</p>
            </TabsContent>
          </Tabs>
        }
        code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    <p>Account settings content</p>
  </TabsContent>
  <TabsContent value="password">
    <p>Password settings content</p>
  </TabsContent>
</Tabs>`}
      />

      {/* Card */}
      <ComponentExample
        title="Card"
        description="Container for grouping related content"
        preview={
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">This is the card content area.</p>
            </CardContent>
          </Card>
        }
        code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>This is the card content area.</p>
  </CardContent>
</Card>`}
      />

      {/* Separator */}
      <ComponentExample
        title="Separator"
        description="Visual divider between content sections"
        preview={
          <div className="space-y-4">
            <div>Section 1</div>
            <Separator />
            <div>Section 2</div>
          </div>
        }
        code={`<div className="space-y-4">
  <div>Section 1</div>
  <Separator />
  <div>Section 2</div>
</div>`}
      />
    </div>
  );
}
