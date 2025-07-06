import { Box, Container, Typography, Grid, Card, CardContent, Button, Paper, Stack } from '@mui/material';
import {
  People as UsersIcon,
  Person as UserIcon,
  MenuBook as GuideIcon,
  Tag as TagIcon,
  Feedback as FeedbackIcon,
  BugReport as BugReportIcon,
  Lightbulb as LightbulbIcon,
  ContactSupport as ContactSupportIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const quickActions = [
    { icon: <UsersIcon />, label: '멤버 목록', path: '/members', color: 'primary.main' },
    { icon: <UserIcon />, label: '내 프로필', path: '/profile', color: 'accent.main' },
    { icon: <GuideIcon />, label: '크리에이터 가이드', path: '/guide', color: 'secondary.main' },
    { icon: <TagIcon />, label: '태그 그룹', path: '/taggroups', color: 'warning.main' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            안녕하세요, {user?.displayName || user?.email}님! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            오늘도 멋진 인사이트를 공유하고 새로운 크리에이터들과 연결해보세요
          </Typography>
        </Box>

        <Stack spacing={4}>
          {/* Quick Actions */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600, textAlign: 'center' }}>
                빠른 액세스
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                자주 사용하는 기능들을 바로 이용해보세요
              </Typography>
              <Grid container spacing={3} justifyContent="center">
                {quickActions.map((action, index) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={index}>
                    <Button
                      variant="outlined"
                      fullWidth
                      sx={{
                        height: 100,
                        flexDirection: 'column',
                        gap: 1.5,
                        borderColor: 'divider',
                        color: action.color,
                        '&:hover': {
                          borderColor: action.color,
                          bgcolor: `${action.color}08`,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => navigate(action.path)}
                    >
                      <Box sx={{ fontSize: 32 }}>{action.icon}</Box>
                      <Typography variant="body2" fontWeight={500}>
                        {action.label}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Two Column Layout for Tips and Feedback */}
          <Grid container spacing={4}>
            {/* Quick Tips */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    💡 커뮤니티 팁
                  </Typography>
                  <Stack spacing={2}>
                    <Paper sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        프로필을 완성하세요
                      </Typography>
                      <Typography variant="caption">
                        자기소개와 전문 분야를 추가하면 더 많은 연결 기회를 얻을 수 있어요
                      </Typography>
                    </Paper>
                    <Paper sx={{ p: 2, bgcolor: 'secondary.main', color: 'white' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                        크리에이터 가이드를 확인하세요
                      </Typography>
                      <Typography variant="caption">
                        활동에 필요한 모든 정보와 채널을 한 곳에서 확인할 수 있어요
                      </Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Feedback & Questions */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Card sx={{ height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    📝 피드백 & 문의
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    서비스를 더 좋게 만들기 위한 소중한 의견을 들려주세요
                  </Typography>

                  <Grid container spacing={1.5} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 6 }}>
                      <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
                        <FeedbackIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="caption" display="block" fontWeight={500}>
                          서비스 개선
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'error.main', color: 'white' }}>
                        <BugReportIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="caption" display="block" fontWeight={500}>
                          버그 신고
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'warning.main', color: 'white' }}>
                        <LightbulbIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="caption" display="block" fontWeight={500}>
                          기능 제안
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Paper sx={{ p: 1.5, textAlign: 'center', bgcolor: 'info.main', color: 'white' }}>
                        <ContactSupportIcon sx={{ fontSize: 20, mb: 0.5 }} />
                        <Typography variant="caption" display="block" fontWeight={500}>
                          기타 문의
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>

                  <Button
                    variant="contained"
                    fullWidth
                    endIcon={<LaunchIcon />}
                    onClick={() =>
                      window.open(
                        'https://docs.google.com/forms/d/e/1FAIpQLSffV1_TwDiuKO6tvJ0lcm1N-g9U1YQT1BuzUfqvWXc93oSiHQ/viewform?usp=header',
                        '_blank',
                      )
                    }
                    sx={{
                      bgcolor: '#4285F4',
                      color: 'white',
                      py: 1.5,
                      fontWeight: 600,
                      '&:hover': {
                        bgcolor: '#3367D6',
                      },
                    }}
                  >
                    피드백 제출하기
                  </Button>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', mt: 1, textAlign: 'center' }}
                  >
                    익명으로 제출 가능하며, 모든 의견은 서비스 개선에 반영됩니다
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default Dashboard;
