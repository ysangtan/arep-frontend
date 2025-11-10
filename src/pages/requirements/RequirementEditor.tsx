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
import { getRequirementById } from '@/services/mockData';
import { RequirementType, RequirementStatus, Priority } from '@/types/requirement.types';
import { ArrowLeft, Save, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RequirementEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = id !== 'new';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<RequirementType>('functional');
  const [status, setStatus] = useState<RequirementStatus>('draft');
  const [priority, setPriority] = useState<Priority>('medium');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState<string[]>(['']);
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      const requirement = getRequirementById(id);
      if (requirement) {
        setTitle(requirement.title);
        setDescription(requirement.description);
        setType(requirement.type);
        setStatus(requirement.status);
        setPriority(requirement.priority);
        setAcceptanceCriteria(requirement.acceptanceCriteria.length > 0 ? requirement.acceptanceCriteria : ['']);
        setTags(requirement.tags.join(', '));
      }
    }
  }, [id, isEditMode]);

  const addCriteria = () => {
    setAcceptanceCriteria([...acceptanceCriteria, '']);
  };

  const removeCriteria = (index: number) => {
    setAcceptanceCriteria(acceptanceCriteria.filter((_, i) => i !== index));
  };

  const updateCriteria = (index: number, value: string) => {
    const updated = [...acceptanceCriteria];
    updated[index] = value;
    setAcceptanceCriteria(updated);
  };

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Title is required',
      });
      return;
    }

    if (!description.trim()) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Description is required',
      });
      return;
    }

    // Mock save - in real app, this would call your backend
    toast({
      title: isEditMode ? 'Requirement Updated' : 'Requirement Created',
      description: `${title} has been ${isEditMode ? 'updated' : 'created'} successfully.`,
    });

    navigate('/requirements');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/requirements')}
          >
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
          <Button variant="outline" onClick={() => navigate('/requirements')}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
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
            />
          </div>

          {/* Type, Status, Priority Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as RequirementType)}>
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="non-functional">Non-Functional</SelectItem>
                  <SelectItem value="constraint">Constraint</SelectItem>
                  <SelectItem value="business-rule">Business Rule</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as RequirementStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="implemented">Implemented</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Acceptance Criteria */}
          <div className="space-y-2">
            <Label>Acceptance Criteria</Label>
            <div className="space-y-3">
              {acceptanceCriteria.map((criteria, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Acceptance criteria ${index + 1}`}
                      value={criteria}
                      onChange={(e) => updateCriteria(index, e.target.value)}
                    />
                  </div>
                  {acceptanceCriteria.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCriteria(index)}
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
            />
            <p className="text-xs text-muted-foreground">
              Tags help categorize and filter requirements
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequirementEditor;
