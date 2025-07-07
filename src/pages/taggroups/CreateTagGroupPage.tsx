import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { createTagGroup } from '../../services/tagGroupService';
import { getUserProfile } from '../../services/userService';
import { SnsType, SNS_TYPE_LABELS } from '../../models/TagGroup';

interface FormData {
  name: string;
  description: string;
  snsType: SnsType;
}

const CreateTagGroupPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    snsType: SnsType.INSTAGRAM,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: 'error', text: '로그인이 필요합니다.' });
      return;
    }

    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: '태그 그룹 이름을 입력해주세요.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // 사용자 프로필 정보 가져오기
      const userProfile = await getUserProfile(user.uid);

      if (!userProfile) {
        setMessage({ type: 'error', text: '사용자 프로필 정보를 찾을 수 없습니다.' });
        setLoading(false);
        return;
      }

      await createTagGroup(user.uid, userProfile.displayName, userProfile.socialMedia.instagram || '', {
        name: formData.name.trim(),
        description: formData.description.trim(),
        snsType: formData.snsType,
      });

      setMessage({ type: 'success', text: '태그 그룹이 성공적으로 생성되었습니다.' });

      // 2초 후 목록 페이지로 이동
      setTimeout(() => {
        navigate('/taggroups');
      }, 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '태그 그룹 생성 중 오류가 발생했습니다.',
      });
    }
    setLoading(false);
  };

  const handleBack = () => {
    navigate('/taggroups');
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mr: 2 }}>
          목록으로
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          태그 그룹 생성
        </Typography>
      </Box>

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
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="태그 그룹 이름"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              fullWidth
              placeholder="예: 인테리어 체험단"
              helperText="체험단, 이벤트트 등 태그 그룹의 목적을 명확히 나타내는 이름을 입력하세요"
            />

            <TextField
              label="설명"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={4}
              fullWidth
              placeholder="태그 그룹에 대한 자세한 설명을 입력하세요"
            />

            <FormControl fullWidth>
              <InputLabel>SNS 플랫폼</InputLabel>
              <Select
                value={formData.snsType}
                onChange={(e) => handleInputChange('snsType', e.target.value as SnsType)}
                label="SNS 플랫폼"
              >
                {Object.entries(SNS_TYPE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button type="button" variant="outlined" onClick={handleBack} disabled={loading}>
                취소
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                disabled={loading || !formData.name.trim()}
                sx={{ minWidth: 120 }}
              >
                {loading ? '생성 중...' : '생성하기'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTagGroupPage;
