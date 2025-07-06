import { IconButton, Link, Tooltip } from '@mui/material';
import { getSocialMediaUrl } from '../utils/getSocialMediaUrl';
import { SOCIAL_MEDIA_URLS } from '../configs/socialMediaConfigs';
import { Home, Instagram, YouTube, Language } from '@mui/icons-material';

const SocialMediaIcon = ({ platform, handle }: { platform: keyof typeof SOCIAL_MEDIA_URLS; handle: string }) => {
  const iconProps = {
    sx: {
      fontSize: '20px',
      color:
        platform === 'ohouse'
          ? '#35C5F0'
          : platform === 'instagram'
            ? '#E4405F'
            : platform === 'youtube'
              ? '#FF0000'
              : '#00C73C',
    },
  };

  const icon =
    platform === 'ohouse' ? (
      <Home {...iconProps} />
    ) : platform === 'instagram' ? (
      <Instagram {...iconProps} />
    ) : platform === 'youtube' ? (
      <YouTube {...iconProps} />
    ) : (
      <Language {...iconProps} />
    );

  return (
    <Tooltip
      title={`${platform === 'ohouse' ? '오늘의집' : platform === 'instagram' ? '인스타그램' : platform === 'youtube' ? '유튜브' : '네이버 블로그'}에서 보기`}
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
        onClick={(e) => e.stopPropagation()}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default SocialMediaIcon;
