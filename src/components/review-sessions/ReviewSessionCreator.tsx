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
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { reviewSessionService, mockParticipants } from '@/services/reviewSessionMockData';
import { mockRequirements } from '@/services/mockData';
import { X, Calendar } from 'lucide-react';
import { Participant } from '@/types/reviewSession.types';

const sessionSchema = z.object({
  name: z.string().min(5, 'Name must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  scheduledAt: z.string().optional(),
});

type SessionFormData = z.infer<typeof sessionSchema>;

interface ReviewSessionCreatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReviewSessionCreator({ open, onOpenChange, onSuccess }: ReviewSessionCreatorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
  });

  const onSubmit = async (data: SessionFormData) => {
    if (selectedRequirements.length === 0) {
      toast.error('Please select at least one requirement to review');
      return;
    }
    if (selectedParticipants.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setIsSubmitting(true);
    try {
      const participants = mockParticipants.filter((p) =>
        selectedParticipants.includes(p.id)
      );

      await reviewSessionService.createSession({
        ...data,
        requirementIds: selectedRequirements,
        participants,
      });

      toast.success('Review session created successfully');
      onSuccess();
      onOpenChange(false);
      reset();
      setSelectedRequirements([]);
      setSelectedParticipants([]);
    } catch (error) {
      toast.error('Failed to create review session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRequirement = (reqId: string) => {
    setSelectedRequirements((prev) =>
      prev.includes(reqId) ? prev.filter((id) => id !== reqId) : [...prev, reqId]
    );
  };

  const toggleParticipant = (participantId: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId)
        ? prev.filter((id) => id !== participantId)
        : [...prev, participantId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Review Session</DialogTitle>
          <DialogDescription>
            Set up a facilitated review session with participants and requirements
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Session Name *</Label>
            <Input
              id="name"
              placeholder="Q1 Requirements Review..."
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose and scope of this review session..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="scheduledAt"
                type="datetime-local"
                className="pl-10"
                {...register('scheduledAt')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Requirements to Review *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select requirements for this session
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
                    {isSelected && <X className="w-4 h-4 text-primary" />}
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

          <div className="space-y-2">
            <Label>Participants *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select team members for this session
            </p>
            <div className="border rounded-lg p-3 space-y-2">
              {mockParticipants.map((participant) => {
                const isSelected = selectedParticipants.includes(participant.id);
                return (
                  <div
                    key={participant.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-accent'
                    }`}
                    onClick={() => toggleParticipant(participant.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-sm">{participant.name}</div>
                        <div className="text-xs text-muted-foreground">{participant.role}</div>
                      </div>
                    </div>
                    {isSelected && <X className="w-4 h-4 text-primary" />}
                  </div>
                );
              })}
            </div>
            {selectedParticipants.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedParticipants.length} participant(s) selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
