import * as React from 'react';
import { 
  HashRouter as Router, 
  Routes, 
  Route, 
  Navigate 
} from 'react-router-dom';
import { 
  QueryClient, 
  QueryClientProvider 
} from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';

// Layous & Pages Imports
import { DashboardLayout } from './components/common/DashboardLayout';
import { LoginPage } from './features/auth/LoginPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { EmployeesPage } from './features/employees/EmployeesPage';
import { DepartmentsPage } from './features/departments/DepartmentsPage';
import { ProfilePage } from './features/profile/ProfilePage';
import { SettingsPage } from './features/settings/SettingsPage';

// Initialize TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1, // small retry for simulated offline controls
      staleTime: 5000,
    }
  }
});

/**
 * Public Layout Wrapper (unauthenticated access only)
 */
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuth = !!localStorage.getItem('ems_auth_token_v1');
  
  if (isAuth) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

/**
 * Protected Route Wrapper (guarded by auth token check)
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuth = !!localStorage.getItem('ems_auth_token_v1');

  if (!isAuth) {
    // Notify user to sign in
    React.useEffect(() => {
      toast.error('Access Denied: Administrative credential check-in required.');
    }, []);
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Authentication Path */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Protected Administrative Paths */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/departments" 
            element={
              <ProtectedRoute>
                <DepartmentsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />

          {/* Fallbacks & Defaults */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>

      {/* Modern custom Toast visual emitter */}
      <Toaster 
        position="top-right"
        closeButton
        richColors
        toastOptions={{
          style: {
            borderRadius: '10px',
            fontSize: '13px',
          }
        }}
      />
    </QueryClientProvider>
  );
}
