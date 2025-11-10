import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { ElicitationCard, ElicitationColumn } from '@/types/elicitation.types';
import { Priority } from '@/types/requirement.types';

interface CardFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Partial<ElicitationCard>) => void;
  card?: ElicitationCard;
  defaultColumn?: ElicitationColumn;
}

export function CardFormDialog({
  open,
  onClose,
  onSave,
  card,
  defaultColumn,
}: CardFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tags, setTags] = useState('');

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description || '');
      setPriority(card.priority);
      setTags(card.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setTags('');
    }
  }, [card, open]);

  const handleSave = () => {
    if (!title.trim()) return;

    const data: Partial<ElicitationCard> = {
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      tags: tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0),
    };

    if (card) {
      data.id = card.id;
    } else if (defaultColumn) {
      data.column = defaultColumn;
    }

    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{card ? 'Edit Card' : 'New Card'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter card title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
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

          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              placeholder="Separate with commas (e.g., ui, feature)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            {card ? 'Save Changes' : 'Add Card'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
