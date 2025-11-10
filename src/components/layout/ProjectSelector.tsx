import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Project } from '@/types/project.types';
import { projectService } from '@/services/projectMockData';

export function ProjectSelector() {
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const allProjects = await projectService.getAllProjects();
      const activeProjects = allProjects.filter((p) => p.status === 'active');
      setProjects(activeProjects);
      
      // Set first project as default if none selected
      if (!selectedProject && activeProjects.length > 0) {
        setSelectedProject(activeProjects[0]);
      }
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between"
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <FolderKanban className="h-4 w-4 shrink-0" />
            {selectedProject ? (
              <div className="flex flex-col items-start overflow-hidden">
                <span className="truncate font-medium">{selectedProject.name}</span>
                <span className="text-xs text-muted-foreground">{selectedProject.key}</span>
              </div>
            ) : (
              <span>Select project...</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No project found.</CommandEmpty>
            <CommandGroup heading="Active Projects">
              {projects.map((project) => (
                <CommandItem
                  key={project.id}
                  value={`${project.name} ${project.key}`}
                  onSelect={() => handleSelectProject(project)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedProject?.id === project.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{project.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.key} • {project.requirementCount} requirements
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
