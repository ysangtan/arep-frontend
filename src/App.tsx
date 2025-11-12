import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import { AppLayout } from "@/components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RequirementsTable from "./pages/requirements/RequirementsTable";
import RequirementDetail from "./pages/requirements/RequirementDetail";
import RequirementEditor from "./pages/requirements/RequirementEditor";
import ElicitationBoard from "./pages/ElicitationBoard";
import ReviewQueue from "./pages/ReviewQueue";
import Projects from "./pages/Projects";
import TraceabilityMatrix from "./pages/TraceabilityMatrix";
import ImpactAnalysis from "./pages/ImpactAnalysis";
import Admin from "./pages/Admin";
import DesignSystem from "./pages/DesignSystem";
import ReviewSessions from "./pages/ReviewSessions";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProjectProvider } from "./contexts/ProjectContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProjectProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Projects />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requirements"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RequirementsTable />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requirements/new"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RequirementEditor />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requirements/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RequirementDetail />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/requirements/:id/edit"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <RequirementEditor />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/elicitation"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ElicitationBoard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reviews"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ReviewQueue />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/review-sessions"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ReviewSessions />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/traceability"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TraceabilityMatrix />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/impact-analysis"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ImpactAnalysis />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/design-system"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <DesignSystem />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Admin />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
