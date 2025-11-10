import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment, Participant } from '@/types/reviewSession.types';
import { Send, Reply } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface DiscussionThreadProps {
  comments: Comment[];
  participants: Participant[];
  onAddComment: (content: string, mentions: string[], replyTo?: string) => void;
}

export function DiscussionThread({ comments, participants, onAddComment }: DiscussionThreadProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const commentsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [comments]);

  const handleInputChange = (value: string) => {
    setNewComment(value);

    // Check for @ mentions
    const lastAtIndex = value.lastIndexOf('@');
    if (lastAtIndex !== -1 && lastAtIndex === value.length - 1) {
      setShowMentions(true);
      setMentionSearch('');
    } else if (lastAtIndex !== -1) {
      const afterAt = value.substring(lastAtIndex + 1);
      const spaceIndex = afterAt.indexOf(' ');
      if (spaceIndex === -1) {
        setShowMentions(true);
        setMentionSearch(afterAt);
      } else {
        setShowMentions(false);
      }
    } else {
      setShowMentions(false);
    }
  };

  const insertMention = (participantName: string, participantId: string) => {
    const lastAtIndex = newComment.lastIndexOf('@');
    const beforeAt = newComment.substring(0, lastAtIndex);
    setNewComment(`${beforeAt}@${participantName} `);
    setShowMentions(false);
    textareaRef.current?.focus();
  };

  const extractMentions = (content: string): string[] => {
    const mentionRegex = /@(\w+\s?\w+)/g;
    const matches = content.match(mentionRegex);
    if (!matches) return [];

    const mentionedUserIds: string[] = [];
    matches.forEach((match) => {
      const name = match.substring(1).trim();
      const participant = participants.find((p) => p.name === name);
      if (participant) {
        mentionedUserIds.push(participant.id);
      }
    });
    return mentionedUserIds;
  };

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const mentions = extractMentions(newComment);
    onAddComment(newComment, mentions, replyingTo || undefined);
    setNewComment('');
    setReplyingTo(null);
    toast.success('Comment added');
  };

  const filteredParticipants = showMentions
    ? participants.filter((p) =>
        p.name.toLowerCase().includes(mentionSearch.toLowerCase())
      )
    : [];

  const getReplyToComment = (commentId: string) => {
    return comments.find((c) => c.id === commentId);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Discussion</CardTitle>
        <CardDescription>
          Use @mentions to notify team members • {comments.length} comments
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 max-h-[400px]">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No comments yet. Start the discussion!</p>
            </div>
          ) : (
            comments.map((comment) => {
              const replyTo = comment.replyTo ? getReplyToComment(comment.replyTo) : null;
              return (
                <div key={comment.id} className="space-y-2">
                  {replyTo && (
                    <div className="ml-8 pl-3 border-l-2 border-muted text-xs text-muted-foreground">
                      Replying to {replyTo.userName}: {replyTo.content.substring(0, 50)}...
                    </div>
                  )}
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-sm flex-shrink-0">
                      {comment.userName.charAt(0)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.userName}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.timestamp), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{comment.content}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 text-xs"
                        onClick={() => {
                          setReplyingTo(comment.id);
                          textareaRef.current?.focus();
                        }}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={commentsEndRef} />
        </div>

        {/* New Comment Input */}
        <div className="space-y-2 border-t pt-4">
          {replyingTo && (
            <div className="flex items-center justify-between bg-muted px-3 py-2 rounded text-sm">
              <span className="text-muted-foreground">
                Replying to {getReplyToComment(replyingTo)?.userName}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6"
                onClick={() => setReplyingTo(null)}
              >
                Cancel
              </Button>
            </div>
          )}

          <div className="relative">
            <Textarea
              ref={textareaRef}
              placeholder="Type your comment... Use @ to mention team members"
              value={newComment}
              onChange={(e) => handleInputChange(e.target.value)}
              rows={3}
              className="resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit();
                }
              }}
            />

            {/* Mentions Dropdown */}
            {showMentions && filteredParticipants.length > 0 && (
              <div className="absolute bottom-full left-0 mb-2 w-full bg-popover border rounded-lg shadow-lg z-10">
                <div className="p-2 space-y-1">
                  {filteredParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer"
                      onClick={() => insertMention(participant.name, participant.id)}
                    >
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-xs">
                        {participant.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{participant.name}</div>
                        <div className="text-xs text-muted-foreground">{participant.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Press Ctrl+Enter to send • Use @ to mention
            </p>
            <Button onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
