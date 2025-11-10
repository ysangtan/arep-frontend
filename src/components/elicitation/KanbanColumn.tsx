import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ElicitationCard, ElicitationColumn } from '@/types/elicitation.types';
import { KanbanCard } from './KanbanCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KanbanColumnProps {
  column: ElicitationColumn;
  title: string;
  cards: ElicitationCard[];
  onAddCard: (column: ElicitationColumn) => void;
  onEditCard: (card: ElicitationCard) => void;
  onDeleteCard: (cardId: string) => void;
  onConvertCard: (card: ElicitationCard) => void;
  editingCards?: Map<string, { userName: string; userInitials: string; userColor: string }>;
}

const columnColors: Record<ElicitationColumn, string> = {
  'backlog': 'border-t-gray-400 bg-gray-50',
  'in-progress': 'border-t-blue-400 bg-blue-50',
  'review': 'border-t-amber-400 bg-amber-50',
  'done': 'border-t-green-400 bg-green-50',
};

const columnHeaderColors: Record<ElicitationColumn, string> = {
  'backlog': 'text-gray-700',
  'in-progress': 'text-blue-700',
  'review': 'text-amber-700',
  'done': 'text-green-700',
};

export function KanbanColumn({
  column,
  title,
  cards,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onConvertCard,
  editingCards,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column,
  });

  return (
    <div
      className={cn(
        'flex flex-col h-full rounded-xl border-2 border-t-4 transition-colors',
        columnColors[column],
        isOver && 'border-primary bg-primary-50'
      )}
    >
      {/* Column Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className={cn('text-lg font-bold', columnHeaderColors[column])}>
            {title}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600 bg-white px-2 py-1 rounded-lg">
              {cards.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onAddCard(column)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 px-4 pb-4 overflow-y-auto space-y-3 min-h-[200px]"
      >
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {cards.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <p className="text-sm text-gray-400 mb-2">No cards yet</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddCard(column)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </Button>
            </div>
          ) : (
            cards.map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                  onEdit={onEditCard}
                  onDelete={onDeleteCard}
                  onConvert={onConvertCard}
                  editingBy={editingCards?.get(card.id)}
                />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
}
