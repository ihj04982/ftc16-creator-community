import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Chip,
  Stack,
  Grid,
  Paper,
  IconButton,
  Alert,
  Skeleton,
  CircularProgress,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  Launch as LaunchIcon,
  TrendingUp as TrendingUpIcon,
  EmojiEvents as TrophyIcon,
  Schedule as ScheduleIcon,
  Assignment as AssignmentIcon,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import {
  getUserMissionsWithProgress,
  getUserMissionProgressSummary,
  toggleMissionCompletion,
} from '../services/missionService';
import type { MissionWithProgress, MissionProgressSummary } from '../models/Mission';
import Checkbox from '@mui/material/Checkbox';

const MissionCenterPage = () => {
  const { user } = useAuth();
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [summary, setSummary] = useState<MissionProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingToggle, setLoadingToggle] = useState<string | null>(null);

  // 데이터 로드
  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [missionsData, summaryData] = await Promise.all([
        getUserMissionsWithProgress(user.uid),
        getUserMissionProgressSummary(user.uid),
      ]);
      setMissions(missionsData);
      setSummary(summaryData);
      setError(null);
    } catch (err) {
      console.error('Error loading mission data:', err);
      setError('미션 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // 미션 완료 상태 토글
  const handleToggleCompletion = async (missionId: string, week: number) => {
    if (!user || loadingToggle) return;

    // 1. Optimistic UI: 미션 상태를 즉시 반영
    setMissions((prev) =>
      prev.map((m) => {
        if (m.mission.id !== missionId) return m;
        const now = new Date();
        if (m.progress) {
          // 이미 완료된 미션이면 취소
          return {
            ...m,
            progress: {
              ...m.progress,
              isCompleted: !m.progress.isCompleted,
              completedAt: m.progress.isCompleted ? null : now,
              updatedAt: now,
            },
          };
        } else {
          // 미완료 → 완료로
          return {
            ...m,
            progress: {
              id: `${user.uid}_${missionId}`,
              userId: user.uid,
              missionId,
              week,
              isCompleted: true,
              completedAt: now,
              createdAt: now,
              updatedAt: now,
            },
          };
        }
      }),
    );
    setLoadingToggle(missionId);

    // summary도 optimistic하게 직접 계산
    setSummary((prev) => {
      if (!prev) return prev;
      const isNowCompleted = missions.find((m) => m.mission.id === missionId)?.progress?.isCompleted;
      const completedMissions = prev.completedMissions + (isNowCompleted ? -1 : 1);
      const completionRate = prev.totalMissions > 0 ? (completedMissions / prev.totalMissions) * 100 : 0;
      return {
        ...prev,
        completedMissions,
        completionRate: Math.round(completionRate),
      };
    });

    try {
      await toggleMissionCompletion(user.uid, missionId, week);
      // 성공 시 별도 처리 없음 (이미 optimistic하게 반영됨)
    } catch {
      // 실패 시 전체 reload
      await loadData();
      setError('미션 상태 변경 중 오류가 발생했습니다.');
    } finally {
      setLoadingToggle(null);
    }
  };

  // 현재 주차 미션 찾기
  const currentMission = missions.find((m) => summary && m.mission.week === summary.currentWeek);

  // 미션 카드 컴포넌트
  const MissionCard = ({
    missionWithProgress,
    isCurrent = false,
  }: {
    missionWithProgress: MissionWithProgress;
    isCurrent?: boolean;
  }) => {
    const { mission, progress } = missionWithProgress;
    const isCompleted = progress?.isCompleted || false;
    const isLoading = loadingToggle === mission.id;

    return (
      <Card
        sx={{
          mb: 2,
          border: isCurrent ? 2 : 1,
          borderColor: isCurrent ? 'primary.main' : 'divider',
          bgcolor: isCurrent ? 'primary.50' : 'background.paper',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {isCurrent && (
          <Chip
            label="진행 중"
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              top: -8,
              right: 16,
              fontWeight: 600,
            }}
          />
        )}

        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack spacing={2}>
            {/* 미션 헤더 */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                    color: isCurrent ? 'primary.main' : 'text.primary',
                  }}
                >
                  {mission.week}주차: {mission.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>
                  {mission.description}
                </Typography>
              </Box>

              <IconButton
                onClick={() => handleToggleCompletion(mission.id, mission.week)}
                disabled={isLoading}
                sx={{
                  color: isCompleted ? 'success.main' : 'action.disabled',
                  p: 1,
                }}
                title={isCompleted ? '완료 취소하기' : '완료로 표시하기'}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : isCompleted ? (
                  <CheckCircleIcon />
                ) : (
                  <RadioButtonUncheckedIcon />
                )}
              </IconButton>
            </Box>

            {/* 미션 상태 및 액션 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant={isCurrent ? 'contained' : 'outlined'}
                size="small"
                endIcon={<LaunchIcon />}
                onClick={() => window.open(mission.missionUrl, '_blank')}
                sx={{
                  fontSize: '0.875rem',
                  px: 2,
                  py: 0.75,
                  ...(isCurrent && {
                    fontWeight: 600,
                  }),
                }}
              >
                미션 확인하기
              </Button>
              <Typography variant="caption" color="text.secondary">
                {new Date(mission.startDate).toLocaleDateString()} - {new Date(mission.endDate).toLocaleDateString()}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={120} />
            <Skeleton variant="rectangular" height={200} />
            <Skeleton variant="rectangular" height={150} />
            <Skeleton variant="rectangular" height={150} />
          </Stack>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* 페이지 헤더 */}
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2.125rem' },
                color: 'text.primary',
              }}
            >
              🎯 미션 센터
            </Typography>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              FTC16 크리에이터 미션에 참여하고 성장해보세요!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              💡 <strong>완료하기</strong> 버튼으로 미션을 완료 표시하고, 나의 미션 진행 상황을 파악할 수 있어요!
            </Typography>
          </Box>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* 전체 진행 상황 */}
          {summary && (
            <Paper
              sx={{
                p: { xs: 2, sm: 3 },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrophyIcon />
                  <Typography variant="h6" fontWeight={600}>
                    전체 진행 상황
                  </Typography>
                </Box>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700}>
                        {summary.completedMissions}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        완료한 미션
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700}>
                        {summary.totalMissions}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        전체 미션
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700}>
                        {summary.completionRate}%
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        완료율
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" fontWeight={700}>
                        {summary.currentWeek}주차
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        현재 주차
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <LinearProgress
                  variant="determinate"
                  value={summary.completionRate}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'rgba(255, 255, 255, 0.3)',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: 'white',
                    },
                  }}
                />
              </Stack>
            </Paper>
          )}

          {/* 현재 주차 미션 (중요) */}
          {currentMission && (
            <Box>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <TrendingUpIcon color="primary" />
                이번 주 미션
              </Typography>
              <MissionCard missionWithProgress={currentMission} isCurrent={true} />
            </Box>
          )}

          {/* 전체 미션 리스트 */}
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
              }}
            >
              <AssignmentIcon color="primary" />
              전체 미션 ({missions.length}개)
            </Typography>

            {missions.length === 0 ? (
              <Alert severity="info" sx={{ textAlign: 'center' }}>
                아직 등록된 미션이 없습니다. 곧 새로운 미션이 추가될 예정입니다! 🚀
              </Alert>
            ) : (
              missions.map((missionWithProgress) => (
                <MissionCard
                  key={missionWithProgress.mission.id}
                  missionWithProgress={missionWithProgress}
                  isCurrent={false}
                />
              ))
            )}
          </Box>

          {/* 참가 독려 메시지 */}
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: 'success.50',
              border: '1px solid',
              borderColor: 'success.200',
              '&:hover': {
                cursor: 'pointer',
                bgcolor: 'success.100',
                borderColor: 'success.200',
              },
            }}
            onClick={() => window.open('https://ohou.se/advices/11785', '_blank')}
          >
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              다른 멤버들의 컨텐츠가 궁금하다면
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom fontWeight={600}>
              #FTC16기이야기 채널 바로가기
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default MissionCenterPage;
