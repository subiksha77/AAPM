import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

// Layouts & Route Guards
import { Layout } from './components/layout/Layout';
import { AuthLayout } from './components/layout/AuthLayout';
import { ProtectedRoute, PublicRoute } from './components/layout/ProtectedRoute';

// Auth Pages
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Protected Application Pages
import { DashboardPage } from './pages/DashboardPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectOverviewPage } from './pages/ProjectOverviewPage';
import { TasksPage } from './pages/TasksPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { PlanningPage } from './pages/PlanningPage';
import { RisksPage } from './pages/RisksPage';
import { ProgressTrackingPage } from './pages/ProgressTrackingPage';
import { FocusModePage } from './pages/FocusModePage';
import { ReadinessAssessmentPage } from './pages/ReadinessAssessmentPage';
import { AIMentorPage } from './pages/AIMentorPage';
import { DocumentationPage } from './pages/DocumentationPage';

export const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Auth Routes */}
              <Route element={<PublicRoute />}>
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                </Route>
              </Route>

              {/* Protected Application Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  <Route path="/create-project" element={<CreateProjectPage />} />
                  <Route path="/project-overview" element={<ProjectOverviewPage />} />
                  <Route path="/project" element={<Navigate to="/project-overview" replace />} />
                  
                  <Route path="/tasks" element={<TasksPage />} />
                  <Route path="/milestones" element={<MilestonesPage />} />
                  <Route path="/planning" element={<PlanningPage />} />
                  <Route path="/risks" element={<RisksPage />} />
                  <Route path="/progress" element={<ProgressTrackingPage />} />
                  
                  <Route path="/focus" element={<FocusModePage />} />
                  <Route path="/focus-mode" element={<FocusModePage />} />
                  <Route path="/readiness" element={<ReadinessAssessmentPage />} />
                  <Route path="/readiness-assessment" element={<ReadinessAssessmentPage />} />
                  
                  <Route path="/ai-mentor" element={<AIMentorPage />} />
                  <Route path="/mentor" element={<Navigate to="/ai-mentor" replace />} />
                  
                  <Route path="/documentation" element={<DocumentationPage />} />
                </Route>
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
