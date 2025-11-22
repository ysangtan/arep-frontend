// src/pages/reviews/ReviewQueue.tsx
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// If you have a project context, you can use it here:
// import { useProject } from '@/contexts/ProjectContext';
import { Review, ReviewChecklist, ReviewsService } from '@/services/reviews.service';
import { ReviewDrawer } from '@/components/reviews/ReviewDrawer';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Filter,
  Users,
} from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'in-progress' | 'completed';

const ReviewQueue = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  // const { project } = useProject(); // If you need projectId, grab it here.

  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [error, setError] = useState<string | null>(null);

  // ---- Load reviews from API ----
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // If you decide to scope by requirement:
        // const requirementId = ...;
        // const data = await ReviewsService.findAll(requirementId);

        const data = await ReviewsService.findAll(); // controller supports optional requirementId
        const list = Array.isArray(data) ? data : data.items;
        if (!mounted) return;

        // If you need to filter by user on FE until backend supports it:
        // Only show reviews where current user is a reviewer
        const scoped = user
          ? list.filter(r => r.reviewers?.some(rv => rv.userId === user.id))
          : list;

        setReviews(scoped);
      } catch (e: any) {
        setError(e?.message ?? 'Failed to load reviews');
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const filteredReviews = useMemo(() => {
    if (statusFilter === 'all') return reviews;
    return reviews.filter(r => r.status === statusFilter);
  }, [reviews, statusFilter]);

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setDrawerOpen(true);
  };

  // NOTE: Your API currently supports adding comments (POST /reviews/:id/comments).
  // Status updates (approve/reject/defer) would need additional endpoints.
  const handleApprove = async (reviewId: string, comment: string, _checklist: ReviewChecklist) => {
    try {
      await ReviewsService.addComment(reviewId, { content: comment });
      toast({
        title: 'Review Approved',
        description: 'Comment posted. (Add a status update endpoint to persist approval.)',
        variant: 'default',
      });
      setDrawerOpen(false);
      // TODO: refresh review list or optimistic update when backend supports status updates
    } catch (err: any) {
      toast({
        title: 'Approval failed',
        description: err?.message ?? 'Could not submit approval.',
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (reviewId: string, comment: string) => {
    try {
      await ReviewsService.addComment(reviewId, { content: comment });
      toast({
        title: 'Changes Requested',
        description: 'Comment posted. (Add a status update endpoint to persist rejection.)',
        variant: 'default',
      });
      setDrawerOpen(false);
    } catch (err: any) {
      toast({
        title: 'Request changes failed',
        description: err?.message ?? 'Could not submit request.',
        variant: 'destructive',
      });
    }
  };

  const handleDefer = async (reviewId: string, comment: string) => {
    try {
      await ReviewsService.addComment(reviewId, { content: comment });
      toast({
        title: 'Decision Deferred',
        description: 'Comment posted. (Add a status update endpoint to persist deferral.)',
        variant: 'default',
      });
      setDrawerOpen(false);
    } catch (err: any) {
      toast({
        title: 'Deferral failed',
        description: err?.message ?? 'Could not submit deferral.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const config =
      {
        pending: { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
        'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
        completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
      }[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateInput?: string | Date) => {
    if (!dateInput) return '-';
    const date = new Date(dateInput);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return <span className="text-red-600 font-medium">Overdue ({Math.abs(diffDays)}d)</span>;
    } else if (diffDays === 0) {
      return <span className="text-amber-600 font-medium">Due Today</span>;
    } else if (diffDays === 1) {
      return <span className="text-amber-600">Due Tomorrow</span>;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const inProgress = reviews.filter(r => r.status === 'in-progress').length;
    const completed = reviews.filter(r => r.status === 'completed').length;
    const overdue = reviews.filter(r => {
      if (!r.dueDate) return false;
      return new Date(r.dueDate) < new Date() && r.status !== 'completed';
    }).length;

    return { total, pending, inProgress, completed, overdue };
  }, [reviews]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          <p className="text-muted-foreground mt-1">Review and approve requirements assigned to you</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Assigned</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">{stats.pending}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">In Progress</p>
              <p className="text-2xl font-bold mt-1 text-blue-600">{stats.inProgress}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="text-2xl font-bold mt-1 text-green-600">{stats.completed}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </Card>

        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 font-medium">Overdue</p>
              <p className="text-2xl font-bold mt-1 text-red-600">{stats.overdue}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <Select value={statusFilter} onValueChange={(v: StatusFilter) => setStatusFilter(v)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Reviews" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {reviews.length} reviews
          </p>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading reviews…</div>
        ) : error ? (
          <div className="p-8 text-center text-red-600">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[140px]">Requirement</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[140px]">Due Date</TableHead>
                <TableHead className="w-[120px]">Type</TableHead>
                <TableHead className="w-[140px]">Reviewers</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <div className="flex flex-col items-center space-y-2">
                      <CheckCircle className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500">No reviews in this category</p>
                      <p className="text-sm text-gray-400">
                        {statusFilter === 'all' ? 'You have no assigned reviews' : 'Try changing the filter'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map(review => (
                  <TableRow
                    key={review._id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleReviewClick(review)}
                  >
                    <TableCell className="font-mono font-medium text-primary">
                      {/* Show a compact requirement reference (since backend only returns requirementId) */}
                      {String(review.requirementId).slice(0, 6)}…
                    </TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell>{formatDate(review.dueDate)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {review.type.replace('-', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {review.reviewers?.length ?? 0} reviewer{(review.reviewers?.length ?? 0) > 1 ? 's' : ''}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation();
                          handleReviewClick(review);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Review Drawer */}
      <ReviewDrawer
        review={selectedReview as any}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDefer={handleDefer}
      />
    </div>
  );
};

export default ReviewQueue;
