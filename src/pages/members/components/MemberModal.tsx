import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import type { UserProfile } from '../../../models/User';
import { Close, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import SocialMediaIcon from '../../../components/SocialMediaIcon';

const MemberModal = ({
  member,
  open,
  onClose,
  handleCloseDialog,
}: {
  member: UserProfile;
  open: boolean;
  onClose: () => void;
  handleCloseDialog: () => void;
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      {member && (
        <>
          <DialogTitle sx={{ pb: 1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="h6">크리에이터 정보</Typography>
              <IconButton onClick={handleCloseDialog} size="small">
                <Close />
              </IconButton>
            </Stack>
          </DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <Stack spacing={3} alignItems="center">
              {/* 프로필 사진 */}
              <Avatar src={member.profilePhoto} sx={{ width: 120, height: 120 }}>
                {member.displayName.charAt(0)}
              </Avatar>

              {/* 이름 */}
              <Typography variant="h5" fontWeight={600} textAlign="center">
                {member.displayName}
              </Typography>

              {/* 활동 분야 */}
              {member.activityField && <Chip label={member.activityField} variant="outlined" color="primary" />}

              {/* 자기소개 */}
              {member.bio && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  sx={{
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {member.bio}
                </Typography>
              )}

              {/* 소셜 미디어 링크 */}
              <Stack direction="row" spacing={2} justifyContent="center">
                {member.socialMedia.ohouse && <SocialMediaIcon platform="ohouse" handle={member.socialMedia.ohouse} />}
                {member.socialMedia.instagram && (
                  <SocialMediaIcon platform="instagram" handle={member.socialMedia.instagram} />
                )}
                {member.socialMedia.naver && <SocialMediaIcon platform="naver" handle={member.socialMedia.naver} />}
              </Stack>

              {/* 가입일 */}
              <Typography variant="body2" color="text.secondary">
                가입일: {new Date(member.createdAt).toLocaleDateString('ko-KR')}
              </Typography>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            {user?.uid === member.uid && (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => {
                  navigate('/profile');
                  handleCloseDialog();
                }}
                sx={{ mr: 1 }}
              >
                프로필 수정
              </Button>
            )}
            <Button onClick={handleCloseDialog} variant="outlined">
              닫기
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

export default MemberModal;
