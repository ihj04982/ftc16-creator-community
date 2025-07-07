import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  Button,
  Divider,
  Alert,
} from '@mui/material';
import { School, Chat, Launch, Groups, MonetizationOn, Article, Quiz } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';

// 카카오톡 채널 데이터
const kakaoChannels = [
  {
    name: '오늘의집 크리에이터',
    url: 'https://pf.kakao.com/_NcfxaG',
    description: '크리에이터 활동 관련 공지사항 및 소식',
    icon: <Article />,
    color: '#FEE500',
  },
  {
    name: '오늘의집 오감리뷰',
    url: 'https://pf.kakao.com/_xgxfnNG',
    description: '오감리뷰 프로그램 관련 정보',
    icon: <Quiz />,
    color: '#FF6B6B',
  },
  {
    name: '오늘의집 콘텐츠 수익화',
    url: 'https://pf.kakao.com/_GxoxcxiG',
    description: '수익화 프로그램 및 광고 관련 정보',
    icon: <MonetizationOn />,
    color: '#4ECDC4',
  },
  {
    name: '오늘의집 FTC',
    url: 'https://pf.kakao.com/_xoQpan',
    description: 'FTC 프로그램 관련 공지사항',
    icon: <School />,
    color: '#45B7D1',
  },
  {
    name: 'FTC16기 동기 소통방',
    url: 'https://open.kakao.com/o/gC1jIuEh',
    description: '16기 동기들과의 소통 공간',
    icon: <Groups />,
    color: '#96CEB4',
  },
];

// 웹 링크 데이터
const webLinks = [
  {
    name: '크리에이터 클래스 바로가기',
    url: 'https://ohou.se/advices/10639',
    description: '총 22개의 내부 링크로 구성된 크리에이터 교육 자료',
    icon: <School />,
    category: '시작하기',
  },
  {
    name: '수익화 프로그램 소개',
    url: 'https://url.kr/i1pyvx',
    description: '오늘의집 수익화 프로그램 전체 소개 (노션)',
    icon: <MonetizationOn />,
    category: '시작하기',
  },
];

// 카카오톡 링크 처리 함수
const handleKakaoLink = (url: string) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  if (isMobile) {
    // 모바일에서는 카카오톡 앱으로 열기 시도
    window.open(url, '_blank');
  } else {
    // 데스크톱에서는 웹으로 열기
    window.open(url, '_blank');
  }
};

const CreatorGuidePage: React.FC = () => {
  const { user } = useAuth();

  // 로그인하지 않은 사용자 처리
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          크리에이터 가이드는 로그인한 멤버만 이용할 수 있습니다.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          크리에이터 가이드
        </Typography>
        <Typography variant="body1" color="text.secondary">
          오늘의집 크리에이터 활동에 필요한 모든 정보를 한 곳에서 확인하세요
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* 시작하기 섹션 */}
        <Grid size={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            🚀 시작하기
          </Typography>
          <Grid container spacing={2}>
            {webLinks.map((link) => (
              <Grid size={{ xs: 12, md: 6 }} key={link.name}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: 'primary.main',
                            color: 'white',
                          }}
                        >
                          {link.icon}
                        </Box>
                        <Typography variant="h6" fontWeight={600}>
                          {link.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {link.description}
                      </Typography>
                      <Button
                        variant="contained"
                        endIcon={<Launch />}
                        onClick={() => window.open(link.url, '_blank')}
                        sx={{ mt: 1 }}
                      >
                        바로가기
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid size={12}>
          <Divider sx={{ my: 2 }} />
        </Grid>

        {/* 소통 채널 섹션 */}
        <Grid size={12}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            💬 소통 채널
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              💡 <strong>모바일</strong>에서는 카카오톡 앱으로, <strong>데스크톱</strong>에서는 웹으로 열립니다
            </Typography>
          </Alert>
          <Grid container spacing={2}>
            {kakaoChannels.map((channel) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={channel.name}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    minHeight: 200,
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Stack spacing={2} sx={{ height: '100%' }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: channel.color,
                            color: 'white',
                          }}
                        >
                          {channel.icon}
                        </Box>
                        <Chip
                          label="카카오톡"
                          size="small"
                          sx={{
                            bgcolor: '#FEE500',
                            color: '#000',
                            fontWeight: 600,
                          }}
                        />
                      </Stack>
                      <Typography variant="h6" fontWeight={600} sx={{ minHeight: '2.5rem' }}>
                        {channel.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          flex: 1,
                          minHeight: '2.5rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {channel.description}
                      </Typography>
                      <Button
                        variant="contained"
                        endIcon={<Chat />}
                        onClick={() => handleKakaoLink(channel.url)}
                        sx={{
                          bgcolor: '#FEE500',
                          color: '#000',
                          '&:hover': {
                            bgcolor: '#FDD835',
                          },
                        }}
                      >
                        채널 참여
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>

      {/* 도움말 섹션 */}
      <Box sx={{ mt: 6 }}>
        <Alert severity="info">
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            피드백 & 문의
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            서비스 개선, 버그 신고, 기능 제안 등 소중한 의견을 들려주세요
          </Typography>
          <Button
            variant="contained"
            endIcon={<Launch />}
            onClick={() =>
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLSffV1_TwDiuKO6tvJ0lcm1N-g9U1YQT1BuzUfqvWXc93oSiHQ/viewform?usp=header',
                '_blank',
              )
            }
            sx={{
              bgcolor: '#4285F4',
              color: 'white',
              px: 3,
              py: 1,
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#3367D6',
              },
            }}
          >
            피드백 제출하기
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            익명으로 제출 가능합니다
          </Typography>
        </Alert>
      </Box>
    </Container>
  );
};

export default CreatorGuidePage;
