// src/pages/requirements/RequirementEditor.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

import RequirementsService, {
  RequirementType,
  RequirementStatus,
  Priority,
  CreateRequirementDto,
  UpdateRequirementDto,
} from '@/services/requirements.service';

type Props = {
  /** Provide the active project id for create flow */
  projectId?: string;
};

const RequirementEditor = ({ projectId }: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isEditMode = id !== 'new';

  // form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequirementType>(RequirementType.FUNCTIONAL);
  const [status, setStatus] = useState<RequirementStatus>(RequirementStatus.DRAFT);
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);
  const [tags, setTags] = useState(''); // CSV in UI

  // ui state
  const [loading, setLoading] = useState<boolean>(isEditMode); // load data if edit
  const [saving, setSaving] = useState<boolean>(false);

  // Load for edit mode
  useEffect(() => {
    let alive = true;
    const load = async () => {
      if (!isEditMode || !id) return;
      setLoading(true);
      try {
        const req = await RequirementsService.findOne(id);
        if (!alive) return;

        setTitle(req.title ?? '');
        setDescription(req.description ?? '');
        setType((req.type as RequirementType) ?? RequirementType.FUNCTIONAL);
        setStatus((req.status as RequirementStatus) ?? RequirementStatus.DRAFT);
        setPriority((req.priority as Priority) ?? Priority.MEDIUM);
        setAcceptanceCriteria(
          Array.isArray(req.acceptanceCriteria) && req.acceptanceCriteria.length > 0
            ? req.acceptanceCriteria
            : ['']
        );
        setTags((req.tags ?? []).join(', '));
      } catch (e: any) {
        if (!alive) return;
        toast({
          variant: 'destructive',
          title: 'Failed to load',
          description: e?.response?.data?.message ?? e?.message ?? 'Could not load the requirement.',
        });
        // If load fails, navigate back
        navigate('/requirements');
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    return () => {
      alive = false;
    };
  }, [id, isEditMode, navigate, toast]);

  // helpers
  const addCriteria = () => {
    setAcceptanceCriteria((prev) => [...prev, '']);
  };

  const removeCriteria = (index: number) => {
    setAcceptanceCriteria((prev) => prev.filter((_, i) => i !== index));
  };

  const updateCriteria = (index: number, value: string) => {
    setAcceptanceCriteria((prev) => {
      const cloned = [...prev];
      cloned[index] = value;
      return cloned;
    });
  };

  const parseTags = (val: string): string[] =>
    val
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const cleanedCriteria = (): string[] =>
    (acceptanceCriteria ?? []).map((c) => c.trim()).filter(Boolean);

  const handleSave = async () => {
    // basic client validation (matches your DTO constraints roughy)
    if (!title.trim()) {
      toast({ variant: 'destructive', title: 'Validation Error', description: 'Title is required' });
      return;
    }
    if (title.trim().length < 5 || title.trim().length > 200) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Title must be between 5 and 200 characters',
      });
      return;
    }
    if (!description.trim() || description.trim().length < 10) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Description must be at least 10 characters',
      });
      return;
    }

    setSaving(true);
    try {
      if (isEditMode && id) {
        const dto: UpdateRequirementDto = {
          title: title.trim(),
          description: description.trim(),
          status, // allowed in Update DTO
          priority,
          acceptanceCriteria: cleanedCriteria(),
          tags: parseTags(tags),
          // type, // optional in Update DTO? (not required; but harmless if included)
        };
        await RequirementsService.update(id, dto);

        toast({
          title: 'Requirement Updated',
          description: `${title.trim()} has been updated successfully.`,
        });
      } else {
        // CREATE needs projectId
        if (!projectId) {
          toast({
            variant: 'destructive',
            title: 'Missing project',
            description:
              'A projectId is required to create a requirement. Provide it as a prop or derive it from route/context.',
          });
          setSaving(false);
          return;
        }
        const dto: CreateRequirementDto = {
          projectId,
          title: title.trim(),
          description: description.trim(),
          type,
          priority,
          acceptanceCriteria: cleanedCriteria(),
          tags: parseTags(tags),
          // assigneeId?: add if your UI captures it
        };
        const created = await RequirementsService.create(dto);

        toast({
          title: 'Requirement Created',
          description: `${title.trim()} has been created successfully.`,
        });

        // Navigate to the created requirement
        navigate(`/requirements/${created._id}`);
        return;
      }

      // On success (update), go back to list or to detail—choose your flow:
      navigate('/requirements');
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        'Failed to save requirement. Please check your inputs.';
      toast({ variant: 'destructive', title: 'Save failed', description: String(msg) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/requirements')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Requirement' : 'New Requirement'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditMode ? 'Update requirement details' : 'Create a new requirement'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => navigate('/requirements')} disabled={saving}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Requirement Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter a clear, concise requirement title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of the requirement"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              required
              disabled={loading}
            />
          </div>

          {/* Type, Status, Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as RequirementType)}
                disabled={loading}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value={RequirementType.FUNCTIONAL}>Functional</SelectItem>
                  <SelectItem value={RequirementType.NON_FUNCTIONAL}>Non-Functional</SelectItem>
                  <SelectItem value={RequirementType.CONSTRAINT}>Constraint</SelectItem>
                  <SelectItem value={RequirementType.BUSINESS_RULE}>Business Rule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as RequirementStatus)}
                disabled={!isEditMode || loading} // disable in create mode (Create DTO has no status)
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value={RequirementStatus.DRAFT}>Draft</SelectItem>
                  <SelectItem value={RequirementStatus.IN_REVIEW}>In Review</SelectItem>
                  <SelectItem value={RequirementStatus.APPROVED}>Approved</SelectItem>
                  <SelectItem value={RequirementStatus.REJECTED}>Rejected</SelectItem>
                  <SelectItem value={RequirementStatus.IMPLEMENTED}>Implemented</SelectItem>
                  <SelectItem value={RequirementStatus.VERIFIED}>Verified</SelectItem>
                  <SelectItem value={RequirementStatus.CLOSED}>Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
                disabled={loading}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value={Priority.HIGH}>High</SelectItem>
                  <SelectItem value={Priority.MEDIUM}>Medium</SelectItem>
                  <SelectItem value={Priority.LOW}>Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <Label>Acceptance Criteria</Label>
            <div className="space-y-3">
              {(acceptanceCriteria ?? []).map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Acceptance criteria ${index + 1}`}
                      value={criteria}
                      onChange={(e) => updateCriteria(index, e.target.value)}
                      disabled={loading}
                    />
                  </div>
                  {(acceptanceCriteria ?? []).length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCriteria(index)}
                      disabled={loading}
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCriteria}
                className="w-full"
                disabled={loading}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Criteria
              </Button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Separate tags with commas (e.g., security, authentication, api)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">Tags help categorize and filter requirements</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementEditor;
