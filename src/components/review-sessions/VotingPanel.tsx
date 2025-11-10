import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Vote, VoteType } from '@/types/reviewSession.types';
import { ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

interface VotingPanelProps {
  requirementId: string;
  requirementTitle: string;
  votes: Vote[];
  totalParticipants: number;
  onVote: (voteType: VoteType) => void;
  currentUserVote?: VoteType;
}

export function VotingPanel({
  requirementTitle,
  votes,
  totalParticipants,
  onVote,
  currentUserVote,
}: VotingPanelProps) {
  const [isVoting, setIsVoting] = useState(false);

  const approveCount = votes.filter((v) => v.voteType === 'approve').length;
  const rejectCount = votes.filter((v) => v.voteType === 'reject').length;
  const discussCount = votes.filter((v) => v.voteType === 'needs-discussion').length;

  const approvePercent = totalParticipants > 0 ? (approveCount / totalParticipants) * 100 : 0;
  const rejectPercent = totalParticipants > 0 ? (rejectCount / totalParticipants) * 100 : 0;
  const discussPercent = totalParticipants > 0 ? (discussCount / totalParticipants) * 100 : 0;

  const handleVote = async (voteType: VoteType) => {
    setIsVoting(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onVote(voteType);
      toast.success(`Voted: ${voteType.replace('-', ' ')}`);
    } catch (error) {
      toast.error('Failed to submit vote');
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{requirementTitle}</CardTitle>
        <CardDescription>Cast your vote on this requirement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Voting Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant={currentUserVote === 'approve' ? 'default' : 'outline'}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleVote('approve')}
            disabled={isVoting}
          >
            <ThumbsUp className="w-6 h-6" />
            <span className="text-sm font-medium">Approve</span>
          </Button>
          <Button
            variant={currentUserVote === 'reject' ? 'destructive' : 'outline'}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleVote('reject')}
            disabled={isVoting}
          >
            <ThumbsDown className="w-6 h-6" />
            <span className="text-sm font-medium">Reject</span>
          </Button>
          <Button
            variant={currentUserVote === 'needs-discussion' ? 'secondary' : 'outline'}
            className="flex-col h-auto py-4 gap-2"
            onClick={() => handleVote('needs-discussion')}
            disabled={isVoting}
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-sm font-medium">Discuss</span>
          </Button>
        </div>

        {/* Vote Tally */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Vote Tally</span>
            <span className="text-muted-foreground">
              {votes.length} / {totalParticipants} voted
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Approve</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {approveCount} ({Math.round(approvePercent)}%)
                </span>
              </div>
              <Progress value={approvePercent} className="h-2 bg-green-100" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Reject</span>
                </div>
                <span className="text-sm font-semibold text-red-600">
                  {rejectCount} ({Math.round(rejectPercent)}%)
                </span>
              </div>
              <Progress value={rejectPercent} className="h-2 bg-red-100" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium">Needs Discussion</span>
                </div>
                <span className="text-sm font-semibold text-amber-600">
                  {discussCount} ({Math.round(discussPercent)}%)
                </span>
              </div>
              <Progress value={discussPercent} className="h-2 bg-amber-100" />
            </div>
          </div>
        </div>

        {/* Individual Votes */}
        {votes.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Individual Votes</div>
            <div className="space-y-2">
              {votes.map((vote, idx) => (
                <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted rounded">
                  <span>{vote.userName}</span>
                  <Badge
                    variant={
                      vote.voteType === 'approve'
                        ? 'default'
                        : vote.voteType === 'reject'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {vote.voteType === 'approve' && '👍 Approve'}
                    {vote.voteType === 'reject' && '👎 Reject'}
                    {vote.voteType === 'needs-discussion' && '🤔 Discuss'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
