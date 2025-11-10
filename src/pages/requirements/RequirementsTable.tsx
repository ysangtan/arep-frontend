import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/requirements/StatusBadge';
import { PriorityIndicator } from '@/components/requirements/PriorityIndicator';
import { mockRequirements, filterRequirements } from '@/services/mockData';
import { RequirementStatus, RequirementType, Priority } from '@/types/requirement.types';
import { Search, Plus, Filter, Eye, Edit } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RequirementsTable = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequirementStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<RequirementType[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);

  // Filter requirements based on current filters
  const filteredRequirements = useMemo(() => {
    return filterRequirements(mockRequirements, {
      search: searchQuery,
      status: statusFilter.length > 0 ? statusFilter : undefined,
      type: typeFilter.length > 0 ? typeFilter : undefined,
      priority: priorityFilter.length > 0 ? priorityFilter : undefined,
    });
  }, [searchQuery, statusFilter, typeFilter, priorityFilter]);

  const handleStatusFilterChange = (value: string) => {
    if (value === 'all') {
      setStatusFilter([]);
    } else {
      setStatusFilter([value as RequirementStatus]);
    }
  };

  const handleTypeFilterChange = (value: string) => {
    if (value === 'all') {
      setTypeFilter([]);
    } else {
      setTypeFilter([value as RequirementType]);
    }
  };

  const handlePriorityFilterChange = (value: string) => {
    if (value === 'all') {
      setPriorityFilter([]);
    } else {
      setPriorityFilter([value as Priority]);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all project requirements
          </p>
        </div>
        <Button onClick={() => navigate('/requirements/new')} className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>New Requirement</span>
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by ID, title, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select onValueChange={handleStatusFilterChange} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="in-review">In Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="implemented">Implemented</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select onValueChange={handleTypeFilterChange} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="functional">Functional</SelectItem>
              <SelectItem value="non-functional">Non-Functional</SelectItem>
              <SelectItem value="constraint">Constraint</SelectItem>
              <SelectItem value="business-rule">Business Rule</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter Row */}
        <div className="mt-4 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <Button
            variant={priorityFilter.length === 0 ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriorityFilter([])}
          >
            All
          </Button>
          <Button
            variant={priorityFilter.includes('high') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriorityFilter(['high'])}
          >
            High
          </Button>
          <Button
            variant={priorityFilter.includes('medium') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriorityFilter(['medium'])}
          >
            Medium
          </Button>
          <Button
            variant={priorityFilter.includes('low') ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPriorityFilter(['low'])}
          >
            Low
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{filteredRequirements.length}</span> of{' '}
          <span className="font-medium text-foreground">{mockRequirements.length}</span> requirements
        </p>
      </div>

      {/* Requirements Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="w-[140px]">Type</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Priority</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="w-[120px]">Updated</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequirements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-2">
                    <Search className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">No requirements found</p>
                    <p className="text-sm text-gray-400">Try adjusting your filters</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredRequirements.map((requirement) => (
                <TableRow
                  key={requirement.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate(`/requirements/${requirement.id}`)}
                >
                  <TableCell className="font-mono text-sm font-medium">
                    {requirement.reqId}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      <p className="font-medium truncate">{requirement.title}</p>
                      <p className="text-sm text-muted-foreground truncate mt-1">
                        {requirement.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm capitalize">
                      {requirement.type.replace('-', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={requirement.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityIndicator priority={requirement.priority} showLabel />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {requirement.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {requirement.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{requirement.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(requirement.updatedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/requirements/${requirement.id}`);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/requirements/${requirement.id}/edit`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RequirementsTable;
