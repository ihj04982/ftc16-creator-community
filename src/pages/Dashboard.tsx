import { Box, Container, Typography, Grid, Card, CardContent, Button, Avatar, Chip, Paper, Stack } from '@mui/material';
import {
  People as UsersIcon,
  MessageOutlined as MessageIcon,
  TrendingUp as TrendingUpIcon,
  Event as CalendarIcon,
  AddCircleOutline as PlusCircleIcon,
  Person as UserIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const recentMembers = [
    { name: '김민지', specialty: '인테리어 디자인', avatar: 'KM' },
    { name: '박서준', specialty: '가구 디자인', avatar: 'PS' },
    { name: '이하늘', specialty: '홈 스타일링', avatar: 'LH' },
  ];

  const quickStats = [
    { icon: <UsersIcon sx={{ fontSize: 32 }} />, value: 52, label: '총 멤버', color: 'primary.main' },
    { icon: <MessageIcon sx={{ fontSize: 32 }} />, value: 127, label: '게시글', color: 'secondary.main' },
    { icon: <TrendingUpIcon sx={{ fontSize: 32 }} />, value: 15, label: '이번 주 활동', color: 'success.main' },
    { icon: <CalendarIcon sx={{ fontSize: 32 }} />, value: 3, label: '새 멤버', color: 'accent.main' },
  ];

  const quickActions = [
    { icon: <UsersIcon />, label: '멤버 목록', path: '/members', color: 'primary.main' },
    { icon: <MessageIcon />, label: '게시판', path: '/board', color: 'secondary.main' },
    { icon: <PlusCircleIcon />, label: '글쓰기', path: '/board/new', color: 'success.main' },
    { icon: <UserIcon />, label: '내 프로필', path: '/profile', color: 'accent.main' },
  ];

  const recentActivities = [
    { text: '새로운 멤버 3명이 가입했습니다', time: '방금 전', color: 'primary.main' },
    { text: '"인테리어 트렌드 2024" 게시글이 인기입니다', time: '1시간 전', color: 'secondary.main' },
    { text: '협업 프로젝트 모집 게시글이 등록되었습니다', time: '3시간 전', color: 'success.main' },
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Welcome Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
            안녕하세요, {user?.displayName || user?.email}님! 👋
          </Typography>
          <Typography variant="h6" color="text.secondary">
            오늘도 멋진 인사이트를 공유하고 새로운 크리에이터들과 연결해보세요
          </Typography>
        </Box>

        {/* Quick Stats */}
        <Box
          sx={{
            mb: 4,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 3,
          }}
        >
          {quickStats.map((stat, index) => (
            <Card
              key={index}
              sx={{
                textAlign: 'center',
                p: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 3,
                },
              }}
            >
              <CardContent>
                <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid size={{ xs: 12, lg: 8 }}>
            {/* Quick Actions */}
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  빠른 액세스
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  자주 사용하는 기능들을 바로 이용해보세요
                </Typography>
                <Grid container spacing={2}>
                  {quickActions.map((action, index) => (
                    <Grid size={{ xs: 6, md: 3 }} key={index}>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{
                          height: 80,
                          flexDirection: 'column',
                          gap: 1,
                          borderColor: 'divider',
                          color: action.color,
                          '&:hover': {
                            borderColor: action.color,
                            bgcolor: `${action.color}08`,
                          },
                        }}
                        onClick={() => navigate(action.path)}
                      >
                        {action.icon}
                        <Typography variant="body2">{action.label}</Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                  최근 활동
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  커뮤니티의 최근 소식을 확인해보세요
                </Typography>
                <Stack spacing={2}>
                  {recentActivities.map((activity, index) => (
                    <Paper key={index} sx={{ p: 2, bgcolor: 'grey.50' }}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: activity.color,
                          }}
                        />
                        <Typography variant="body2" sx={{ flexGrow: 1 }}>
                          {activity.text}
                        </Typography>
                        <Chip label={activity.time} size="small" variant="outlined" sx={{ fontSize: '0.75rem' }} />
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3}>
              {/* New Members */}
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
                    새로운 멤버
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    최근에 가입한 크리에이터들을 만나보세요
                  </Typography>
                  <Stack spacing={2}>
                    {recentMembers.map((member, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{member.avatar}</Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {member.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {member.specialty}
                          </Typography>
                        </Box>
                        <Button variant="text" size="small" sx={{ color: 'primary.main' }}>
                          팔로우
                        </Button>
                      </Box>
                    ))}
                  </Stack>
                  <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => navigate('/members')}>
                    모든 멤버 보기
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card>
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
                        첫 게시글을 작성해보세요
                      </Typography>
                      <Typography variant="caption">인사글이나 작업물을 공유하며 커뮤니티에 참여해보세요</Typography>
                    </Paper>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;
