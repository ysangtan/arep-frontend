import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Info } from 'lucide-react';
import { projectTemplates, projectService } from '@/services/projectMockData';
import { ProjectTemplate } from '@/types/project.types';
import { useToast } from '@/hooks/use-toast';

const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters').max(100, 'Project name must be less than 100 characters'),
  key: z
    .string()
    .min(2, 'Project key must be 2-5 uppercase letters')
    .max(5, 'Project key must be 2-5 uppercase letters')
    .regex(/^[A-Z]{2,5}$/, 'Project key must be 2-5 uppercase letters (e.g., MAR, CPV2)'),
  template: z.enum(['blank', 'software-dev', 'mobile-app', 'enterprise', 'api'] as const),
  description: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface CreateProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated?: () => void;
}

export function CreateProjectDialog({ open, onOpenChange, onProjectCreated }: CreateProjectDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      key: '',
      template: 'software-dev',
      description: '',
    },
  });

  const keyValue = form.watch('key');

  const onSubmit = async (data: ProjectFormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await projectService.createProject({
        name: data.name,
        key: data.key,
        template: data.template,
        description: data.description,
      });
      
      toast({
        title: 'Project created',
        description: `${data.name} (${data.key}) has been created successfully.`,
      });

      form.reset();
      onOpenChange(false);
      onProjectCreated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Set up a new project to organize your requirements and team collaboration.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Marketing Platform Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Key *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="MAR"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      maxLength={5}
                    />
                  </FormControl>
                  <FormDescription>
                    2-5 uppercase letters (e.g., MAR, CPV2, PAY)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {keyValue && keyValue.length >= 2 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Requirements will be named like: <strong>{keyValue}-001</strong>, <strong>{keyValue}-002</strong>, etc.
                </AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Template *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a template" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {projectTemplates.map((template) => (
                        <SelectItem key={template.value} value={template.value}>
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{template.label}</span>
                            <span className="text-xs text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of the project..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
