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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ChangeRequestType } from '@/types/changeRequest.types';
import { changeRequestService } from '@/services/changeRequestMockData';
import { mockRequirements } from '@/services/mockData';
import { X } from 'lucide-react';

const crSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  type: z.enum(['enhancement', 'bug-fix', 'scope-change', 'technical']),
  priority: z.enum(['high', 'medium', 'low']),
  businessJustification: z.string().min(20, 'Business justification is required'),
  urgency: z.enum(['immediate', 'high', 'medium', 'low']),
});

type CRFormData = z.infer<typeof crSchema>;

interface ChangeRequestFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ChangeRequestForm({ open, onOpenChange, onSuccess }: ChangeRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CRFormData>({
    resolver: zodResolver(crSchema),
    defaultValues: {
      type: 'enhancement',
      priority: 'medium',
      urgency: 'medium',
    },
  });

  const crType = watch('type');
  const priority = watch('priority');
  const urgency = watch('urgency');

  const onSubmit = async (data: CRFormData) => {
    if (selectedRequirements.length === 0) {
      toast.error('Please select at least one affected requirement');
      return;
    }

    setIsSubmitting(true);
    try {
      await changeRequestService.createChangeRequest({
        ...data,
        targetRequirements: selectedRequirements,
        requestedBy: '1',
        requestedByName: 'Current User',
      });
      toast.success('Change request created successfully');
      onSuccess();
      onOpenChange(false);
      reset();
      setSelectedRequirements([]);
    } catch (error) {
      toast.error('Failed to create change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRequirement = (reqId: string) => {
    setSelectedRequirements((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Change Request</DialogTitle>
          <DialogDescription>
            Submit a request to modify existing requirements or add new functionality.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Brief description of the change..."
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type *</Label>
              <Select
                value={crType}
                onValueChange={(value) => setValue('type', value as ChangeRequestType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enhancement">Enhancement</SelectItem>
                  <SelectItem value="bug-fix">Bug Fix</SelectItem>
                  <SelectItem value="scope-change">Scope Change</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority *</Label>
              <Select
                value={priority}
                onValueChange={(value) => setValue('priority', value as any)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency">Urgency *</Label>
            <Select
              value={urgency}
              onValueChange={(value) => setValue('urgency', value as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the requested change..."
              rows={4}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessJustification">Business Justification *</Label>
            <Textarea
              id="businessJustification"
              placeholder="Explain the business value, user impact, or compliance need..."
              rows={4}
              {...register('businessJustification')}
            />
            {errors.businessJustification && (
              <p className="text-sm text-destructive">{errors.businessJustification.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Affected Requirements *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select requirements that will be impacted by this change
            </p>
            <div className="border rounded-lg p-3 max-h-[200px] overflow-y-auto space-y-2">
              {mockRequirements.slice(0, 10).map((req) => {
                const isSelected = selectedRequirements.includes(req.reqId);
                return (
                  <div
                    key={req.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleRequirement(req.reqId)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {req.reqId}
                        </Badge>
                        <span className="text-sm font-medium">{req.title}</span>
                      </div>
                    </div>
                    {isSelected && (
                      <X className="w-4 h-4 text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
            {selectedRequirements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedRequirements.map((reqId) => (
                  <Badge key={reqId} variant="secondary" className="gap-1">
                    {reqId}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => toggleRequirement(reqId)}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Change Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
