// src/contexts/ProjectContext.tsx
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type SelectedProject = {
  id: string;
  name: string;
  key: string;
};

type ProjectContextValue = {
  project: SelectedProject | null;
  setProject: (p: SelectedProject | null) => void;
  clearProject: () => void;
};

const ProjectContext = createContext<ProjectContextValue | undefined>(undefined);

const STORAGE_KEY = 'active_project';

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProjectState] = useState<SelectedProject | null>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) setProjectState(JSON.parse(cached));
    } catch {}
  }, []);

  const setProject = (p: SelectedProject | null) => {
    setProjectState(p);
    try {
      if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const clearProject = () => setProject(null);

  const value = useMemo(() => ({ project, setProject, clearProject }), [project]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within a ProjectProvider');
  return ctx;
}
