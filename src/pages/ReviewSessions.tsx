// src/pages/reviews/ReviewSessions.tsx
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviewSessionCreator } from '@/components/review-sessions/ReviewSessionCreator';
import { ParticipantList } from '@/components/review-sessions/ParticipantList';
import { VotingPanel } from '@/components/review-sessions/VotingPanel';
import { DiscussionThread } from '@/components/review-sessions/DiscussionThread';

import {
  ReviewSessionsService,
  ReviewSession as ServiceReviewSession,
  VoteType,
  SessionVote,
} from '@/services/review-sessions.service';

import {
  Vote as UiVote,
  Comment as UiComment,
  Participant as UiParticipant,
} from '@/types/reviewSession.types';

import {
  Plus,
  Play,
  SkipForward,
  CheckCircle,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { useProject } from '@/contexts/ProjectContext';

// ---------- Display helpers ----------
// --- helpers ---
type AnyUserRef = string | { _id?: string; fullName?: string; email?: string };

// Extract a string id from either a raw id or a populated user object
const getUserIdVal = (u: AnyUserRef): string =>
  typeof u === 'string' ? u : (u?._id ?? '');

// Human-friendly display name (prefer fullName if populated, else fallback)
const getUserDisplay = (u: AnyUserRef): string => {
  if (typeof u === 'object') {
    if (u?.fullName && typeof u.fullName === 'string') return u.fullName;
    const id = u?._id ?? '';
    return id ? `User ${String(id).slice(0, 4)}` : 'User';
  }
  return u ? `User ${String(u).slice(0, 4)}` : 'User';
};

const resolveUserRole = (_userId: string) => 'Reviewer';

// Votes → UI
const toUiVote = (v: SessionVote): UiVote => {
  const userRef = v.userId as AnyUserRef;
  return {
    userId: getUserIdVal(userRef),
    userName: getUserDisplay(userRef),
    voteType: v.voteType,
    timestamp: v.createdAt,
  };
};

// Comments (stored on SessionVote.comment) → UI
const toUiComment = (v: SessionVote): UiComment | null => {
  if (!v.comment) return null;
  const userRef = v.userId as AnyUserRef;
  return {
    id: v._id,
    userId: getUserIdVal(userRef),
    userName: getUserDisplay(userRef),
    content: v.comment,
    timestamp: v.createdAt,
  };
};

// Participants → UI
const toUiParticipant = (
  p: ServiceReviewSession['participants'][number]
): UiParticipant => {
  const userRef = p.userId as AnyUserRef;
  const id = getUserIdVal(userRef);
  return {
    id,
    name: getUserDisplay(userRef),
    role: resolveUserRole(id),
    isOnline: !!p.isOnline,
    lastSeen: p.lastSeen
      ? p.lastSeen instanceof Date
        ? p.lastSeen.toISOString()
        : String(p.lastSeen)
      : undefined,
  };
};

export default function ReviewSessions() {
  const [sessions, setSessions] = useState<ServiceReviewSession[]>([]);
  const [activeSession, setActiveSession] = useState<ServiceReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [votes, setVotes] = useState<SessionVote[]>([]);
  const [loadingVotes, setLoadingVotes] = useState(false);
  const {project}=useProject()
  // ---------- Load sessions ----------
 const loadSessions = async (pid?: string) => {
  setIsLoading(true);
  try {
    // if you want to require a project to be selected, guard here:
    // if (!pid) { setSessions([]); return; }

    const data = await ReviewSessionsService.findAll(pid); // ✅ pass projectId
    const list = Array.isArray(data) ? data : data.items;
    setSessions(list);
  } catch (error) {
    toast.error('Failed to load review sessions');
    console.error('[ReviewSessions] loadSessions error:', error);
  } finally {
    setIsLoading(false);
  }
};

// Refetch when the active project changes
useEffect(() => {
  loadSessions(project?.id); // ✅ uses current project id (or undefined if none)
}, [project?.id]);

  // ---------- Current requirement id for active session ----------
  const currentRequirementId = useMemo(() => {
    if (!activeSession) return undefined;
    return activeSession.requirementIds[activeSession.currentRequirementIndex];
  }, [activeSession]);

  // ---------- Fetch votes for the current requirement ----------
  const refreshVotes = async (sessionId: string, requirementId: string) => {
    try {
      setLoadingVotes(true);
      console.log('[ReviewSessions] 🔄 refreshVotes()', { sessionId, requirementId });
      const data = await ReviewSessionsService.getVotes(sessionId, requirementId);
      const list = Array.isArray(data) ? data : data.items;
      setVotes(list);
      console.log('[ReviewSessions] ✅ votes refreshed:', list);
    } catch (error) {
      console.error('[ReviewSessions] refreshVotes error:', error);
    } finally {
      setLoadingVotes(false);
    }
  };

  useEffect(() => {
    if (!activeSession || !currentRequirementId) {
      setVotes([]);
      return;
    }
    refreshVotes(activeSession._id, currentRequirementId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSession?._id, activeSession?.currentRequirementIndex, currentRequirementId]);

  // ---------- Actions ----------
  const handleStartSession = async (sessionId: string) => {
    try {
      console.log('[ReviewSessions] ▶ startSession', { sessionId });
      const updated = await ReviewSessionsService.startSession(sessionId);
      setActiveSession(updated);
      setSessions(prev => prev.map(s => (s._id === sessionId ? updated : s)));
      toast.success('Session started');
    } catch (error) {
      toast.error('Failed to start session');
      console.error('[ReviewSessions] startSession error:', error);
    }
  };

  // ✅ REST-only vote (no websockets)
  const handleVote = async (voteType: VoteType) => {
    console.log('[ReviewSessions] 🟦 handleVote() called');
    console.log('  → voteType:', voteType);
    console.log('  → sessionId:', activeSession?._id);
    console.log('  → requirementId:', currentRequirementId);

    if (!activeSession) {
      console.warn('[ReviewSessions] ❌ No activeSession');
      toast.error('Missing session. Please re-open the session.');
      return;
    }
    if (!currentRequirementId) {
      console.warn('[ReviewSessions] ❌ No currentRequirementId');
      toast.error('Missing requirement. Please re-open the session.');
      return;
    }

    // Optional optimistic UI: replace current user's vote locally
    const me = 'me'; // ⬅ replace with real auth userId when available
    const optimistic: SessionVote = {
      _id: `temp-${Date.now()}`,
      sessionId: activeSession._id,
      requirementId: currentRequirementId,
      userId: me,
      voteType,
      comment: undefined,
      createdAt: new Date().toISOString(),
    };
    setVotes(prev => [...prev.filter(v => v.userId !== me), optimistic]);

    try {
      console.log(
        `[ReviewSessions] 📡 REST castVote → sessionId=${activeSession._id}, requirementId=${currentRequirementId}, voteType=${voteType}`
      );
      const res = await ReviewSessionsService.castVote(
        activeSession._id,
        currentRequirementId,
        voteType
      );
      console.log('[ReviewSessions] ✅ castVote response:', res);

      toast.success(`Voted: ${voteType.replace('-', ' ')}`);

      console.log('[ReviewSessions] 🔄 Refreshing votes from API…');
      await refreshVotes(activeSession._id, currentRequirementId);
      console.log('[ReviewSessions] ✅ Refresh complete');
    } catch (error: any) {
      console.error('[ReviewSessions] ❌ castVote error:', error);
      if (error?.response) {
        console.error('[ReviewSessions]   ↳ Response data:', error.response.data);
        console.error('[ReviewSessions]   ↳ Status:', error.response.status);
        console.error('[ReviewSessions]   ↳ Headers:', error.response.headers);
      }
      toast.error('Failed to submit vote');
      // best-effort re-sync (to drop the optimistic vote if server failed)
      await refreshVotes(activeSession._id, currentRequirementId);
    }
  };

  // Treat comments as votes with comment text; keep REST or leave as local-only depending on API
  const handleAddComment = async (content: string, _mentions: string[], _replyTo?: string) => {
    // If you expose an endpoint for comments later, call it here.
    // For now, just add a local "needs-discussion" entry for display.
    if (!activeSession || !currentRequirementId) return;
    const me = 'me';
    const optimistic: SessionVote = {
      _id: `temp-c-${Date.now()}`,
      sessionId: activeSession._id,
      requirementId: currentRequirementId,
      userId: me,
      voteType: VoteType.NEEDS_DISCUSSION,
      comment: content,
      createdAt: new Date().toISOString(),
    };
    setVotes(prev => [...prev, optimistic]);
  };

  const handleNextRequirement = () => {
    if (!activeSession) return;

    if (activeSession.currentRequirementIndex < activeSession.requirementIds.length - 1) {
      const updated = {
        ...activeSession,
        currentRequirementIndex: activeSession.currentRequirementIndex + 1,
      };
      setActiveSession(updated);
      toast.success('Moved to next requirement');
    } else {
      toast.info('This is the last requirement');
    }
  };

  const handleCompleteSession = async () => {
    toast.info('Completion not implemented yet. Add PATCH /review-sessions/:id/complete.');
  };

  const handleExportSummary = () => {
    if (!activeSession) return;

    const summary = {
      sessionName: activeSession.name,
      reviewed: votes.length, // approximate; tailor to your needs
      totalRequirements: activeSession.requirementIds.length,
      participants: activeSession.participants.length,
      votes,
    };

    const json = JSON.stringify(summary, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-summary-${activeSession._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Session summary exported');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  // ---------- Active Session Screen ----------
  if (activeSession) {
    const currentReqId = currentRequirementId || '';

    const uiVotes: UiVote[] = votes.map(toUiVote);
    const currentUserVote = uiVotes.find(v => v.userId === 'me')?.voteType; // replace with real userId
    const uiComments: UiComment[] = votes.map(toUiComment).filter(Boolean) as UiComment[];
    const uiParticipants: UiParticipant[] = activeSession.participants.map(toUiParticipant);

    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setActiveSession(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sessions
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{activeSession.name}</h1>
              <p className="text-muted-foreground">
                Requirement {activeSession.currentRequirementIndex + 1} of {activeSession.requirementIds.length}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportSummary}>
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
            <Button variant="outline" onClick={handleNextRequirement}>
              <SkipForward className="w-4 h-4 mr-2" />
              Next
            </Button>
            <Button onClick={handleCompleteSession}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Complete Session
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">
                      {currentReqId || '—'}
                    </Badge>
                    <CardTitle>Requirement Details</CardTitle>
                    <CardDescription className="mt-2">
                      Fetch title/description by requirementId and render here.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {currentReqId ? 'Requirement content goes here.' : 'No requirement selected.'}
                </div>
              </CardContent>
            </Card>

            {/* Voting Panel */}
            <VotingPanel
              sessionId={activeSession._id}
              requirementId={currentReqId}
              requirementTitle={currentReqId}
              votes={uiVotes}
              totalParticipants={uiParticipants.length}
              onVote={handleVote}
              currentUserVote={currentUserVote}
            />

            {/* Discussion */}
            <DiscussionThread
              comments={uiComments}
              participants={uiParticipants}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Right Column - Participants */}
          <div>
            <ParticipantList participants={uiParticipants} />
          </div>
        </div>
      </div>
    );
  }

  // ---------- Sessions List ----------
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading review sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Review Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Facilitate collaborative requirement reviews with real-time voting
          </p>
        </div>
        <Button onClick={() => setIsCreatorOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      <div className="grid gap-4">
        {sessions.map(session => (
          <Card key={session._id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{session.name}</CardTitle>
                    <Badge className={getStatusColor(session.status)}>{session.status}</Badge>
                  </div>
                  <CardDescription>{session.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span>{session.requirementIds.length} requirements</span>
                  <span>•</span>
                  <span>{session.participants.length} participants</span>
                  <span>•</span>
                  <span>{session.reviews?.length ?? 0} / {session.requirementIds.length} reviewed</span>
                </div>
                {session.status === 'scheduled' && (
                  <Button onClick={() => handleStartSession(session._id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                )}
                {session.status === 'active' && (
                  <Button onClick={() => setActiveSession(session)}>Resume Session</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <ReviewSessionCreator
        open={isCreatorOpen}
        onOpenChange={setIsCreatorOpen}
        onSuccess={loadSessions}
      />
    </div>
  );
}
