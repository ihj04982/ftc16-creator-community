import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Button, Container } from '@mui/material';
import {
  Notifications as BellIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

const AppLayout = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxSizing: 'border-box',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      {/* Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          borderBottom: 1,
          borderColor: 'divider',
          zIndex: 'appBar',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            sx={{
              py: 2,
              px: 3,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <DashboardIcon
                sx={{
                  color: 'primary.main',
                  fontSize: 28,
                }}
              />
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                }}
              >
                FTC16 크리에이터 커뮤니티
              </Typography>
            </Box>

            {/* Navigation Menu (Only when user is logged in) */}
            {user && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mx: 3,
                }}
              >
                <Button
                  component={Link}
                  to="/dashboard"
                  startIcon={<DashboardIcon />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  대시보드
                </Button>
                <Button
                  component={Link}
                  to="/members"
                  startIcon={<PeopleIcon />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  멤버
                </Button>
              </Box>
            )}

            {/* Action Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <IconButton
                size="medium"
                aria-label="notifications"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <BellIcon />
              </IconButton>

              <IconButton
                size="medium"
                component={Link}
                to="/profile"
                aria-label="settings"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <SettingsIcon />
              </IconButton>

              {user && (
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleLogout}
                  sx={{
                    ml: 2,
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'primary.dark',
                      bgcolor: 'primary.light',
                      opacity: 0.08,
                    },
                  }}
                >
                  로그아웃
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;
