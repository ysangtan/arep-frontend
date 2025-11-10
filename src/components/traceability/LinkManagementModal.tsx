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
import { toast } from 'sonner';
import { TraceabilityLink, ArtifactType, LinkType, LinkStatus } from '@/types/traceability.types';
import { traceabilityService } from '@/services/traceabilityMockData';

const linkSchema = z.object({
  artifactType: z.enum(['test', 'code', 'doc', 'design']),
  artifactId: z.string().min(1, 'Artifact ID is required'),
  artifactName: z.string().min(1, 'Artifact name is required'),
  artifactUrl: z.string().optional(),
  linkType: z.enum(['verifies', 'implements', 'describes', 'derives-from', 'depends-on']),
  status: z.enum(['active', 'broken', 'outdated']),
  notes: z.string().optional(),
});

type LinkFormData = z.infer<typeof linkSchema>;

interface LinkManagementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  requirementId: string;
  link?: TraceabilityLink;
  onSuccess: () => void;
}

export function LinkManagementModal({
  open,
  onOpenChange,
  requirementId,
  link,
  onSuccess,
}: LinkManagementModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!link;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<LinkFormData>({
    resolver: zodResolver(linkSchema),
    defaultValues: link
      ? {
          artifactType: link.artifactType,
          artifactId: link.artifactId,
          artifactName: link.artifactName,
          artifactUrl: link.artifactUrl || '',
          linkType: link.linkType,
          status: link.status,
          notes: link.notes || '',
        }
      : {
          artifactType: 'test',
          linkType: 'verifies',
          status: 'active',
        },
  });

  const artifactType = watch('artifactType');
  const linkType = watch('linkType');
  const status = watch('status');

  const onSubmit = async (data: LinkFormData) => {
    setIsSubmitting(true);
    try {
      if (isEditing && link) {
        await traceabilityService.updateLink(link.id, data);
        toast.success('Link updated successfully');
      } else {
        await traceabilityService.createLink({
          requirementId,
          artifactType: data.artifactType,
          artifactId: data.artifactId,
          artifactName: data.artifactName,
          artifactUrl: data.artifactUrl,
          linkType: data.linkType,
          status: data.status,
          notes: data.notes,
          createdBy: '1', // Current user ID
        });
        toast.success('Link created successfully');
      }
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update link' : 'Failed to create link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!link) return;
    
    setIsSubmitting(true);
    try {
      await traceabilityService.deleteLink(link.id);
      toast.success('Link deleted successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to delete link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Link' : 'Add New Link'}</DialogTitle>
          <DialogDescription>
            Link requirement {requirementId} to an artifact (test, code, documentation, or design).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="artifactType">Artifact Type *</Label>
              <Select
                value={artifactType}
                onValueChange={(value) => setValue('artifactType', value as ArtifactType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="code">Code</SelectItem>
                  <SelectItem value="doc">Documentation</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                </SelectContent>
              </Select>
              {errors.artifactType && (
                <p className="text-sm text-destructive">{errors.artifactType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkType">Link Type *</Label>
              <Select
                value={linkType}
                onValueChange={(value) => setValue('linkType', value as LinkType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="verifies">Verifies</SelectItem>
                  <SelectItem value="implements">Implements</SelectItem>
                  <SelectItem value="describes">Describes</SelectItem>
                  <SelectItem value="derives-from">Derives From</SelectItem>
                  <SelectItem value="depends-on">Depends On</SelectItem>
                </SelectContent>
              </Select>
              {errors.linkType && (
                <p className="text-sm text-destructive">{errors.linkType.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="artifactId">Artifact ID *</Label>
            <Input
              id="artifactId"
              placeholder="e.g., TEST-001, CODE-042"
              {...register('artifactId')}
            />
            {errors.artifactId && (
              <p className="text-sm text-destructive">{errors.artifactId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="artifactName">Artifact Name *</Label>
            <Input
              id="artifactName"
              placeholder="e.g., User Authentication Test Suite"
              {...register('artifactName')}
            />
            {errors.artifactName && (
              <p className="text-sm text-destructive">{errors.artifactName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="artifactUrl">Artifact URL/Path</Label>
            <Input
              id="artifactUrl"
              placeholder="e.g., /tests/auth.test.ts or https://..."
              {...register('artifactUrl')}
            />
            {errors.artifactUrl && (
              <p className="text-sm text-destructive">{errors.artifactUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select
              value={status}
              onValueChange={(value) => setValue('status', value as LinkStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
                <SelectItem value="outdated">Outdated</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-destructive">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about this link..."
              rows={3}
              {...register('notes')}
            />
          </div>

          <DialogFooter className="gap-2">
            {isEditing && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                Delete Link
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Link' : 'Create Link'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
