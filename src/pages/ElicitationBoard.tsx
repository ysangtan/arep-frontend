import { useState, useEffect, useMemo } from 'react';
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
// import { mockElicitationCards } from '@/services/elicitationMockData'; // ⛔️ remove mock usage
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Info } from 'lucide-react';

// ✅ NEW: API service + project hook
import ElicitationService from '@/services/elicitation.service';
import { useProject } from '@/contexts/ProjectContext';

const columns: { id: ElicitationColumn; title: string }[] = [
  { id: 'backlog', title: 'Backlog' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'review', title: 'Review' },
  { id: 'done', title: 'Done' },
];

// Mock active users and editing state (kept as-is for presence simulation)
const mockUsers: ActiveUser[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', color: '#6366f1' },
  { id: '2', name: 'Mike Johnson', initials: 'MJ', color: '#ec4899' },
  { id: '3', name: 'Alex Kim', initials: 'AK', color: '#10b981' },
];

// ---- Helper mappers ---------------------------------------------------------

// The API object (Elicitation) doesn’t know about board-only fields.
// We add safe defaults client-side to keep your UI working 1:1.
function apiItemToCard(
  apiItem: {
    _id: string;
    title: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  },
  index: number
): ElicitationCard {
  return {
    id: apiItem._id,
    title: apiItem.title,
    description: apiItem.description,
    // Choose any default column; feel free to persist this server-side later
    column: 'backlog',
    position: index,
    priority: 'medium',
    tags: [],
    createdBy: apiItem.createdBy,
    createdAt: apiItem.createdAt,
    updatedAt: apiItem.updatedAt,
  };
}

function listToCards(
  list: Array<{
    _id: string;
    title: string;
    description?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
  }>
): ElicitationCard[] {
  return list.map((it, i) => apiItemToCard(it, i));
}

// ---------------------------------------------------------------------------

