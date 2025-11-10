// src/pages/projects/Projects.tsx
import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Archive,
  Settings,
  FolderKanban,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { CreateProjectDialog } from "@/components/projects/CreateProjectDialog";
import { formatDistanceToNow } from "date-fns";

// ✅ use the real service
import ProjectsService, {
  Project as ApiProject,
  ProjectTemplate as ApiProjectTemplate,
  ProjectStatus as ApiProjectStatus,
} from "@/services/project.service"; // <-- ensure this path (plural)

type RowProject = {
  id: string;
  name: string;
  key: string;
  description?: string;
  template: string;
  ownerName: string;
  status: string; // "active" | "archived" | "on-hold"
  requirementCount: number;
  updatedAt: string;
};

export default function Projects() {
  const [projects, setProjects] = useState<RowProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<RowProject[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const toRow = (p: ApiProject): RowProject => ({
    id: p._id,
    name: p.name ?? "",
    key: (p.key ?? "").toUpperCase(),
    description: p.description ?? "",
    template: (p.template ?? ApiProjectTemplate.BLANK) as string,
    ownerName: "-", // until backend returns owner display name
    status: (p.status ?? ApiProjectStatus.ACTIVE) as string,
    requirementCount:
      typeof p.requirementCount === "number" ? p.requirementCount : 0,
    updatedAt: p.updatedAt ?? p.createdAt ?? new Date().toISOString(),
  });

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const res = await ProjectsService.findAll();
      const list = Array.isArray(res) ? res : res.items;
      console.log("Loaded projects:", list, "raw", res);

      setProjects((list ?? []).map(toRow));
      setFilteredProjects((list ?? []).map(toRow));
    } catch (error) {
      console.error("Failed to load projects:", error);
      setProjects([]);
      setFilteredProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }
    const q = searchQuery.toLowerCase();
    setFilteredProjects(
      projects.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.key.toLowerCase().includes(q) ||
          (p.ownerName ?? "").toLowerCase().includes(q)
      )
    );
  }, [projects, searchQuery]);

  const getTemplateLabel = (template: string) => {
    const labels: Record<string, string> = {
      [ApiProjectTemplate.BLANK]: "Blank",
      [ApiProjectTemplate.SOFTWARE_DEV]: "Software Dev",
      [ApiProjectTemplate.MOBILE_APP]: "Mobile App",
      [ApiProjectTemplate.ENTERPRISE]: "Enterprise",
      [ApiProjectTemplate.API]: "API",
    };
    return labels[template] || template;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      [ApiProjectStatus.ACTIVE]: "default",
      [ApiProjectStatus.ARCHIVED]: "secondary",
      [ApiProjectStatus.ON_HOLD]: "outline",
    };
    return colors[status] || "default";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage your projects and organize requirements
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, key, or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Projects Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Project Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Template</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requirements</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-12 text-muted-foreground"
                >
                  Loading projects...
                </TableCell>
              </TableRow>
            ) : (filteredProjects ?? []).length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <FolderKanban className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">
                      {searchQuery
                        ? "No projects found matching your search"
                        : "No projects yet"}
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(true)}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create your first project
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              (filteredProjects ?? []).map((project) => (
                <TableRow
                  key={project.id}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      {project.description && (
                        <span className="text-sm text-muted-foreground truncate max-w-[280px]">
                          {project.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{project.key}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {getTemplateLabel(project.template)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{project.ownerName || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{project.requirementCount}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(project.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Project Dialog */}
      <CreateProjectDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onProjectCreated={loadProjects}
      />
    </div>
  );
}
