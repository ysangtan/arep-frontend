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

// ---------- Display helpers (replace with real user directory if available) ----------
const resolveUserName = (userId: string) => `User ${userId.slice(0, 4)}`;
const resolveUserRole = (_userId: string) => 'Reviewer';

// ---------- Adapters from service models to UI component prop types ----------
const toUiVote = (v: SessionVote): UiVote => ({
  userId: v.userId,
  userName: resolveUserName(v.userId), // REQUIRED by VotingPanel
  voteType: v.voteType,
  timestamp: v.createdAt,
});

const toUiComment = (v: SessionVote): UiComment | null =>
  v.comment
    ? {
        id: v._id,
        userId: v.userId,
        userName: resolveUserName(v.userId), // REQUIRED by DiscussionThread
        content: v.comment,
        timestamp: v.createdAt,
      }
    : null;

const toUiParticipant = (p: ServiceReviewSession['participants'][number]): UiParticipant => ({
  id: String(p.userId),
  name: resolveUserName(String(p.userId)),
  role: resolveUserRole(String(p.userId)), // REQUIRED by ParticipantList
  isOnline: !!p.isOnline,
  lastSeen: p.lastSeen
    ? (p.lastSeen instanceof Date ? p.lastSeen.toISOString() : String(p.lastSeen))
    : undefined,
});

export default function ReviewSessions() {
  const [sessions, setSessions] = useState<ServiceReviewSession[]>([]);
  const [activeSession, setActiveSession] = useState<ServiceReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [votes, setVotes] = useState<SessionVote[]>([]); // votes for the current requirement
  const [loadingVotes, setLoadingVotes] = useState(false);

  // ---------- Load sessions ----------
  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await ReviewSessionsService.findAll(); // or pass projectId if needed
      const list = Array.isArray(data) ? data : data.items;
      setSessions(list);
    } catch (error) {
      toast.error('Failed to load review sessions');
      console.error('[ReviewSessions] loadSessions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  // ---------- Current requirement id for active session ----------
  const currentRequirementId = useMemo(() => {
    if (!activeSession) return undefined;
    return activeSession.requirementIds[activeSession.currentRequirementIndex];
  }, [activeSession]);

  // ---------- Fetch votes for the current requirement ----------
  useEffect(() => {
    const fetchVotes = async () => {
      if (!activeSession || !currentRequirementId) {
        setVotes([]);
        return;
      }
      try {
        setLoadingVotes(true);
        const data = await ReviewSessionsService.getVotes(activeSession._id, currentRequirementId);
        const list = Array.isArray(data) ? data : data.items;
        setVotes(list);
      } catch (error) {
        toast.error('Failed to load votes');
        console.error('[ReviewSessions] getVotes error:', error);
      } finally {
        setLoadingVotes(false);
      }
    };
    fetchVotes();
  }, [activeSession?._id, activeSession?.currentRequirementIndex, currentRequirementId]);

  // ---------- Actions ----------
  const handleStartSession = async (sessionId: string) => {
    try {
      const updated = await ReviewSessionsService.startSession(sessionId);
      setActiveSession(updated);
      setSessions(prev => prev.map(s => (s._id === sessionId ? updated : s)));
      toast.success('Session started');
    } catch (error) {
      toast.error('Failed to start session');
      console.error('[ReviewSessions] startSession error:', error);
    }
  };

  // No server endpoint for voting yet -> optimistic local update only
  const handleVote = (voteType: VoteType) => {
    if (!activeSession || !currentRequirementId) return;

    const me = 'me'; // TODO: replace with real auth userId
    const newVote: SessionVote = {
      _id: `temp-${Date.now()}`,
      sessionId: activeSession._id,
      requirementId: currentRequirementId,
      userId: me,
      voteType,
      comment: undefined,
      createdAt: new Date().toISOString(),
    };

    setVotes(prev => {
      // one vote per user — replace existing user's vote
      const others = prev.filter(v => v.userId !== me);
      return [...others, newVote];
    });
    toast.info('Vote recorded locally (add POST /review-sessions/:id/votes to persist).');
  };

  // No server endpoint for comments; we treat a "comment" as a SessionVote with comment text
  const handleAddComment = (content: string, _mentions: string[], replyTo?: string) => {
    if (!activeSession || !currentRequirementId) return;

    const me = 'me'; // TODO: replace with real auth userId
    const newLocalComment: SessionVote = {
      _id: `temp-c-${Date.now()}`,
      sessionId: activeSession._id,
      requirementId: currentRequirementId,
      userId: me,
      voteType: VoteType.NEEDS_DISCUSSION,
      comment: content,
      createdAt: new Date().toISOString(),
    };

    setVotes(prev => [...prev, newLocalComment]);
    toast.info('Comment added locally (add an endpoint to persist).');
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
    // Not implemented in controller; keep UI feedback
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

    // Adapt service data to UI component prop types (IMPORTANT for TS compatibility)
    const uiVotes: UiVote[] = votes.map(toUiVote);
    const currentUserVote = uiVotes.find(v => v.userId === 'me')?.voteType;
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
            {/* Requirement details placeholder (fetch by id if needed) */}
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
