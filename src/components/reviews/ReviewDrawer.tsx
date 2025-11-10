import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Review, ReviewComment, ReviewChecklist } from '@/types/review.types';
import { Requirement } from '@/types/requirement.types';
import { getRequirementById } from '@/services/mockData';
import { getCommentsByReview } from '@/services/reviewMockData';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  User,
  CheckSquare,
  AlertCircle
} from 'lucide-react';
import { StatusBadge } from '@/components/requirements/StatusBadge';
import { PriorityIndicator } from '@/components/requirements/PriorityIndicator';

interface ReviewDrawerProps {
  review: Review | null;
  open: boolean;
  onClose: () => void;
  onApprove: (reviewId: string, comment: string, checklist: ReviewChecklist) => void;
  onReject: (reviewId: string, comment: string) => void;
  onDefer: (reviewId: string, comment: string) => void;
}

export function ReviewDrawer({
  review,
  open,
  onClose,
  onApprove,
  onReject,
  onDefer,
}: ReviewDrawerProps) {
  const [comment, setComment] = useState('');
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    clearAndUnambiguous: false,
    testable: false,
    feasible: false,
    complete: false,
    consistent: false,
  });

  const requirement = review ? getRequirementById(review.requirementId) : null;
  const comments = review ? getCommentsByReview(review.id) : [];

  const handleApprove = () => {
    if (!review) return;
    onApprove(review.id, comment, checklist);
    resetForm();
  };

  const handleReject = () => {
    if (!review || !comment.trim()) return;
    onReject(review.id, comment);
    resetForm();
  };

  const handleDefer = () => {
    if (!review || !comment.trim()) return;
    onDefer(review.id, comment);
    resetForm();
  };

  const resetForm = () => {
    setComment('');
    setChecklist({
      clearAndUnambiguous: false,
      testable: false,
      feasible: false,
      complete: false,
      consistent: false,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!review || !requirement) return null;

  const allChecksPassed = Object.values(checklist).every(v => v === true);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl bg-white overflow-hidden flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-3">
            <span className="font-mono text-primary">{requirement.reqId}</span>
            <StatusBadge status={requirement.status} />
            <PriorityIndicator priority={requirement.priority} />
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 py-4">
          <div className="space-y-6">
            {/* Requirement Title */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {requirement.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {requirement.description}
              </p>
            </div>

            <Separator />

            {/* Acceptance Criteria */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <CheckSquare className="w-4 h-4 mr-2" />
                Acceptance Criteria
              </h4>
              <ul className="space-y-2">
                {requirement.acceptanceCriteria.map((criteria, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Review Checklist */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                Quality Checklist
              </h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="clear"
                    checked={checklist.clearAndUnambiguous}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, clearAndUnambiguous: !!checked })
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="clear"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Clear and Unambiguous
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Requirement is easy to understand with no ambiguity
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="testable"
                    checked={checklist.testable}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, testable: !!checked })
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="testable"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Testable / Verifiable
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Can be validated through testing
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="feasible"
                    checked={checklist.feasible}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, feasible: !!checked })
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="feasible"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Feasible
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Technically and practically achievable
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="complete"
                    checked={checklist.complete}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, complete: !!checked })
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="complete"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Complete
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All necessary information is provided
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="consistent"
                    checked={checklist.consistent}
                    onCheckedChange={(checked) =>
                      setChecklist({ ...checklist, consistent: !!checked })
                    }
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor="consistent"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Consistent
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Aligns with other requirements and standards
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Previous Comments */}
            {comments.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Previous Comments ({comments.length})
                </h4>
                <div className="space-y-3">
                  {comments.map((reviewComment) => (
                    <div
                      key={reviewComment.id}
                      className={`p-3 rounded-lg bg-gray-50 border ${
                        reviewComment.parentId ? 'ml-8 border-gray-200' : 'border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {reviewComment.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {reviewComment.userName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(reviewComment.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{reviewComment.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Add Comment */}
            <div>
              <Label htmlFor="comment" className="text-sm font-semibold mb-2 block">
                Your Feedback
              </Label>
              <Textarea
                id="comment"
                placeholder="Add your review comments here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="mb-2"
              />
              <p className="text-xs text-muted-foreground">
                Provide specific feedback on what needs to be improved or what looks good
              </p>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="border-t pt-4 space-y-3">
          {!allChecksPassed && (
            <div className="flex items-start space-x-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800">
                Complete the quality checklist above before approving
              </p>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Button
              onClick={handleApprove}
              disabled={!allChecksPassed}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button
              onClick={handleReject}
              disabled={!comment.trim()}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Request Changes
            </Button>
          </div>

          <Button
            onClick={handleDefer}
            disabled={!comment.trim()}
            variant="outline"
            className="w-full"
          >
            <Clock className="w-4 h-4 mr-2" />
            Defer Decision
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
