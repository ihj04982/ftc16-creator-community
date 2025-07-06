import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ArrowBack,
  ContentCopy,
  People,
  CalendarToday,
  Edit,
  Delete,
  Save,
  Cancel,
  ExpandMore,
  ExpandLess,
  Refresh,
  PersonAdd,
  PersonRemove,
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  getTagGroup,
  generateInstagramTags,
  updateTagGroup,
  deleteTagGroup,
  applyToTagGroup,
  cancelTagGroupApplication,
} from '../../services/tagGroupService';
import { getUserProfile } from '../../services/userService';
import type { TagGroup } from '../../models/TagGroup';
import type { UserProfile } from '../../models/User';

const TagGroupDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tagGroup, setTagGroup] = useState<TagGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [copySuccess, setCopySuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showApplicants, setShowApplicants] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  // 태그 그룹 및 사용자 프로필 로드
  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setMessage({ type: 'error', text: '태그 그룹 ID가 없습니다.' });
        setLoading(false);
        return;
      }

      try {
        const [groupData, profile] = await Promise.all([getTagGroup(id), user ? getUserProfile(user.uid) : null]);

        if (!groupData) {
          setMessage({ type: 'error', text: '태그 그룹을 찾을 수 없습니다.' });
          setLoading(false);
          return;
        }

        setTagGroup(groupData);
        setUserProfile(profile);
        setEditForm({
          name: groupData.name,
          description: groupData.description || '',
          isActive: groupData.isActive,
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: error instanceof Error ? error.message : '데이터 로드 중 오류가 발생했습니다.',
        });
      }
      setLoading(false);
    };

    loadData();
  }, [id, user]);

  // 인스타그램 태그 복사
  const handleCopyInstagramTags = async () => {
    if (!tagGroup || tagGroup.applications.length === 0) {
      setMessage({ type: 'error', text: '복사할 태그가 없습니다.' });
      return;
    }

    const tags = generateInstagramTags(tagGroup.applications);

    try {
      await navigator.clipboard.writeText(tags);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      setMessage({ type: 'error', text: '클립보드 복사에 실패했습니다.' });
    }
  };

  // 태그 그룹 삭제
  const handleDelete = async () => {
    if (!tagGroup || !user) return;

    if (!window.confirm('정말 이 태그 그룹을 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteTagGroup(tagGroup.id);
      setMessage({ type: 'success', text: '태그 그룹이 삭제되었습니다.' });
      setTimeout(() => navigate('/taggroups'), 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '삭제 중 오류가 발생했습니다.',
      });
    }
  };

  // 수정 모드 토글
  const handleEdit = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false);
    if (tagGroup) {
      setEditForm({
        name: tagGroup.name,
        description: tagGroup.description || '',
        isActive: tagGroup.isActive,
      });
    }
  };

  // 수정 저장
  const handleSave = async () => {
    if (!tagGroup || !user) return;

    try {
      await updateTagGroup(tagGroup.id, {
        name: editForm.name,
        description: editForm.description,
        isActive: editForm.isActive,
      });

      // 성공 후 상태 업데이트
      setTagGroup({
        ...tagGroup,
        name: editForm.name,
        description: editForm.description,
        isActive: editForm.isActive,
      });

      setIsEditing(false);
      setMessage({ type: 'success', text: '태그 그룹이 성공적으로 업데이트되었습니다.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '업데이트 중 오류가 발생했습니다.',
      });
    }
  };

  // 태그 재생성 (랜덤 순서 변경)
  const handleRefreshTags = () => {
    // 컴포넌트 재렌더링을 위해 강제로 상태 업데이트
    setTagGroup(tagGroup ? { ...tagGroup } : null);
  };

  // 신청 상태 확인
  const isApplied = (): boolean => {
    return Boolean(user && tagGroup && tagGroup.applications.some((app) => app.userId === user.uid));
  };

  // 신청하기
  const handleApply = async () => {
    if (!user || !userProfile || !tagGroup) {
      setMessage({ type: 'error', text: '프로필 등록이 필요합니다.' });
      return;
    }

    if (!userProfile.socialMedia?.instagram) {
      setMessage({ type: 'error', text: '프로필에 인스타그램 계정을 먼저 등록해주세요.' });
      return;
    }

    setIsApplying(true);
    setMessage({ type: '', text: '' });

    try {
      await applyToTagGroup(tagGroup.id, user.uid, userProfile.displayName, userProfile.socialMedia.instagram);

      // 태그 그룹 데이터 다시 로드
      const updatedGroup = await getTagGroup(tagGroup.id);
      if (updatedGroup) {
        setTagGroup(updatedGroup);
      }
      setMessage({ type: 'success', text: '성공적으로 신청되었습니다.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '신청 중 오류가 발생했습니다.',
      });
    }
    setIsApplying(false);
  };

  // 신청 취소
  const handleCancelApplication = async () => {
    if (!user || !tagGroup) return;

    setIsApplying(true);
    setMessage({ type: '', text: '' });

    try {
      await cancelTagGroupApplication(tagGroup.id, user.uid);

      // 태그 그룹 데이터 다시 로드
      const updatedGroup = await getTagGroup(tagGroup.id);
      if (updatedGroup) {
        setTagGroup(updatedGroup);
      }
      setMessage({ type: 'success', text: '신청이 취소되었습니다.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '신청 취소 중 오류가 발생했습니다.',
      });
    }
    setIsApplying(false);
  };

  const handleBack = () => {
    navigate('/taggroups');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!tagGroup) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">태그 그룹을 찾을 수 없습니다.</Alert>
      </Container>
    );
  }

  const isOwner = user && tagGroup.createdBy === user.uid;
  const applied = isApplied();

  // 랜덤 10개 신청자 선택하여 인스타그램 태그 생성
  const getRandomInstagramTags = (applications: TagGroup['applications']) => {
    if (applications.length === 0) return '';

    // 배열을 섞어서 랜덤하게 정렬
    const shuffled = [...applications].sort(() => 0.5 - Math.random());
    // 최대 10개만 선택
    const selected = shuffled.slice(0, Math.min(10, shuffled.length));

    return generateInstagramTags(selected);
  };

  const instagramTags = getRandomInstagramTags(tagGroup.applications);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <Button startIcon={<ArrowBack />} onClick={handleBack} sx={{ mr: 2 }}>
          목록으로
        </Button>

        {isEditing ? (
          <TextField
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            variant="outlined"
            fullWidth
            sx={{
              flexGrow: 1,
              mr: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '2rem',
                fontWeight: 600,
              },
            }}
          />
        ) : (
          <Typography variant="h4" sx={{ fontWeight: 600, flexGrow: 1 }}>
            {tagGroup.name}
          </Typography>
        )}

        {/* 관리자 액션 버튼 */}
        {isOwner && (
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isEditing ? (
              <>
                <Tooltip title="저장">
                  <IconButton onClick={handleSave} color="primary">
                    <Save />
                  </IconButton>
                </Tooltip>
                <Tooltip title="취소">
                  <IconButton onClick={handleCancel}>
                    <Cancel />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="편집">
                  <IconButton onClick={handleEdit}>
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip title="삭제">
                  <IconButton onClick={handleDelete} color="error">
                    <Delete />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Box>
        )}
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

      {/* 태그 그룹 정보 (통합된 단일 블록) */}
      <Paper elevation={1} sx={{ p: 4 }}>
        <Stack spacing={4}>
          {/* 기본 정보 */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              {tagGroup.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Chip
                icon={<People />}
                label={`${tagGroup.applications.length}명 신청`}
                variant="outlined"
                size="small"
              />
              <Chip
                icon={<CalendarToday />}
                label={tagGroup.createdAt.toLocaleDateString()}
                variant="outlined"
                size="small"
              />
            </Box>
          </Box>

          {/* 설명 */}
          <Box>
            <Typography variant="h6" gutterBottom>
              설명
            </Typography>
            {isEditing ? (
              <TextField
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                variant="outlined"
                fullWidth
                multiline
                rows={3}
                placeholder="태그 그룹에 대한 설명을 입력하세요..."
              />
            ) : (
              <Typography variant="body1" color="text.secondary">
                {tagGroup.description || '설명이 없습니다.'}
              </Typography>
            )}
          </Box>

          {/* 인스타그램 태그 */}
          {tagGroup.applications.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">인스타그램 태그</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="새로고침 (랜덤 순서 변경)">
                    <IconButton onClick={handleRefreshTags} size="small" color="primary">
                      <Refresh />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={copySuccess ? '복사됨!' : '클립보드에 복사'}>
                    <IconButton
                      onClick={handleCopyInstagramTags}
                      color={copySuccess ? 'success' : 'primary'}
                      size="small"
                    >
                      <ContentCopy />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <TextField
                value={instagramTags}
                multiline
                fullWidth
                variant="outlined"
                size="small"
                minRows={2}
                maxRows={4}
                InputProps={{
                  readOnly: true,
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                {tagGroup.applications.length > 10
                  ? `총 ${tagGroup.applications.length}명 중 랜덤으로 10명 선택하여 태그 생성`
                  : `총 ${tagGroup.applications.length}명의 태그`}
              </Typography>
            </Box>
          )}

          {/* 신청 / 취소 버튼 */}
          {user && !isOwner && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              {applied ? (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<PersonRemove />}
                  onClick={handleCancelApplication}
                  disabled={isApplying}
                  size="large"
                  sx={{ minWidth: 150 }}
                >
                  {isApplying ? '처리 중...' : '신청 취소'}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PersonAdd />}
                  onClick={handleApply}
                  disabled={isApplying}
                  size="large"
                  sx={{ minWidth: 150 }}
                >
                  {isApplying ? '처리 중...' : '신청하기'}
                </Button>
              )}
            </Box>
          )}

          {/* 신청자 목록 */}
          <Box>
            <Button
              onClick={() => setShowApplicants(!showApplicants)}
              startIcon={showApplicants ? <ExpandLess /> : <ExpandMore />}
              sx={{ mb: 2 }}
            >
              신청자 목록 ({tagGroup.applications.length}명)
            </Button>

            {showApplicants && tagGroup.applications.length > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {tagGroup.applications.map((app) => app.userDisplayName).join(', ')}
              </Typography>
            )}

            {tagGroup.applications.length === 0 && (
              <Typography variant="body1" color="text.secondary">
                아직 신청자가 없습니다.
              </Typography>
            )}
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default TagGroupDetailPage;
