import { Link, Outlet } from 'react-router-dom';
import { Box, AppBar, Toolbar, Typography, IconButton, Button, Container } from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  MenuBook as GuideIcon,
  LocalOffer as TagIcon,
  Assignment as MissionIcon,
  Person,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import PrivacyConsentModal from '../components/PrivacyConsentModal';
import { getUserProfile, savePrivacyConsent } from '../services/userService';

const PRIVACY_VERSION = '2024.06.10';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const p = await getUserProfile(user.uid);
        if (!p?.privacyConsent || p.privacyConsent.agreed !== true) {
          setModalOpen(true);
        } else {
          setModalOpen(false);
        }
      } else {
        setModalOpen(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAgree = async () => {
    if (!user) return;
    setModalLoading(true);
    setModalError(undefined);
    try {
      await savePrivacyConsent(user.uid, user.email || '', {
        agreed: true,
        agreedAt: new Date(),
        version: PRIVACY_VERSION,
        method: 'modal',
      });
      setModalOpen(false);
    } catch (e: unknown) {
      if (e instanceof Error) setModalError(e.message);
      else setModalError('동의 처리 중 오류가 발생했습니다.');
    } finally {
      setModalLoading(false);
    }
  };

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
      <PrivacyConsentModal open={modalOpen} onAgree={handleAgree} loading={modalLoading} error={modalError} />
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
              component={Link}
              to="/dashboard"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1, md: 2 },
                flexShrink: 0,
                textDecoration: 'none',
                cursor: 'pointer',
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
                  to="/missions"
                  startIcon={<MissionIcon />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  미션 센터
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
                <Button
                  component={Link}
                  to="/taggroups"
                  startIcon={<TagIcon />}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  태그 그룹
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
                  to="/missions"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <MissionIcon />
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
                <IconButton
                  component={Link}
                  to="/taggroups"
                  size="small"
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <TagIcon />
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
                aria-label="profile"
                sx={{
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Person />
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
                      color: 'primary.dark',
                      opacity: 1,
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
