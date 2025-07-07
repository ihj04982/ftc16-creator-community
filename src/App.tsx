import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import AppLayout from './layout/AppLayout';
import HomePage from './pages/HomePage';
import SigninPage from './pages/SigninPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/profile/ProfilePage';
import MembersPage from './pages/members/MembersPage';
import CreatorGuidePage from './pages/CreatorGuidePage';
import TagGroupsPage from './pages/taggroups/TagGroupsPage';
import CreateTagGroupPage from './pages/taggroups/CreateTagGroupPage';
import TagGroupDetailPage from './pages/taggroups/TagGroupDetailPage';
import MissionCenterPage from './pages/MissionCenterPage';

// 보호된 라우트 컴포넌트
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <>{children}</> : <Navigate to="/signin" replace />;
};

// 비로그인 전용 라우트 컴포넌트
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return !user ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route
            index
            element={
              <PublicRoute>
                <HomePage />
              </PublicRoute>
            }
          />
          <Route
            path="signin"
            element={
              <PublicRoute>
                <SigninPage />
              </PublicRoute>
            }
          />
          <Route
            path="signup"
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            }
          />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="members"
            element={
              <ProtectedRoute>
                <MembersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="missions"
            element={
              <ProtectedRoute>
                <MissionCenterPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="guide"
            element={
              <ProtectedRoute>
                <CreatorGuidePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="taggroups"
            element={
              <ProtectedRoute>
                <TagGroupsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="taggroups/create"
            element={
              <ProtectedRoute>
                <CreateTagGroupPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="taggroups/:id"
            element={
              <ProtectedRoute>
                <TagGroupDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* 기본 리디렉션 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