const ElicitationBoard = () => {
  const { project } = useProject(); // ✅ access project?.id
  const [cards, setCards] = useState<ElicitationCard[]>([]);
  const [activeCard, setActiveCard] = useState<ElicitationCard | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ElicitationCard | undefined>(undefined);
  const [defaultColumn, setDefaultColumn] = useState<ElicitationColumn | undefined>(undefined);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [editingCards, setEditingCards] = useState<
    Map<string, { userName: string; userInitials: string; userColor: string }>
  >(new Map());
  const { toast } = useToast();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  // ---------- Load from API whenever project changes ----------
  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!project?.id) return; // no project yet
      try {
        // GET /elicitation?projectId=...
        const result = await ElicitationService.findAll(project.id);

        // result can be Elicitation[] OR ListEnvelope<Elicitation>
        const items = Array.isArray(result) ? result : result.items;
        if (!items) return;

        const mapped = listToCards(items as any);
        if (!cancelled) setCards(mapped);
      } catch (err: any) {
        toast({
          title: 'Failed to load',
          description: err?.message ?? 'Could not fetch elicitation items.',
          variant: 'destructive',
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [project?.id, toast]);

  // -------- Simulated presence (unchanged) --------
  useEffect(() => {
    const timer1 = setTimeout(() => setActiveUsers([mockUsers[0]]), 1000);
    const timer2 = setTimeout(() => setActiveUsers([mockUsers[0], mockUsers[1]]), 3000);
    const timer3 = setTimeout(() => setActiveUsers([mockUsers[0], mockUsers[1], mockUsers[2]]), 5000);

    const intervalId = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setActiveUsers(prev => {
        const exists = prev.some(u => u.id === randomUser.id);
        return exists ? prev.filter(u => u.id !== randomUser.id) : [...prev, randomUser];
      });
    }, 10000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearInterval(intervalId);
    };
  }, []);

  // -------- Simulate remote editing (unchanged) --------
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (cards.length === 0) return;
      const randomCard = cards[Math.floor(Math.random() * cards.length)];
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      setEditingCards(prev => {
        const next = new Map(prev);
        if (next.has(randomCard.id)) next.delete(randomCard.id);
        else
          next.set(randomCard.id, {
            userName: randomUser.name,
            userInitials: randomUser.initials,
            userColor: randomUser.color,
          });
        return next;
      });
    }, 8000);
    return () => clearInterval(intervalId);
  }, [cards]);

  // ---------- DnD handlers ----------
  const handleDragStart = (event: DragStartEvent) => {
    const card = cards.find(c => c.id === event.active.id);
    setActiveCard(card || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const card = cards.find(c => c.id === active.id);
    if (!card) return;

    const overColumn = columns.find(col => col.id === over.id);
    const targetColumn = overColumn ? overColumn.id : card.column;
    if (card.column === targetColumn) return;

    // Optimistic local move (board-only metadata stays client-side)
    setCards(prev =>
      prev.map(c => (c.id === card.id ? { ...c, column: targetColumn, updatedAt: new Date().toISOString() } : c))
    );

    toast({
      title: 'Card Moved',
      description: `Moved to ${targetColumn.replace('-', ' ')}`,
    });

    // If you later persist column/position server-side, call:
    // await ElicitationService.update(card.id, { description: card.description })
  };

  // ---------- Card actions (Create / Update / Delete) ----------
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

  const handleDeleteCard = async (cardId: string) => {
    // Optimistic UI
    const prev = cards;
    setCards(prev.filter(c => c.id !== cardId));

    try {
      await ElicitationService.remove(cardId);
      toast({ title: 'Card Deleted', description: 'The card has been removed.' });
    } catch (err: any) {
      // Revert on error
      setCards(prev);
      toast({
        title: 'Delete failed',
        description: err?.message ?? 'Could not delete the item.',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCard = async (data: Partial<ElicitationCard>) => {
    // When editing: API has only title/description fields; we keep board metadata client-side
    if (data.id) {
      // optimistic update
      const prev = cards;
      const next = prev.map(card =>
        card.id === data.id
          ? { ...card, ...data, updatedAt: new Date().toISOString() }
          : card
      );
      setCards(next);

      try {
        await ElicitationService.update(data.id, {
          title: data.title,
          description: data.description,
        });
        toast({ title: 'Card Updated', description: 'Changes have been saved.' });
      } catch (err: any) {
        setCards(prev); // revert
        toast({
          title: 'Update failed',
          description: err?.message ?? 'Could not update the item.',
          variant: 'destructive',
        });
      }
    } else {
      // creating
      if (!project?.id) {
        toast({
          title: 'Missing project',
          description: 'Select a project before creating cards.',
          variant: 'destructive',
        });
        return;
      }

      // For now we use a known user id from your mock or auth store.
      const createdBy = '2';

      // Optimistic local card (temporary id)
      const tempId = `temp-${Date.now()}`;
      const newCard: ElicitationCard = {
        id: tempId,
        title: data.title!,
        description: data.description,
        column: data.column || defaultColumn || 'backlog',
        position: cards.filter(c => c.column === (data.column || defaultColumn || 'backlog')).length,
        priority: data.priority || 'medium',
        tags: data.tags || [],
        createdBy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCards(prev => [...prev, newCard]);

      try {
        const created = await ElicitationService.create({
          projectId: project.id,
          title: data.title!,
          description: data.description,
          createdBy,
        } as any);

        // Replace temp with server item
        setCards(prev =>
          prev.map(c => (c.id === tempId ? apiItemToCard(created as any, newCard.position) : c))
        );

        toast({ title: 'Card Created', description: 'New card has been added.' });
      } catch (err: any) {
        // remove temp on error
        setCards(prev => prev.filter(c => c.id !== tempId));
        toast({
          title: 'Create failed',
          description: err?.message ?? 'Could not create the item.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleConvertCard = (card: ElicitationCard) => {
    toast({
      title: 'Converting to Requirement',
      description: `Converting "${card.title}" to a formal requirement...`,
    });
    setTimeout(() => navigate('/requirements/new'), 1000);
  };

  // --------- Derived helpers ----------
  const cardsByColumn = useMemo(
    () => (column: ElicitationColumn) =>
      cards.filter(c => c.column === column).sort((a, b) => a.position - b.position),
    [cards]
  );

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
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
          {columns.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col.id}
              title={col.title}
              cards={cardsByColumn(col.id)}
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
              <KanbanCard card={activeCard} onEdit={() => {}} onDelete={() => {}} onConvert={() => {}} />
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

export default ElicitationBoard;
