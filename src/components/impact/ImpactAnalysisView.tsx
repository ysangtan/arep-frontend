import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ImpactAnalysis, ChangeRequest } from '@/types/changeRequest.types';
import { DependencyGraph } from './DependencyGraph';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Target,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { changeRequestService } from '@/services/changeRequestMockData';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

interface ImpactAnalysisViewProps {
  changeRequest: ChangeRequest;
  onUpdate: () => void;
}

export function ImpactAnalysisView({ changeRequest, onUpdate }: ImpactAnalysisViewProps) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const impactAnalysis = changeRequest.impactAnalysis;

  if (!impactAnalysis) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-amber-600" />
          <h3 className="text-lg font-semibold mb-2">No Impact Analysis Available</h3>
          <p className="text-muted-foreground">
            Impact analysis has not been performed for this change request yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await changeRequestService.approveChangeRequest(
        changeRequest.id,
        '1',
        'Current User'
      );
      toast.success('Change request approved');
      onUpdate();
    } catch (error) {
      toast.error('Failed to approve change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    setIsSubmitting(true);
    try {
      await changeRequestService.rejectChangeRequest(changeRequest.id, rejectionReason);
      toast.success('Change request rejected');
      setShowRejectDialog(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to reject change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestMoreInfo = async () => {
    const message = prompt('What additional information is needed?');
    if (!message) return;

    setIsSubmitting(true);
    try {
      await changeRequestService.requestMoreInfo(changeRequest.id, message);
      toast.success('Request for more information sent');
      onUpdate();
    } catch (error) {
      toast.error('Failed to send request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getImpactLevelColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-700';
      case 'high':
        return 'bg-orange-100 text-orange-700';
      case 'medium':
        return 'bg-amber-100 text-amber-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-amber-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Impact Analysis Summary
              </CardTitle>
              <CardDescription>
                Analyzed on {new Date(impactAnalysis.analyzedAt).toLocaleDateString()}
              </CardDescription>
            </div>
            <Badge className={getImpactLevelColor(impactAnalysis.overallImpact)}>
              {impactAnalysis.overallImpact.toUpperCase()} IMPACT
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">
                {impactAnalysis.affectedRequirements.length}
              </div>
              <div className="text-sm text-muted-foreground">Requirements</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">
                {impactAnalysis.impactedArtifacts.length}
              </div>
              <div className="text-sm text-muted-foreground">Artifacts</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-700">
                {impactAnalysis.dependencyCount}
              </div>
              <div className="text-sm text-muted-foreground">Dependencies</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">
                {impactAnalysis.effortEstimation.total}h
              </div>
              <div className="text-sm text-muted-foreground">Total Effort</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Direct Impacts */}
      <Card>
        <CardHeader>
          <CardTitle>Affected Requirements</CardTitle>
          <CardDescription>
            Requirements that will be directly or indirectly impacted
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {impactAnalysis.affectedRequirements.map((req) => (
              <div
                key={req.requirementId}
                className="flex items-start gap-3 p-3 border rounded-lg"
              >
                <Badge
                  variant={req.impactType === 'direct' ? 'default' : 'secondary'}
                  className="mt-1"
                >
                  {req.impactType}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono text-xs">
                      {req.requirementId}
                    </Badge>
                    <span className="font-medium">{req.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{req.changeDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dependency Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Dependency Graph</CardTitle>
          <CardDescription>
            Visual representation of requirements and artifact dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DependencyGraph
            impactAnalysis={impactAnalysis}
            changeRequestTitle={changeRequest.title}
          />
        </CardContent>
      </Card>

      {/* Effort Estimation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Effort Estimation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { label: 'Analysis', value: impactAnalysis.effortEstimation.analysis },
              { label: 'Development', value: impactAnalysis.effortEstimation.development },
              { label: 'Testing', value: impactAnalysis.effortEstimation.testing },
              { label: 'Documentation', value: impactAnalysis.effortEstimation.documentation },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-sm font-semibold">{item.value}h</span>
                </div>
                <Progress
                  value={(item.value / impactAnalysis.effortEstimation.total) * 100}
                  className="h-2"
                />
              </div>
            ))}
            <Separator />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total Estimated Effort</span>
              <span className="text-2xl font-bold text-primary">
                {impactAnalysis.effortEstimation.total} hours
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {impactAnalysis.risks.map((risk) => (
              <div key={risk.id} className="border-l-4 border-amber-500 pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="uppercase text-xs">
                      {risk.type}
                    </Badge>
                    <span className={`text-sm font-semibold ${getRiskLevelColor(risk.level)}`}>
                      {risk.level.toUpperCase()} RISK
                    </span>
                  </div>
                </div>
                <p className="text-sm font-medium mb-1">{risk.description}</p>
                <p className="text-sm text-muted-foreground">
                  <strong>Mitigation:</strong> {risk.mitigation}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {impactAnalysis.recommendations.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 p-3 bg-accent/50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{rec.title}</span>
                    <Badge variant={rec.priority === 'high' ? 'default' : 'secondary'}>
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      {changeRequest.status === 'under-review' && (
        <Card>
          <CardHeader>
            <CardTitle>Decision Actions</CardTitle>
            <CardDescription>Approve, reject, or request more information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1"
              >
                <ThumbsUp className="w-4 h-4 mr-2" />
                Approve Change Request
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
                disabled={isSubmitting}
                className="flex-1"
              >
                <ThumbsDown className="w-4 h-4 mr-2" />
                Reject Change Request
              </Button>
              <Button
                variant="outline"
                onClick={handleRequestMoreInfo}
                disabled={isSubmitting}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Request More Info
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Change Request</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this change request. This will help the
              requester understand the decision.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            placeholder="Explain why this change request is being rejected..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject} disabled={isSubmitting}>
              {isSubmitting ? 'Rejecting...' : 'Reject Change Request'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
