// src/contexts/RequirementContext.tsx
import { createContext, useContext, useMemo, useState } from "react";

export type SelectedRequirement = {
  id: string;
  title?: string;
};

type RequirementContextValue = {
  requirement: SelectedRequirement | null;
  setRequirement: (r: SelectedRequirement | null) => void;
  clearRequirement: () => void;
};

const RequirementContext = createContext<RequirementContextValue | undefined>(undefined);

export function RequirementProvider({ children }: { children: React.ReactNode }) {
  const [requirement, setRequirementState] = useState<SelectedRequirement | null>(null);

  const setRequirement = (r: SelectedRequirement | null) => setRequirementState(r);
  const clearRequirement = () => setRequirementState(null);

  const value = useMemo(() => ({ requirement, setRequirement, clearRequirement }), [requirement]);
  return <RequirementContext.Provider value={value}>{children}</RequirementContext.Provider>;
}

export function useRequirement() {
  const ctx = useContext(RequirementContext);
  if (!ctx) throw new Error("useRequirement must be used within RequirementProvider");
  return ctx;
}
