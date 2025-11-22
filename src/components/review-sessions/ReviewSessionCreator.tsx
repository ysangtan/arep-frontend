import { useEffect, useMemo, useState } from 'react';
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
import { X, Calendar } from 'lucide-react';

import { useProject } from '@/contexts/ProjectContext';
import {
  RequirementsService,
  Requirement,
  ListEnvelope as ReqListEnvelope,
} from '@/services/requirements.service';
import {
  UsersService,
  User,
  ListEnvelope as UserListEnvelope,
} from '@/services/users.service';
import { ReviewSessionsService } from '@/services/review-sessions.service';

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
  const { project } = useProject(); // { id, name, key }
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [people, setPeople] = useState<User[]>([]);
  const [loadingReqs, setLoadingReqs] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);

  const [selectedRequirementIds, setSelectedRequirementIds] = useState<string[]>([]);
  const [selectedParticipantIds, setSelectedParticipantIds] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
  });

  // Load requirements for the active project when the dialog opens
// Load only requirements whose elicitation column = "review"
useEffect(() => {
  const fetchRequirements = async () => {
    if (!open) return;
    if (!project?.id) {
      toast.error('No project selected. Please pick a project first.');
      return;
    }

    try {
      setLoadingReqs(true);

      // ✅ Directly ask backend for only "review" ones
      const data = await RequirementsService.findAllByProjectAndElicitation(project.id, 'review');
      const items = Array.isArray(data) ? data : (data as ReqListEnvelope<Requirement>).items;
      setRequirements(items ?? []);
    } catch (err) {
      console.error('[ReviewSessionCreator] Failed to load review requirements:', err);
      toast.error('Failed to load review requirements');
    } finally {
      setLoadingReqs(false);
    }
  };

  fetchRequirements();
}, [open, project?.id]);


  // Load people (users) for selection when dialog opens
  useEffect(() => {
    const fetchPeople = async () => {
      if (!open) return;
      try {
        setLoadingPeople(true);
        const data = await UsersService.findAll();
        const items = Array.isArray(data) ? data : (data as UserListEnvelope<User>).items;
        setPeople(items.filter(u => u.isActive));
      } catch (err) {
        console.error('[ReviewSessionCreator] Failed to load users:', err);
        toast.error('Failed to load users');
      } finally {
        setLoadingPeople(false);
      }
    };
    fetchPeople();
  }, [open]);

  const onSubmit = async (data: SessionFormData) => {
    if (!project?.id) {
      toast.error('No project selected. Please pick a project first.');
      return;
    }
    if (selectedRequirementIds.length === 0) {
      toast.error('Please select at least one requirement to review');
      return;
    }
    if (selectedParticipantIds.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewSessionsService.create({
        name: data.name,
        projectId: project.id,
        description: data.description,
        scheduledAt: data.scheduledAt,
        requirementIds: selectedRequirementIds,
        // backend expects { userId } objects for participants
        participants: selectedParticipantIds.map(id => ({ userId: id })),
      });

      toast.success('Review session created successfully');
      onSuccess();
      onOpenChange(false);
      reset();
      setSelectedRequirementIds([]);
      setSelectedParticipantIds([]);
    } catch (error) {
      console.error('[ReviewSessionCreator] create session error:', error);
      toast.error('Failed to create review session');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleRequirement = (id: string) => {
    setSelectedRequirementIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const toggleParticipant = (id: string) => {
    setSelectedParticipantIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const requirementById = useMemo(
    () => new Map(requirements.map(r => [r._id, r])),
    [requirements],
  );

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
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Session Name *</Label>
            <Input id="name" placeholder="Q1 Requirements Review..." {...register('name')} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Description */}
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

          {/* Schedule */}
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Schedule Date & Time</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input id="scheduledAt" type="datetime-local" className="pl-10" {...register('scheduledAt')} />
            </div>
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label>Requirements to Review *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select requirements for this session
            </p>

            <div className="border rounded-lg p-3 max-h-[220px] overflow-y-auto space-y-2">
              {loadingReqs ? (
                <div className="text-sm text-muted-foreground px-2 py-4">Loading requirements…</div>
              ) : requirements.length === 0 ? (
                <div className="text-sm text-muted-foreground px-2 py-4">
                  No requirements found for this project.
                </div>
              ) : (
                requirements.map(req => {
                  const isSelected = selectedRequirementIds.includes(req._id);
                  return (
                    <div
                      key={req._id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => toggleRequirement(req._id)}
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
                })
              )}
            </div>

            {selectedRequirementIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedRequirementIds.map(reqDbId => {
                  const r = requirementById.get(reqDbId);
                  return (
                    <Badge key={reqDbId} variant="secondary" className="gap-1">
                      {r?.reqId ?? reqDbId.slice(0, 6)}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => toggleRequirement(reqDbId)} />
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Participants */}
          <div className="space-y-2">
            <Label>Participants *</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Select team members for this session
            </p>

            <div className="border rounded-lg p-3 max-h-[220px] overflow-y-auto space-y-2">
              {loadingPeople ? (
                <div className="text-sm text-muted-foreground px-2 py-4">Loading people…</div>
              ) : people.length === 0 ? (
                <div className="text-sm text-muted-foreground px-2 py-4">
                  No users available or you lack permission to view them.
                </div>
              ) : (
                people.map(person => {
                  const isSelected = selectedParticipantIds.includes(person._id);
                  return (
                    <div
                      key={person._id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10 border border-primary' : 'hover:bg-accent'
                      }`}
                      onClick={() => toggleParticipant(person._id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm">
                          {person.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{person.fullName}</div>
                          <div className="text-xs text-muted-foreground">{person.email}</div>
                        </div>
                      </div>
                      {isSelected && <X className="w-4 h-4 text-primary" />}
                    </div>
                  );
                })
              )}
            </div>

            {selectedParticipantIds.length > 0 && (
              <p className="text-sm text-muted-foreground">
                {selectedParticipantIds.length} participant(s) selected
              </p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !project?.id}>
              {isSubmitting ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
