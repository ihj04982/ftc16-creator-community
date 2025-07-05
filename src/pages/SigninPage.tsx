import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, Alert, Link, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ArrowLeft, Home } from '@mui/icons-material';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signIn(email, password);
    } catch {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        flex: 1,
        background: 'linear-gradient(to bottom, #E0F2FE, #FFFFFF)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 'sm' }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Link
            component={RouterLink}
            to="/"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              color: 'primary.main',
              textDecoration: 'none',
              mb: 2,
              '&:hover': {
                color: 'primary.dark',
              },
            }}
          >
            <ArrowLeft sx={{ fontSize: 16 }} />
            홈으로 돌아가기
          </Link>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
            <Home sx={{ fontSize: 32, color: 'primary.main' }} />
            <Typography variant="h5" component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
              오늘의 집 크리에이터
            </Typography>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            로그인
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            FTC16기 크리에이터 커뮤니티에 오신 것을 환영합니다
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button type="submit" variant="contained" size="large" fullWidth disabled={loading} sx={{ mt: 3, mb: 2 }}>
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <Link component={RouterLink} to="/signup" color="primary">
                회원가입
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SigninPage;
