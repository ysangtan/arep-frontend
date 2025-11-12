import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/requirements/StatusBadge';
import { PriorityIndicator } from '@/components/requirements/PriorityIndicator';
import RequirementsService from '@/services/requirements.service'; // <-- update import to correct path
import { ArrowLeft, Edit, Trash2, Clock, User, Tag, CheckSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Requirement } from '@/services/requirements.service';

const RequirementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [requirement, setRequirement] = useState<Requirement | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchRequirement = async () => {
      try {
        setLoading(true);
        const data = await RequirementsService.findOne(id);
        setRequirement(data);
      } catch (err: any) {
        console.error('Failed to fetch requirement:', err);
        setError('Failed to fetch requirement');
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-muted-foreground">Loading requirement details...</p>
      </div>
    );
  }

  if (error || !requirement) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Requirement Not Found</h2>
        <p className="text-muted-foreground mt-2">
          {error || "The requirement you're looking for doesn't exist."}
        </p>
        <Button onClick={() => navigate('/requirements')} className="mt-4">
          Back to Requirements
        </Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/requirements')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-gray-900">{requirement.reqId}</h1>
              <StatusBadge status={requirement.status} />
              <PriorityIndicator priority={requirement.priority} showLabel />
            </div>
            <p className="text-muted-foreground mt-1">{requirement.title}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/requirements/${requirement._id}/edit`)}
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            className="text-red-600 hover:text-red-700"
            onClick={async () => {
              if (confirm('Are you sure you want to delete this requirement?')) {
                try {
                  await RequirementsService.remove(requirement._id);
                  navigate('/requirements');
                } catch (err) {
                  console.error('Delete failed:', err);
                }
              }
            }}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{requirement.description}</p>
            </CardContent>
          </Card>

          {/* Acceptance Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5" />
                <span>Acceptance Criteria</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {requirement.acceptanceCriteria?.map((criteria, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-medium text-primary">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Validation Warnings */}
          {requirement.validationWarnings?.length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="text-orange-700">Validation Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirement.validationWarnings.map((warning, index) => (
                    <li key={index} className="text-sm text-orange-700">
                      • {warning}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          <Card>
            <CardHeader>
              <CardTitle>Comments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center py-8">
                No comments yet. Be the first to comment!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span>Type</span>
                </div>
                <p className="text-sm font-medium capitalize pl-6">
                  {requirement.type.replace('-', ' ')}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span>Assignee</span>
                </div>
                <p className="text-sm font-medium pl-6">
                  {requirement.assigneeId ? 'Assigned User' : 'Unassigned'}
                </p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span>Created By</span>
                </div>
                <p className="text-sm font-medium pl-6">{requirement.createdBy}</p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Created</span>
                </div>
                <p className="text-sm pl-6">{formatDate(requirement.createdAt)}</p>
              </div>

              <Separator />

              <div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                  <Clock className="w-4 h-4" />
                  <span>Last Updated</span>
                </div>
                <p className="text-sm pl-6">{formatDate(requirement.updatedAt)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {requirement.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traceability */}
          <Card>
            <CardHeader>
              <CardTitle>Traceability Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Tests:</span>
                  <span className="ml-2 font-medium">0 linked</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Code:</span>
                  <span className="ml-2 font-medium">0 linked</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Docs:</span>
                  <span className="ml-2 font-medium">0 linked</span>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Add Links
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequirementDetail;
