import { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Link,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ArrowLeft, Home } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { createUserProfile } from '../services/userService';

const PRIVACY_VERSION = '2024.06.10';
const PRIVACY_TEXT = `개인정보 수집·이용에 관한 동의\n\n(1) 수집항목: 이메일 주소, 오늘의집 닉네임, 인스타그램 주소 및 아이디, 유튜브·블로그 등 개인이 등록하는 주소 및 아이디\n\n(2) 수집목적: FTC 16기 프로그램 활동을 통한 FTC 16기 유저 간 SNS 상호 팔로우 등\n\n(3) 수집근거: 개인정보보호법 제15조\n\n(4) 보유 및 이용기간: 탈퇴 또는 FTC 16기 활동 종료 시까지`;

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setLoading(false);
      return;
    }

    if (!agreePrivacy) {
      setError('개인정보 수집·이용에 동의해야 가입할 수 있습니다.');
      setLoading(false);
      return;
    }

    try {
      const { user } = await signUp(email, password, displayName);
      await createUserProfile(user.uid, {
        displayName,
        email,
        socialMedia: {},
        privacyConsent: {
          agreed: true,
          agreedAt: new Date(),
          version: PRIVACY_VERSION,
          method: 'signup',
        },
        isProfileComplete: false,
      });
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
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
              오늘의집 크리에이터
            </Typography>
          </Box>
        </Box>

        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
            회원가입
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            FTC16기 크리에이터 커뮤니티에 참여하세요
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {error && <Alert severity="error">{error}</Alert>}

              <TextField
                fullWidth
                label="오늘의집 닉네임"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                autoComplete="name"
              />

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
                autoComplete="new-password"
                helperText="6자 이상 입력해주세요"
              />

              <TextField
                fullWidth
                label="비밀번호 확인"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />

              <FormControlLabel
                control={
                  <Checkbox checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} required />
                }
                label={<span color="text.secondary">개인정보 수집·이용에 동의합니다.</span>}
              />
              <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'pre-line', mb: 1, ml: 4 }}>
                {PRIVACY_TEXT}
              </Typography>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading || !agreePrivacy}
                sx={{ mt: 3, mb: 2 }}
              >
                {loading ? '가입 중...' : '회원가입'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <Link component={RouterLink} to="/signin" color="primary">
                로그인
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default SignupPage;
