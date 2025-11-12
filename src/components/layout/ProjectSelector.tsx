// src/components/projects/ProjectSelector.tsx
import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ProjectsService, {
  Project as ApiProject,
  ProjectStatus as ApiProjectStatus,
  ProjectTemplate as ApiProjectTemplate,
} from '@/services/project.service';
import { useProject } from '@/contexts/ProjectContext';

type SelectorProject = {
  id: string;
  name: string;
  key: string;
  status: string;
  requirementCount: number;
  updatedAt: string;
  description?: string;
  template: string;
};

export function ProjectSelector() {
  const { project: selectedProject, setProject } = useProject();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<SelectorProject[]>([]);

  const toSelector = (p: ApiProject): SelectorProject => ({
    id: p._id,
    name: p.name ?? '',
    key: (p.key ?? '').toUpperCase(),
    status: (p.status ?? ApiProjectStatus.ACTIVE) as string,
    requirementCount: p.requirementCount ?? 0,
    updatedAt: p.updatedAt ?? p.createdAt ?? new Date().toISOString(),
    description: p.description ?? '',
    template: (p.template ?? ApiProjectTemplate.BLANK) as string,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await ProjectsService.findAll();
        const list = Array.isArray(res) ? res : res.items;
        const rows = (list ?? []).map(toSelector);
        const active = rows.filter(p => p.status === 'active' || p.status === ApiProjectStatus.ACTIVE);
        if (!alive) return;
        setProjects(active);
        if (!selectedProject && active.length > 0) {
          setProject({ id: active[0].id, name: active[0].name, key: active[0].key });
        }
      } catch (e) {
        if (!alive) return;
        setProjects([]);
      }
    })();
    return () => { alive = false; };
  }, []); // load once

  const handleSelect = (p: SelectorProject) => {
    setProject({ id: p.id, name: p.name, key: p.key });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="w-[240px] justify-between">
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
              {projects.map((p) => (
                <CommandItem
                  key={p.id}
                  value={`${p.name} ${p.key}`}
                  onSelect={() => handleSelect(p)}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedProject?.id === p.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {p.key} • {p.requirementCount} requirements
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
