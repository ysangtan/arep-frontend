import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';
import { AuditLogEntry, AuditAction, EntityType } from '@/types/audit.types';
import { auditService } from '@/services/auditMockData';
import { Search, Download, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AuditLog() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const loadAuditLog = async () => {
    setIsLoading(true);
    try {
      const filters: any = {};
      if (searchQuery) filters.search = searchQuery;
      if (actionFilter !== 'all') filters.action = [actionFilter];
      if (entityTypeFilter !== 'all') filters.entityType = [entityTypeFilter];

      const data = await auditService.getAuditLog(filters);
      setEntries(data);
    } catch (error) {
      toast.error('Failed to load audit log');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLog();
  }, [searchQuery, actionFilter, entityTypeFilter]);

  const handleExport = async (format: 'csv' | 'json' | 'pdf') => {
    try {
      await auditService.exportAuditLog(format);
      toast.success(`Audit log exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export audit log');
    }
  };

  const getActionColor = (action: AuditAction) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-700';
      case 'update':
      case 'status-change':
        return 'bg-blue-100 text-blue-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'approve':
        return 'bg-emerald-100 text-emerald-700';
      case 'reject':
        return 'bg-orange-100 text-orange-700';
      case 'assign':
        return 'bg-purple-100 text-purple-700';
      case 'login':
      case 'logout':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEntityTypeColor = (entityType: EntityType) => {
    const colors: Record<EntityType, string> = {
      requirement: 'bg-blue-100 text-blue-700',
      'change-request': 'bg-purple-100 text-purple-700',
      review: 'bg-amber-100 text-amber-700',
      user: 'bg-pink-100 text-pink-700',
      project: 'bg-cyan-100 text-cyan-700',
      'validation-rule': 'bg-indigo-100 text-indigo-700',
      'traceability-link': 'bg-teal-100 text-teal-700',
    };
    return colors[entityType] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search audit log..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="create">Create</SelectItem>
            <SelectItem value="update">Update</SelectItem>
            <SelectItem value="delete">Delete</SelectItem>
            <SelectItem value="approve">Approve</SelectItem>
            <SelectItem value="reject">Reject</SelectItem>
            <SelectItem value="assign">Assign</SelectItem>
            <SelectItem value="status-change">Status Change</SelectItem>
            <SelectItem value="login">Login</SelectItem>
            <SelectItem value="logout">Logout</SelectItem>
          </SelectContent>
        </Select>

        <Select value={entityTypeFilter} onValueChange={setEntityTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="requirement">Requirement</SelectItem>
            <SelectItem value="change-request">Change Request</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="project">Project</SelectItem>
            <SelectItem value="validation-rule">Validation Rule</SelectItem>
            <SelectItem value="traceability-link">Traceability Link</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => handleExport('csv')}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity Type</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow
                key={entry.id}
                className="cursor-pointer hover:bg-accent/50"
                onClick={() => setSelectedEntry(entry)}
              >
                <TableCell className="font-mono text-xs">
                  {new Date(entry.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{entry.userName}</div>
                    <div className="text-xs text-muted-foreground">{entry.userRole}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={getActionColor(entry.action)}>
                    {entry.action.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getEntityTypeColor(entry.entityType)}>
                    {entry.entityType.replace('-', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-mono text-xs">{entry.entityId}</div>
                    {entry.entityName && (
                      <div className="text-xs text-muted-foreground">{entry.entityName}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-md truncate">{entry.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Entry Details Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Audit Log Entry Details</DialogTitle>
            <DialogDescription>
              {selectedEntry && new Date(selectedEntry.timestamp).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">User</div>
                  <div className="mt-1">
                    <div className="font-medium">{selectedEntry.userName}</div>
                    <div className="text-sm text-muted-foreground">{selectedEntry.userId}</div>
                    <Badge className="mt-1">{selectedEntry.userRole}</Badge>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Action</div>
                  <Badge className={`mt-1 ${getActionColor(selectedEntry.action)}`}>
                    {selectedEntry.action.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Entity Type</div>
                  <Badge className={`mt-1 ${getEntityTypeColor(selectedEntry.entityType)}`}>
                    {selectedEntry.entityType.replace('-', ' ')}
                  </Badge>
                </div>

                <div>
                  <div className="text-sm font-medium text-muted-foreground">Entity ID</div>
                  <div className="mt-1 font-mono text-sm">{selectedEntry.entityId}</div>
                  {selectedEntry.entityName && (
                    <div className="text-sm text-muted-foreground">{selectedEntry.entityName}</div>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium text-muted-foreground mb-2">Description</div>
                <div className="p-3 bg-muted rounded-lg text-sm">{selectedEntry.description}</div>
              </div>

              {selectedEntry.changes && selectedEntry.changes.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-2">Changes</div>
                  <div className="space-y-2">
                    {selectedEntry.changes.map((change, idx) => (
                      <div key={idx} className="p-3 border rounded-lg">
                        <div className="font-medium text-sm mb-1">{change.field}</div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Old: </span>
                            <span className="font-mono">{String(change.oldValue)}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">New: </span>
                            <span className="font-mono">{String(change.newValue)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedEntry.ipAddress && (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">IP Address</div>
                    <div className="font-mono">{selectedEntry.ipAddress}</div>
                  </div>
                  {selectedEntry.userAgent && (
                    <div>
                      <div className="text-muted-foreground">User Agent</div>
                      <div className="font-mono text-xs truncate">{selectedEntry.userAgent}</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
