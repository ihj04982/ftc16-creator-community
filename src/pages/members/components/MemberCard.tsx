import { Box, Card, CardContent, Stack, Avatar, Typography, Chip, IconButton, Tooltip, Link } from '@mui/material';
import type { UserProfile } from '../../../models/User';
import { Home, Instagram, YouTube } from '@mui/icons-material';
import { getSocialMediaUrl } from '../../../utils/getSocialMediaUrl';
import type { SOCIAL_MEDIA_URLS } from '../../../configs/socialMediaConfigs';

const MemberCard = ({ members }: { members: UserProfile[] }) => {
  const SocialMediaIcon = ({ platform, handle }: { platform: keyof typeof SOCIAL_MEDIA_URLS; handle: string }) => {
    const iconProps = {
      sx: {
        fontSize: '20px',
        color: platform === 'ohouse' ? '#35C5F0' : platform === 'instagram' ? '#E4405F' : '#FF0000',
      },
    };

    const icon =
      platform === 'ohouse' ? (
        <Home {...iconProps} />
      ) : platform === 'instagram' ? (
        <Instagram {...iconProps} />
      ) : (
        <YouTube {...iconProps} />
      );

    return (
      <Tooltip
        title={`${platform === 'ohouse' ? '오늘의집' : platform === 'instagram' ? '인스타그램' : '유튜브'}에서 보기`}
      >
        <IconButton
          component={Link}
          href={getSocialMediaUrl(platform, handle)}
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{
            p: 0.5,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
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
                '&:hover': {
                  elevation: 3,
                  transform: 'translateY(-2px)',
                },
              }}
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
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </div>
  );
};

export default MemberCard;
