import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Button, Container } from '@mui/material';
import {
  Settings as SettingsIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MenuBook as GuideIcon,
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
              py: { xs: 1, md: 2 },
              px: { xs: 2, md: 3 },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: { xs: 56, md: 64 },
            }}
          >
            {/* Logo Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 2 },
                flexShrink: 0,
              }}
            >
              <DashboardIcon
                sx={{
                  color: 'primary.main',
                  fontSize: { xs: 24, md: 28 },
                }}
              />
              <Typography
                variant="h6"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  letterSpacing: '-0.5px',
                  fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                  FTC16 크리에이터 커뮤니티
                </Box>
                <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                  FTC16
                </Box>
              </Typography>
            </Box>

            {/* Navigation Menu (Only when user is logged in) */}
            {user && (
              <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
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
                <Button
                  component={Link}
                  to="/guide"
                  startIcon={<GuideIcon />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  크리에이터 가이드
                </Button>
              </Box>
            )}

            {/* Mobile Navigation - Icon Only */}
            {user && (
              <Box
                sx={{
                  display: { xs: 'flex', md: 'none' },
                  alignItems: 'center',
                  gap: 0.5,
                  mx: 1,
                }}
              >
                <IconButton
                  component={Link}
                  to="/dashboard"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <DashboardIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/members"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <PeopleIcon />
                </IconButton>
                <IconButton
                  component={Link}
                  to="/guide"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <GuideIcon />
                </IconButton>
              </Box>
            )}

            {/* Action Section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 0.5, md: 1 },
                flexShrink: 0,
              }}
            >
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
                    ml: { xs: 1, md: 2 },
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    px: { xs: 1, md: 2 },
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
