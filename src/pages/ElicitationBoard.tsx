import { useState, useEffect } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { KanbanColumn } from '@/components/elicitation/KanbanColumn';
import { KanbanCard } from '@/components/elicitation/KanbanCard';
import { CardFormDialog } from '@/components/elicitation/CardFormDialog';
import { PresenceBar, ActiveUser } from '@/components/elicitation/PresenceBar';
import { ElicitationCard, ElicitationColumn } from '@/types/elicitation.types';
import { mockElicitationCards } from '@/services/elicitationMockData';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

const columns: { id: ElicitationColumn; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// Mock active users and editing state
const mockUsers: ActiveUser[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', color: '#6366f1' },
  { id: '2', name: 'Mike Johnson', initials: 'MJ', color: '#ec4899' },
  { id: '3', name: 'Alex Kim', initials: 'AK', color: '#10b981' },
];

const ElicitationBoard = () => {
  const [cards, setCards] = useState<ElicitationCard[]>(mockElicitationCards);
  const [activeCard, setActiveCard] = useState<ElicitationCard | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ElicitationCard | undefined>(undefined);
  const [defaultColumn, setDefaultColumn] = useState<ElicitationColumn | undefined>(undefined);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [editingCards, setEditingCards] = useState<Map<string, { userName: string; userInitials: string; userColor: string }>>(new Map());
  const { toast } = useToast();
  const navigate = useNavigate();

  // Simulate real-time presence
  useEffect(() => {
    // Simulate users joining
    const timer1 = setTimeout(() => {
      setActiveUsers([mockUsers[0]]);
    }, 1000);
    
    const timer2 = setTimeout(() => {
      setActiveUsers([mockUsers[0], mockUsers[1]]);
    }, 3000);
    
    const timer3 = setTimeout(() => {
      setActiveUsers([mockUsers[0], mockUsers[1], mockUsers[2]]);
    }, 5000);

    // Simulate users leaving randomly
    const intervalId = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setActiveUsers(prev => {
        const exists = prev.some(u => u.id === randomUser.id);
        if (exists) {
          return prev.filter(u => u.id !== randomUser.id);
        } else {
          return [...prev, randomUser];
        }
      });
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(intervalId);
    };
  }, []);

  // Simulate cards being edited by others
  useEffect(() => {
    const simulateEditing = () => {
      if (cards.length === 0) return;
      
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      
      setEditingCards(prev => {
        const newMap = new Map(prev);
        if (newMap.has(randomCard.id)) {
          newMap.delete(randomCard.id);
        } else {
          newMap.set(randomCard.id, {
            userName: randomUser.name,
            userInitials: randomUser.initials,
            userColor: randomUser.color,
          });
        }
        return newMap;
      });
    };

    const intervalId = setInterval(simulateEditing, 8000);
    return () => clearInterval(intervalId);
  }, [cards]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over) return;

    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) return;

    // Check if dropped on a column
    const overColumn = columns.find(col => col.id === over.id);
    const targetColumn = overColumn ? overColumn.id : activeCard.column;

    if (activeCard.column !== targetColumn) {
      // Moving to a different column
      const updatedCards = cards.map(card => {
        if (card.id === activeCard.id) {
          return { ...card, column: targetColumn, updatedAt: new Date().toISOString() };
        }
        return card;
      });

      setCards(updatedCards);
      
      toast({
        title: 'Card Moved',
        description: `Moved to ${targetColumn.replace('-', ' ')}`,
      });
    }
  };

  const handleAddCard = (column: ElicitationColumn) => {
    setEditingCard(undefined);
    setDefaultColumn(column);
    setDialogOpen(true);
  };

  const handleEditCard = (card: ElicitationCard) => {
    setEditingCard(card);
    setDefaultColumn(undefined);
    setDialogOpen(true);
  };

  const handleDeleteCard = (cardId: string) => {
    setCards(cards.filter(c => c.id !== cardId));
    toast({
      title: 'Card Deleted',
      description: 'The card has been removed.',
    });
  };

  const handleSaveCard = (data: Partial<ElicitationCard>) => {
    if (data.id) {
      // Editing existing card
      setCards(cards.map(card => 
        card.id === data.id 
          ? { ...card, ...data, updatedAt: new Date().toISOString() }
          : card
      ));
      toast({
        title: 'Card Updated',
        description: 'Changes have been saved.',
      });
    } else {
      // Creating new card
      const newCard: ElicitationCard = {
        id: `card-${Date.now()}`,
        title: data.title!,
        description: data.description,
        column: data.column || defaultColumn || 'backlog',
        position: cards.filter(c => c.column === (data.column || defaultColumn)).length,
        priority: data.priority || 'medium',
        tags: data.tags || [],
        createdBy: '2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCards([...cards, newCard]);
      toast({
        title: 'Card Created',
        description: 'New card has been added.',
      });
    }
  };

  const handleConvertCard = (card: ElicitationCard) => {
    toast({
      title: 'Converting to Requirement',
      description: `Converting "${card.title}" to a formal requirement...`,
    });
    
    // In real app, this would create a requirement and navigate to it
    setTimeout(() => {
      navigate('/requirements/new');
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Elicitation Board</h1>
          <p className="text-muted-foreground mt-1">
            Refine ideas before creating formal requirements
          </p>
        </div>
      </div>

      {/* Presence Bar */}
      <PresenceBar activeUsers={activeUsers} />

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Drag cards between columns to track progress. 
            Once refined in "Done", convert cards to formal requirements for review and approval.
          </p>
        </div>
      </div>

      {/* Kanban Board */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
          {columns.map(column => (
            <KanbanColumn
              key={column.id}
              column={column.id}
              title={column.title}
              cards={getCardsByColumn(column.id, cards)}
              onAddCard={handleAddCard}
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
              onConvertCard={handleConvertCard}
              editingCards={editingCards}
            />
          ))}
        </div>

        <DragOverlay>
          {activeCard ? (
            <div className="rotate-3 scale-105">
              <KanbanCard
                card={activeCard}
                onEdit={() => {}}
                onDelete={() => {}}
                onConvert={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Card Form Dialog */}
      <CardFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSaveCard}
        card={editingCard}
        defaultColumn={defaultColumn}
      />
    </div>
  );
};

// Helper function to get cards by column
function getCardsByColumn(column: ElicitationColumn, allCards: ElicitationCard[]): ElicitationCard[] {
  return allCards
    .filter(card => card.column === column)
    .sort((a, b) => a.position - b.position);
}

export default ElicitationBoard;
