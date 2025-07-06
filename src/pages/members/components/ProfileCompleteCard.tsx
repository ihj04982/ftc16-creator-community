import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router';
import type { UserProfile } from '../../../models/User';
import { Card, CardContent, Stack, Avatar, Typography, Box, Button } from '@mui/material';
import { AccountCircle, Edit } from '@mui/icons-material';

const ProfileCompleteCard = ({ members }: { members: UserProfile[] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const isCurrentUserProfileComplete = user ? members.some((member) => member.uid === user.uid) : true;

  return (
    <div>
      {user && !isCurrentUserProfileComplete && (
        <Card
          elevation={2}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          />
          <CardContent sx={{ p: 2.5 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              >
                <AccountCircle sx={{ fontSize: '2rem' }} />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  프로필을 완성해주세요!
                </Typography>
                <Typography variant="body2" sx={{ mb: 2, opacity: 0.9 }}>
                  아직 프로필 정보가 완성되지 않아 멤버 목록에 표시되지 않고 있어요. 다른 크리에이터들과 연결되려면
                  프로필을 완성해주세요.
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => navigate('/profile')}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.3)',
                    },
                  }}
                >
                  프로필 완성하기
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfileCompleteCard;
