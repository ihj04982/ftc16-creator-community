import { Box, Card, CardContent, Stack, Avatar, Typography, Chip, Button } from '@mui/material';
import type { UserProfile } from '../../../models/User';
import { Edit } from '@mui/icons-material';
import { useAuth } from '../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MemberModal from './MemberModal';
import SocialMediaIcon from '../../../components/SocialMediaIcon';

const MemberCard = ({ members }: { members: UserProfile[] }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<UserProfile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCardClick = (member: UserProfile) => {
    setSelectedMember(member);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedMember(null);
  };

  return (
    <div>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 3,
        }}
      >
        {members.map((member) => (
          <Box key={member.uid}>
            <Card
              elevation={1}
              sx={{
                height: '100%',
                transition: 'all 0.2s',
                cursor: 'pointer',
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-2px)',
                },
              }}
              onClick={() => handleCardClick(member)}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2} alignItems="center">
                  {/* 프로필 사진 */}
                  <Avatar src={member.profilePhoto} sx={{ width: 80, height: 80 }}>
                    {member.displayName.charAt(0)}
                  </Avatar>

                  {/* 이름 */}
                  <Typography variant="h6" fontWeight={600} textAlign="center">
                    {member.displayName}
                  </Typography>

                  {/* 활동 분야 */}
                  {member.activityField && (
                    <Chip label={member.activityField} size="small" variant="outlined" color="primary" />
                  )}

                  {/* 자기소개 */}
                  {member.bio && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        minHeight: '2.5em',
                      }}
                    >
                      {member.bio}
                    </Typography>
                  )}

                  {/* 소셜 미디어 링크 */}
                  <Stack direction="row" spacing={1} justifyContent="center">
                    {member.socialMedia.ohouse && (
                      <SocialMediaIcon platform="ohouse" handle={member.socialMedia.ohouse} />
                    )}
                    {member.socialMedia.instagram && (
                      <SocialMediaIcon platform="instagram" handle={member.socialMedia.instagram} />
                    )}
                    {member.socialMedia.youtube && (
                      <SocialMediaIcon platform="youtube" handle={member.socialMedia.youtube} />
                    )}
                    {member.socialMedia.naver && <SocialMediaIcon platform="naver" handle={member.socialMedia.naver} />}
                  </Stack>

                  {/* 자신의 카드에만 수정 버튼 표시 */}
                  {user?.uid === member.uid && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Edit />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/profile');
                      }}
                      sx={{
                        mt: 1,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.dark',
                          backgroundColor: 'primary.main',
                          color: 'white',
                        },
                      }}
                    >
                      프로필 수정
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          open={dialogOpen}
          onClose={handleCloseDialog}
          handleCloseDialog={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default MemberCard;
