// src/pages/requirements/RequirementsTable.tsx
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/requirements/StatusBadge";
import { PriorityIndicator } from "@/components/requirements/PriorityIndicator";
import { Search, Plus, Filter, Eye, Edit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import RequirementsService, {
  Requirement,
  RequirementStatus,
  RequirementType,
  Priority,
  FilterRequirementDto,
  ListEnvelope,
} from "@/services/requirements.service";

const RequirementsTable = () => {
  const navigate = useNavigate();
  const { project } = useProject(); // ⬅️ use ProjectContext only
  const effectiveProjectId = project?.id;

  // UI filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequirementStatus[]>([]);
  const [typeFilter, setTypeFilter] = useState<RequirementType[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<Priority[]>([]);

  // data state
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search a bit
  const debouncedSearch = useMemo(() => ({ val: searchQuery }), [searchQuery]);

  // Build API filter from UI state
  const buildApiFilter = (): FilterRequirementDto => {
    const filter: FilterRequirementDto = {};
    if (effectiveProjectId) filter.projectId = effectiveProjectId;
    if (statusFilter.length > 0) filter.status = statusFilter[0];
    if (typeFilter.length > 0) filter.type = typeFilter[0];
    if (priorityFilter.length > 0) filter.priority = priorityFilter[0];
    if (searchQuery.trim()) filter.search = searchQuery.trim();
    return filter;
  };

  // Fetch requirements whenever filters change
  useEffect(() => {
    // If no project selected, show message and skip fetching
    if (!effectiveProjectId) {
      setRequirements([]);
      setTotalCount(null);
      setLoading(false);
      setError(null);
      return;
    }

    let alive = true;
    const t = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const filter = buildApiFilter();
        const data = await RequirementsService.findAll(filter);
        if (!alive) return;

        if (Array.isArray(data)) {
          setRequirements(data ?? []);
          setTotalCount(null);
        } else {
          const env = data as ListEnvelope<Requirement>;
          setRequirements(env?.items ?? []);
          setTotalCount(env?.total ?? null);
        }
      } catch (e: any) {
        if (!alive) return;
        setError(
          e?.response?.data?.message ??
            e?.message ??
            "Failed to load requirements"
        );
      } finally {
        if (alive) setLoading(false);
      }
    }, 300); // simple debounce

    return () => {
      alive = false;
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveProjectId,
    debouncedSearch,
    statusFilter,
    typeFilter,
    priorityFilter,
  ]);

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value === "all" ? [] : [value as RequirementStatus]);
  };

  const handleTypeFilterChange = (value: string) => {
    setTypeFilter(value === "all" ? [] : [value as RequirementType]);
  };

  const handlePriorityFilterChange = (value: string) => {
    setPriorityFilter(value === "all" ? [] : [value as Priority]);
  };

  const formatDate = (dateString?: string) => {
    const iso = dateString ?? new Date().toISOString();
    const date = new Date(iso);
    if (isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Show helper UI when no project is selected
  if (!effectiveProjectId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Requirements</h1>
            <p className="text-muted-foreground mt-1">
              Select a project to view its requirements.
            </p>
          </div>
          <Button
            onClick={() => navigate("/projects")}
            className="flex items-center space-x-2"
          >
            <span>Go to Projects</span>
          </Button>
        </div>

        <Card className="p-8">
          <div className="text-center space-y-2">
            <Search className="w-10 h-10 mx-auto text-gray-300" />
            <p className="text-lg font-medium">No project selected</p>
            <p className="text-sm text-muted-foreground">
              Please choose a project from the projects page to see its
              requirements.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Normal table when a project is selected
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
        <Button
          onClick={() => navigate("/requirements/new")}
          className="flex items-center space-x-2"
        >
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
              <SelectItem value={RequirementStatus.DRAFT}>Draft</SelectItem>
              <SelectItem value={RequirementStatus.IN_REVIEW}>
                In Review
              </SelectItem>
              <SelectItem value={RequirementStatus.APPROVED}>
                Approved
              </SelectItem>
              <SelectItem value={RequirementStatus.REJECTED}>
                Rejected
              </SelectItem>
              <SelectItem value={RequirementStatus.IMPLEMENTED}>
                Implemented
              </SelectItem>
              <SelectItem value={RequirementStatus.VERIFIED}>
                Verified
              </SelectItem>
              <SelectItem value={RequirementStatus.CLOSED}>Closed</SelectItem>
            </SelectContent>
          </Select>

          {/* Type Filter */}
          <Select onValueChange={handleTypeFilterChange} defaultValue="all">
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={RequirementType.FUNCTIONAL}>
                Functional
              </SelectItem>
              <SelectItem value={RequirementType.NON_FUNCTIONAL}>
                Non-Functional
              </SelectItem>
              <SelectItem value={RequirementType.CONSTRAINT}>
                Constraint
              </SelectItem>
              <SelectItem value={RequirementType.BUSINESS_RULE}>
                Business Rule
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority Filter Row */}
        <div className="mt-4 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Priority:</span>
          <Button
            variant={priorityFilter.length === 0 ? "default" : "outline"}
            size="sm"
            onClick={() => handlePriorityFilterChange("all")}
          >
            All
          </Button>
          <Button
            variant={
              priorityFilter.includes(Priority.HIGH) ? "default" : "outline"
            }
            size="sm"
            onClick={() => handlePriorityFilterChange(Priority.HIGH)}
          >
            High
          </Button>
          <Button
            variant={
              priorityFilter.includes(Priority.MEDIUM) ? "default" : "outline"
            }
            size="sm"
            onClick={() => handlePriorityFilterChange(Priority.MEDIUM)}
          >
            Medium
          </Button>
          <Button
            variant={
              priorityFilter.includes(Priority.LOW) ? "default" : "outline"
            }
            size="sm"
            onClick={() => handlePriorityFilterChange(Priority.LOW)}
          >
            Low
          </Button>
        </div>
      </Card>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? (
            <>Loading…</>
          ) : (
            <>
              Showing{" "}
              <span className="font-medium text-foreground">
                {(requirements ?? []).length}
              </span>
              {typeof totalCount === "number" ? (
                <>
                  {" "}
                  of{" "}
                  <span className="font-medium text-foreground">
                    {totalCount}
                  </span>{" "}
                  requirements
                </>
              ) : (
                <> requirements</>
              )}
            </>
          )}
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
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
            {!loading && (requirements ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center space-y-2">
                    <Search className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500">No requirements found</p>
                    <p className="text-sm text-gray-400">
                      Try adjusting your filters
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (requirements ?? []).map((requirement) => {
                const tags = requirement.tags ?? [];
                const typeLabel = (requirement.type ?? "")
                  .toString()
                  .replace("-", " ");
                const when = requirement.updatedAt ?? requirement.createdAt;

                return (
                  <TableRow
                    key={requirement._id}
                    className="cursor-pointer hover:bg-gray-50"
                    // onClick={() => {
                    //   setRequirement({
                    //     id: requirement._id,
                    //     title: requirement.title,
                    //   });
                    //   navigate("/requirement-detail");
                    // }}
                    onClick={() => navigate(`/requirements/${requirement._id}`)}
                  >
                    <TableCell className="font-mono text-sm font-medium">
                      {requirement.reqId ?? "—"}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="font-medium truncate">
                          {requirement.title ?? "Untitled"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {requirement.description ?? ""}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm capitalize">{typeLabel}</span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge
                        status={requirement.status ?? RequirementStatus.DRAFT}
                      />
                    </TableCell>
                    <TableCell>
                      <PriorityIndicator
                        priority={requirement.priority ?? Priority.MEDIUM}
                        showLabel
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(when)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/requirements/${requirement._id}`);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/requirements/${requirement._id}/edit`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default RequirementsTable;
