import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviewSessionCreator } from '@/components/review-sessions/ReviewSessionCreator';
import { ParticipantList } from '@/components/review-sessions/ParticipantList';
import { VotingPanel } from '@/components/review-sessions/VotingPanel';
import { DiscussionThread } from '@/components/review-sessions/DiscussionThread';
import { reviewSessionService } from '@/services/reviewSessionMockData';
import { mockRequirements } from '@/services/mockData';
import { ReviewSession, VoteType, Comment } from '@/types/reviewSession.types';
import {
  Plus,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

export default function ReviewSessions() {
  const [sessions, setSessions] = useState<ReviewSession[]>([]);
  const [activeSession, setActiveSession] = useState<ReviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const data = await reviewSessionService.getAllSessions();
      setSessions(data);
    } catch (error) {
      toast.error('Failed to load review sessions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleStartSession = async (sessionId: string) => {
    try {
      const updated = await reviewSessionService.startSession(sessionId);
      setActiveSession(updated);
      setSessions((prev) => prev.map((s) => (s.id === sessionId ? updated : s)));
      toast.success('Session started');
    } catch (error) {
      toast.error('Failed to start session');
    }
  };

  const handleVote = (voteType: VoteType) => {
    if (!activeSession) return;

    const currentReqId =
      activeSession.requirementIds[activeSession.currentRequirementIndex];
    const currentReqTitle =
      mockRequirements.find((r) => r.reqId === currentReqId)?.title || '';

    const newVote = {
      userId: '1',
      userName: 'Current User',
      voteType,
      timestamp: new Date().toISOString(),
    };

    const updatedSession = { ...activeSession };
    const reviewIndex = updatedSession.reviews.findIndex(
      (r) => r.requirementId === currentReqId
    );

    if (reviewIndex >= 0) {
      // Update existing review
      const existingVoteIndex = updatedSession.reviews[reviewIndex].votes.findIndex(
        (v) => v.userId === '1'
      );
      if (existingVoteIndex >= 0) {
        updatedSession.reviews[reviewIndex].votes[existingVoteIndex] = newVote;
      } else {
        updatedSession.reviews[reviewIndex].votes.push(newVote);
      }
    } else {
      // Create new review
      updatedSession.reviews.push({
        requirementId: currentReqId,
        requirementTitle: currentReqTitle,
        votes: [newVote],
        comments: [],
      });
    }

    setActiveSession(updatedSession);
  };

  const handleAddComment = (content: string, mentions: string[], replyTo?: string) => {
    if (!activeSession) return;

    const currentReqId =
      activeSession.requirementIds[activeSession.currentRequirementIndex];
    const currentReqTitle =
      mockRequirements.find((r) => r.reqId === currentReqId)?.title || '';

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      userId: '1',
      userName: 'Current User',
      content,
      timestamp: new Date().toISOString(),
      mentions: mentions.length > 0 ? mentions : undefined,
      replyTo,
    };

    const updatedSession = { ...activeSession };
    const reviewIndex = updatedSession.reviews.findIndex(
      (r) => r.requirementId === currentReqId
    );

    if (reviewIndex >= 0) {
      updatedSession.reviews[reviewIndex].comments.push(newComment);
    } else {
      updatedSession.reviews.push({
        requirementId: currentReqId,
        requirementTitle: currentReqTitle,
        votes: [],
        comments: [newComment],
      });
    }

    setActiveSession(updatedSession);
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
    if (!activeSession) return;

    try {
      await reviewSessionService.completeSession(activeSession.id);
      toast.success('Session completed');
      setActiveSession(null);
      loadSessions();
    } catch (error) {
      toast.error('Failed to complete session');
    }
  };

  const handleExportSummary = () => {
    if (!activeSession) return;

    const summary = {
      sessionName: activeSession.name,
      reviewed: activeSession.reviews.length,
      totalRequirements: activeSession.requirementIds.length,
      participants: activeSession.participants.length,
      reviews: activeSession.reviews,
    };

    const json = JSON.stringify(summary, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-summary-${activeSession.id}.json`;
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

  if (activeSession) {
    const currentReqId =
      activeSession.requirementIds[activeSession.currentRequirementIndex];
    const currentReq = mockRequirements.find((r) => r.reqId === currentReqId);
    const currentReview = activeSession.reviews.find(
      (r) => r.requirementId === currentReqId
    );
    const currentUserVote = currentReview?.votes.find((v) => v.userId === '1')?.voteType;

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
                Requirement {activeSession.currentRequirementIndex + 1} of{' '}
                {activeSession.requirementIds.length}
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

        {/* Main Session Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Requirement & Voting */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirement Details */}
            {currentReq && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {currentReq.reqId}
                      </Badge>
                      <CardTitle>{currentReq.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {currentReq.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold mb-2">Acceptance Criteria</h4>
                      <ul className="space-y-1">
                        {currentReq.acceptanceCriteria.map((criteria, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground">
                            • {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Voting Panel */}
            <VotingPanel
              requirementId={currentReqId}
              requirementTitle={currentReq?.title || ''}
              votes={currentReview?.votes || []}
              totalParticipants={activeSession.participants.length}
              onVote={handleVote}
              currentUserVote={currentUserVote}
            />

            {/* Discussion */}
            <DiscussionThread
              comments={currentReview?.comments || []}
              participants={activeSession.participants}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Right Column - Participants */}
          <div>
            <ParticipantList participants={activeSession.participants} />
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
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

      {/* Sessions List */}
      <div className="grid gap-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle>{session.name}</CardTitle>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
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
                  <span>
                    {session.reviews.length} / {session.requirementIds.length} reviewed
                  </span>
                </div>
                {session.status === 'scheduled' && (
                  <Button onClick={() => handleStartSession(session.id)}>
                    <Play className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                )}
                {session.status === 'active' && (
                  <Button onClick={() => setActiveSession(session)}>
                    Resume Session
                  </Button>
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
