import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ElicitationCard } from '@/types/elicitation.types';
import { PriorityIndicator } from '@/components/requirements/PriorityIndicator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CardEditIndicator } from './CardEditIndicator';

interface KanbanCardProps {
  card: ElicitationCard;
  onEdit: (card: ElicitationCard) => void;
  onDelete: (cardId: string) => void;
  onConvert: (card: ElicitationCard) => void;
  editingBy?: {
    userName: string;
    userInitials: string;
    userColor: string;
  };
}

export function KanbanCard({ card, onEdit, onDelete, onConvert, editingBy }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={cn(
        'relative bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all cursor-move',
        isDragging && 'opacity-50 shadow-lg scale-105',
        editingBy && 'ring-2 ring-offset-1'
      )}
    >
      {editingBy && (
        <CardEditIndicator
          userName={editingBy.userName}
          userInitials={editingBy.userInitials}
          userColor={editingBy.userColor}
        />
      )}
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3" {...listeners}>
        <div className="flex items-start space-x-2 flex-1">
          <PriorityIndicator priority={card.priority} />
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {card.title}
          </h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-2">
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white z-50">
            <DropdownMenuItem onClick={() => onEdit(card)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            {card.column === 'done' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onConvert(card)}>
                  <FileText className="w-4 h-4 mr-2" />
                  Convert to Requirement
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(card.id)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Description */}
      {card.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Tags */}
      {card.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
              {tag}
            </Badge>
          ))}
          {card.tags.length > 3 && (
            <Badge variant="secondary" className="text-xs px-2 py-0">
              +{card.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      {/* Footer - Assignee */}
      {card.assignee && (
        <div className="flex items-center justify-end">
          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-medium">
            <User className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
}
