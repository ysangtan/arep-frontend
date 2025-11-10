import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewDrawer } from '@/components/reviews/ReviewDrawer';
import { Review, ReviewChecklist } from '@/types/review.types';
import { mockReviews, getReviewsByUser } from '@/services/reviewMockData';
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
  Users
} from 'lucide-react';

const ReviewQueue = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Get reviews for current user
  const userReviews = user ? getReviewsByUser(user.id) : [];

  // Filter reviews based on status
  const filteredReviews = userReviews.filter(review => {
    if (statusFilter === 'all') return true;
    return review.status === statusFilter;
  });

  const handleReviewClick = (review: Review) => {
    setSelectedReview(review);
    setDrawerOpen(true);
  };

  const handleApprove = (reviewId: string, comment: string, checklist: ReviewChecklist) => {
    toast({
      title: 'Review Approved',
      description: 'Requirement has been approved and will proceed to implementation.',
      variant: 'default',
    });
    setDrawerOpen(false);
    
    // In real app, update review status via API
    console.log('Approved:', { reviewId, comment, checklist });
  };

  const handleReject = (reviewId: string, comment: string) => {
    toast({
      title: 'Changes Requested',
      description: 'The requirement has been sent back for revision.',
      variant: 'default',
    });
    setDrawerOpen(false);
    
    // In real app, update review status via API
    console.log('Rejected:', { reviewId, comment });
  };

  const handleDefer = (reviewId: string, comment: string) => {
    toast({
      title: 'Decision Deferred',
      description: 'Review decision postponed. More information needed.',
      variant: 'default',
    });
    setDrawerOpen(false);
    
    // In real app, update review status via API
    console.log('Deferred:', { reviewId, comment });
  };

  const getStatusBadge = (status: string) => {
    const config = {
      'pending': { label: 'Pending', className: 'bg-amber-100 text-amber-700' },
      'in-progress': { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
      'completed': { label: 'Completed', className: 'bg-green-100 text-green-700' },
    }[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return (
      <Badge className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return (
        <span className="text-red-600 font-medium">
          Overdue ({Math.abs(diffDays)}d)
        </span>
      );
    } else if (diffDays === 0) {
      return <span className="text-amber-600 font-medium">Due Today</span>;
    } else if (diffDays === 1) {
      return <span className="text-amber-600">Due Tomorrow</span>;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Calculate stats
  const stats = {
    total: userReviews.length,
    pending: userReviews.filter(r => r.status === 'pending').length,
    inProgress: userReviews.filter(r => r.status === 'in-progress').length,
    completed: userReviews.filter(r => r.status === 'completed').length,
    overdue: userReviews.filter(r => {
      if (!r.dueDate) return false;
      return new Date(r.dueDate) < new Date() && r.status !== 'completed';
    }).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Review Queue</h1>
          <p className="text-muted-foreground mt-1">
            Review and approve requirements assigned to you
          </p>
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
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Showing {filteredReviews.length} of {userReviews.length} reviews
          </p>
        </div>
      </Card>

      {/* Reviews Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Req ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[140px]">Due Date</TableHead>
              <TableHead className="w-[120px]">Type</TableHead>
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
                      {statusFilter === 'all' 
                        ? 'You have no assigned reviews' 
                        : 'Try changing the filter'}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredReviews.map((review) => (
                <TableRow
                  key={review.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleReviewClick(review)}
                >
                  <TableCell className="font-mono font-medium text-primary">
                    {review.requirementReqId}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium truncate">{review.requirementTitle}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {review.reviewers.length} reviewer{review.reviewers.length > 1 ? 's' : ''}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status)}</TableCell>
                  <TableCell>{formatDate(review.dueDate)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {review.type.replace('-', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
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
      </Card>

      {/* Review Drawer */}
      <ReviewDrawer
        review={selectedReview}
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
