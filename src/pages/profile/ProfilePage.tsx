import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Person, Email, Description, Work, Instagram, YouTube, Home } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile, createUserProfile } from '../../services/userService';
import type { UserProfile, UpdateUserProfileData } from '../../models/User';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 폼 상태
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    activityField: '',
    socialMedia: {
      ohouse: '',
      instagram: '',
      youtube: '',
    },
  });

  // 프로필 데이터 로드
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        console.log('No user found');
        return;
      }

      console.log('Loading profile for user:', user.uid);
      setLoading(true);
      setMessage({ type: '', text: '' }); // 메시지 초기화

      try {
        const userProfile = await getUserProfile(user.uid);
        console.log('User profile loaded:', userProfile);

        if (userProfile) {
          setProfile(userProfile);
          setFormData({
            displayName: userProfile.displayName || user.displayName || '',
            bio: userProfile.bio || '',
            activityField: userProfile.activityField || '',
            socialMedia: {
              ohouse: userProfile.socialMedia?.ohouse || '',
              instagram: userProfile.socialMedia?.instagram || '',
              youtube: userProfile.socialMedia?.youtube || '',
            },
          });
        } else {
          console.log('No profile found, setting default values');
          // 프로필이 없으면 Firebase Auth 정보로 기본값 설정
          setProfile(null);
          setFormData({
            displayName: user.displayName || user.email?.split('@')[0] || '',
            bio: '',
            activityField: '',
            socialMedia: {
              ohouse: '',
              instagram: '',
              youtube: '',
            },
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : '프로필을 불러오는 중 오류가 발생했습니다.',
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  // 입력 변경 처리
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 소셜 미디어 입력 변경 처리
  const handleSocialMediaChange = (platform: string, value: string) => {
    // 오늘의집 ID는 숫자만 허용
    if (platform === 'ohouse' && value && !/^\d*$/.test(value)) {
      return; // 숫자가 아닌 경우 입력 무시
    }

    setFormData((prev) => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  // 프로필 저장
  const handleSave = async () => {
    if (!user) {
      setMessage({ type: 'error', text: '사용자 정보를 찾을 수 없습니다.' });
      return;
    }

    // 필수 필드 검증
    if (!formData.displayName.trim()) {
      setMessage({ type: 'error', text: '닉네임을 입력해주세요.' });
      return;
    }

    if (!formData.activityField.trim()) {
      setMessage({ type: 'error', text: '활동 분야를 입력해주세요.' });
      return;
    }

    if (!formData.socialMedia.ohouse.trim()) {
      setMessage({ type: 'error', text: '오늘의집 ID를 입력해주세요.' });
      return;
    }

    // 오늘의집 ID는 숫자만 허용
    if (!/^\d+$/.test(formData.socialMedia.ohouse.trim())) {
      setMessage({ type: 'error', text: '오늘의집 ID는 숫자만 입력 가능합니다.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      console.log('Saving profile for user:', user.uid);
      console.log('Profile data:', formData);

      const profileData: UpdateUserProfileData = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        activityField: formData.activityField.trim(),
        socialMedia: {
          ohouse: formData.socialMedia.ohouse.trim(),
          instagram: formData.socialMedia.instagram.trim(),
          youtube: formData.socialMedia.youtube.trim(),
        },
      };

      if (profile) {
        // 기존 프로필 업데이트
        console.log('Updating existing profile');
        await updateUserProfile(user.uid, profileData);
      } else {
        // 새 프로필 생성
        console.log('Creating new profile');
        await createUserProfile(user.uid, {
          displayName: profileData.displayName!,
          email: user.email || '',
          bio: profileData.bio,
          activityField: profileData.activityField,
          socialMedia: profileData.socialMedia!,
        });
      }

      // 프로필 저장 성공 시 멤버 목록으로 이동
      navigate('/members');
    } catch (error) {
      console.error('Error saving profile:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '프로필 저장 중 오류가 발생했습니다.',
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        프로필 편집
      </Typography>

      {message.text && (
        <Alert
          severity={message.type as 'success' | 'error'}
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* 기본 정보 */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="오늘의집 닉네임"
              value={formData.displayName}
              onChange={(e) => handleInputChange('displayName', e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="이메일"
              value={user?.email || ''}
              disabled
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="자기소개"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              multiline
              rows={4}
              placeholder="자신을 소개해주세요..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Description />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="활동 분야"
              value={formData.activityField}
              onChange={(e) => handleInputChange('activityField', e.target.value)}
              placeholder="예: 인테리어, 라이프스타일, 요리 등"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Work />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* 소셜 미디어 */}
          <Grid size={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2, mb: 2 }}>
              소셜 미디어
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="오늘의집 ID"
              value={formData.socialMedia.ohouse}
              onChange={(e) => handleSocialMediaChange('ohouse', e.target.value)}
              placeholder="19772024"
              required
              helperText="오늘의집 프로필 링크에서 뒷 숫자를 입력하세요 (예: https://ohou.se/users/19772024 → 19772024)"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Home sx={{ color: '#35C5F0' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="인스타그램"
              value={formData.socialMedia.instagram}
              onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              placeholder="@your_instagram"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Instagram sx={{ color: '#E4405F' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="유튜브 채널"
              value={formData.socialMedia.youtube}
              onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              placeholder="@your_channel"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <YouTube sx={{ color: '#FF0000' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* 저장 버튼 */}
          <Grid size={12} sx={{ mt: 3 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving || !formData.displayName || !formData.activityField || !formData.socialMedia.ohouse}
              sx={{
                minWidth: 120,
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              {saving ? <CircularProgress size={24} /> : '저장하기'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfilePage;
