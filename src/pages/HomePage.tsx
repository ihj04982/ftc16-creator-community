import { Box, Typography, Button, Container, Stack, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* 히어로 섹션 */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #35C5F0 0%, #42A5F5 100%)',
          color: 'white',
          py: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              FTC16기 크리에이터 커뮤니티
            </Typography>
            <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
              함께 성장하는 크리에이터들의 전용 공간에서 새로운 가능성을 발견하세요.
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/signin')}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  },
                }}
              >
                로그인
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                  color: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                회원가입
              </Button>
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* 기능 소개 섹션 */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          주요 기능
        </Typography>
        <Typography variant="h6" component="p" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
          크리에이터 커뮤니티를 위한 핵심 기능들
        </Typography>

        <Stack spacing={4}>
          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              멤버 네트워킹
            </Typography>
            <Typography variant="body1" color="text.secondary">
              FTC16기 크리에이터들의 프로필을 확인하고 소셜 미디어를 통해 소통하세요.
            </Typography>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              크리에이터 가이드
            </Typography>
            <Typography variant="body1" color="text.secondary">
              오늘의집 크리에이터 활동에 필요한 모든 정보와 카카오톡 채널을 한곳에서 확인하세요.
            </Typography>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              프로필 관리
            </Typography>
            <Typography variant="body1" color="text.secondary">
              개인 프로필을 관리하고 나만의 포트폴리오를 구축하여 다른 크리에이터들과 연결하세요.
            </Typography>
          </Paper>

          <Paper sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom>
              피드백 & 문의
            </Typography>
            <Typography variant="body1" color="text.secondary">
              서비스 개선 의견, 버그 신고, 기능 제안 등을 쉽게 전달하고 더 나은 커뮤니티를 만들어 나가세요.
            </Typography>
          </Paper>
        </Stack>
      </Container>

      {/* CTA 섹션 */}
      <Box
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            FTC16기와 함께 성장하세요
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            지금 가입하고 크리에이터 커뮤니티의 핵심 멤버가 되어보세요!
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': {
                  backgroundColor: 'grey.100',
                },
              }}
            >
              회원가입하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/signin')}
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              로그인하기
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;
