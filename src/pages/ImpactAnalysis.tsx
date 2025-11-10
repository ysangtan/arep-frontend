import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChangeRequestForm } from '@/components/impact/ChangeRequestForm';
import { ImpactAnalysisView } from '@/components/impact/ImpactAnalysisView';
import { changeRequestService } from '@/services/changeRequestMockData';
import { ChangeRequest, ChangeRequestStatus } from '@/types/changeRequest.types';
import { Plus, Search, Filter, AlertCircle, CheckCircle2, Clock, XCircle, FileCheck } from 'lucide-react';
import { toast } from 'sonner';

export default function ImpactAnalysis() {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null);

  const loadChangeRequests = async () => {
    setIsLoading(true);
    try {
      const data = await changeRequestService.getAllChangeRequests();
      setChangeRequests(data);
    } catch (error) {
      toast.error('Failed to load change requests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChangeRequests();
  }, []);

  const filteredCRs = changeRequests.filter((cr) => {
    const matchesSearch =
      cr.crId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cr.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || cr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: ChangeRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under-review':
        return <AlertCircle className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'implemented':
        return <FileCheck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: ChangeRequestStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-700';
      case 'under-review':
        return 'bg-amber-100 text-amber-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'implemented':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading change requests...</p>
        </div>
      </div>
    );
  }

  if (selectedCR) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Button variant="ghost" onClick={() => setSelectedCR(null)}>
                ← Back to List
              </Button>
              <Badge variant="outline" className="font-mono">
                {selectedCR.crId}
              </Badge>
              <Badge className={getStatusColor(selectedCR.status)}>
                {selectedCR.status.replace('-', ' ')}
              </Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground">{selectedCR.title}</h1>
            <p className="text-muted-foreground mt-1">{selectedCR.description}</p>
          </div>
        </div>

        <ImpactAnalysisView changeRequest={selectedCR} onUpdate={loadChangeRequests} />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Impact Analysis</h1>
          <p className="text-muted-foreground mt-1">
            Manage change requests and analyze their impact on requirements
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Change Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search change requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under-review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="implemented">Implemented</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Change Requests List */}
      {filteredCRs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Change Requests Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first change request to get started'}
            </p>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Change Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredCRs.map((cr) => (
            <Card
              key={cr.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedCR(cr)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="font-mono">
                        {cr.crId}
                      </Badge>
                      <Badge className={getStatusColor(cr.status)}>
                        {getStatusIcon(cr.status)}
                        <span className="ml-1">{cr.status.replace('-', ' ')}</span>
                      </Badge>
                      <Badge className={getPriorityColor(cr.priority)}>
                        {cr.priority} priority
                      </Badge>
                      {cr.impactAnalysis && (
                        <Badge variant="outline">
                          {cr.impactAnalysis.overallImpact} impact
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="mb-2">{cr.title}</CardTitle>
                    <CardDescription>{cr.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span>Requested by {cr.requestedByName}</span>
                    <span>•</span>
                    <span>{new Date(cr.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{cr.targetRequirements.length} requirements affected</span>
                  </div>
                  {cr.impactAnalysis && (
                    <span className="font-medium">
                      {cr.impactAnalysis.effortEstimation.total}h estimated
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ChangeRequestForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={loadChangeRequests}
      />
    </div>
  );
}
