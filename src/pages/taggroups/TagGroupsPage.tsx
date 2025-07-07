import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  CircularProgress,
  Alert,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import { Add, People, PersonAdd, PersonRemove, Person, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getActiveTagGroups, applyToTagGroup, cancelTagGroupApplication } from '../../services/tagGroupService';
import { getUserProfile } from '../../services/userService';
import type { TagGroup } from '../../models/TagGroup';
import type { UserProfile } from '../../models/User';
import { SnsType, SNS_TYPE_LABELS, SNS_TYPE_COLORS } from '../../models/TagGroup';

const TagGroupsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [filteredTagGroups, setFilteredTagGroups] = useState<TagGroup[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [applyingStates, setApplyingStates] = useState<Record<string, boolean>>({});
  const [error, setError] = useState('');
  const [selectedSnsType, setSelectedSnsType] = useState<SnsType | 'all'>('all');

  // 태그 그룹 목록 및 사용자 프로필 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const [groups, profile] = await Promise.all([getActiveTagGroups(), user ? getUserProfile(user.uid) : null]);
        setTagGroups(groups);
        setUserProfile(profile);
      } catch {
        setError('태그 그룹 목록을 불러오는 중 오류가 발생했습니다.');
      }
      setLoading(false);
    };

    loadData();
  }, [user]);

  // SNS 타입별 필터링
  useEffect(() => {
    if (selectedSnsType === 'all') {
      setFilteredTagGroups(tagGroups);
    } else {
      setFilteredTagGroups(tagGroups.filter((group) => group.snsType === selectedSnsType));
    }
  }, [tagGroups, selectedSnsType]);

  // SNS 타입 필터 변경
  const handleSnsTypeChange = (event: React.MouseEvent<HTMLElement>, newSnsType: SnsType | 'all') => {
    if (newSnsType !== null) {
      setSelectedSnsType(newSnsType);
    }
  };

  // 신청 상태 확인
  const isApplied = (tagGroup: TagGroup): boolean => {
    return Boolean(user && tagGroup.applications.some((app) => app.userId === user.uid));
  };

  // 신청하기
  const handleApply = async (tagGroup: TagGroup) => {
    if (!user || !userProfile) {
      setError('프로필 등록이 필요합니다.');
      return;
    }

    if (!userProfile.socialMedia?.instagram) {
      setError('프로필에 인스타그램 계정을 먼저 등록해주세요.');
      return;
    }

    setApplyingStates((prev) => ({ ...prev, [tagGroup.id]: true }));
    setError('');

    try {
      await applyToTagGroup(tagGroup.id, user.uid, userProfile.displayName, userProfile.socialMedia.instagram);

      // 태그 그룹 목록 다시 로드
      const updatedGroups = await getActiveTagGroups();
      setTagGroups(updatedGroups);
    } catch (error) {
      setError(error instanceof Error ? error.message : '신청 중 오류가 발생했습니다.');
    }
    setApplyingStates((prev) => ({ ...prev, [tagGroup.id]: false }));
  };

  // 신청 취소
  const handleCancelApplication = async (tagGroup: TagGroup) => {
    if (!user) return;

    setApplyingStates((prev) => ({ ...prev, [tagGroup.id]: true }));
    setError('');

    try {
      await cancelTagGroupApplication(tagGroup.id, user.uid);

      // 태그 그룹 목록 다시 로드
      const updatedGroups = await getActiveTagGroups();
      setTagGroups(updatedGroups);
    } catch (error) {
      setError(error instanceof Error ? error.message : '신청 취소 중 오류가 발생했습니다.');
    }
    setApplyingStates((prev) => ({ ...prev, [tagGroup.id]: false }));
  };

  const handleCreateTagGroup = () => {
    navigate('/taggroups/create');
  };

  const handleCardClick = (id: string) => {
    navigate(`/taggroups/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          태그 그룹 관리
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={handleCreateTagGroup} sx={{ height: 48 }}>
          태그 그룹 생성
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        체험단, 이벤트 등 다양한 SNS 태그 그룹을 만들고 관리해보세요.
      </Typography>

      {/* SNS 타입 필터 */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
          SNS 플랫폼 필터
        </Typography>
        <ToggleButtonGroup
          value={selectedSnsType}
          exclusive
          onChange={handleSnsTypeChange}
          aria-label="SNS 타입 필터"
          size="small"
        >
          <ToggleButton value="all" aria-label="전체">
            전체
          </ToggleButton>
          {Object.entries(SNS_TYPE_LABELS).map(([value, label]) => (
            <ToggleButton key={value} value={value} aria-label={label}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {filteredTagGroups.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {selectedSnsType === 'all'
              ? '아직 생성된 태그 그룹이 없습니다'
              : `선택한 SNS 플랫폼에 해당하는 태그 그룹이 없습니다`}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {selectedSnsType === 'all'
              ? '첫 번째 태그 그룹을 만들어보세요'
              : '다른 SNS 플랫폼을 선택하거나 새로운 태그 그룹을 만들어보세요'}
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={handleCreateTagGroup} size="large">
            태그 그룹 생성
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredTagGroups.map((tagGroup) => {
            const applied = isApplied(tagGroup);
            const isOwner = user && tagGroup.createdBy === user.uid;
            const isApplying = applyingStates[tagGroup.id] || false;

            return (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={tagGroup.id}>
                <Card
                  elevation={1}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s',
                    '&:hover': {
                      elevation: 3,
                      transform: 'translateY(-2px)',
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => handleCardClick(tagGroup.id)}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, flexGrow: 1 }}>
                        {tagGroup.name}
                      </Typography>
                    </Box>

                    {tagGroup.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {tagGroup.description}
                      </Typography>
                    )}

                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={SNS_TYPE_LABELS[tagGroup.snsType]}
                          size="small"
                          sx={{
                            backgroundColor: SNS_TYPE_COLORS[tagGroup.snsType],
                            color: 'white',
                          }}
                        />
                        {applied && <Chip label="신청함" color="primary" size="small" variant="outlined" />}
                        {isOwner && <Chip label="내 그룹" color="secondary" size="small" variant="outlined" />}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <People sx={{ fontSize: 18, color: 'primary.main' }} />
                          <Typography variant="body2">{tagGroup.applications.length}명</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {tagGroup.createdByName || '익명'}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {tagGroup.createdAt.toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Stack spacing={1} sx={{ width: '100%' }}>
                      {/* 신청/취소 버튼 (소유자가 아닌 경우) */}
                      {user && !isOwner && (
                        <Button
                          variant={applied ? 'outlined' : 'contained'}
                          color={applied ? 'error' : 'primary'}
                          startIcon={applied ? <PersonRemove /> : <PersonAdd />}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (applied) {
                              handleCancelApplication(tagGroup);
                            } else {
                              handleApply(tagGroup);
                            }
                          }}
                          disabled={isApplying}
                          fullWidth
                          size="small"
                        >
                          {isApplying ? '처리 중...' : applied ? '신청 취소' : '신청하기'}
                        </Button>
                      )}
                    </Stack>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default TagGroupsPage;
