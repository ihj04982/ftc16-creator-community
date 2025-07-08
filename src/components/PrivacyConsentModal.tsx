import React, { useState } from 'react';
import { Modal, Box, Typography, Checkbox, FormControlLabel, Button, CircularProgress, Alert } from '@mui/material';

const PRIVACY_TEXT = `개인정보 수집·이용에 관한 동의\n\n(1) 수집항목: 이메일 주소, 오늘의집 닉네임, 인스타그램 주소 및 아이디, 유튜브·블로그 등 개인이 등록하는 주소 및 아이디\n\n(2) 수집목적: FTC 16기 프로그램 활동을 통한 FTC 16기 유저 간 SNS 상호 팔로우 등\n\n(3) 수집근거: 개인정보보호법 제15조\n\n(4) 보유 및 이용기간: 탈퇴 또는 FTC 16기 활동 종료 시까지`;

interface PrivacyConsentModalProps {
  open: boolean;
  onAgree: () => Promise<void>;
  loading: boolean;
  error?: string;
}

const PrivacyConsentModal: React.FC<PrivacyConsentModalProps> = ({ open, onAgree, loading, error }) => {
  const [checked, setChecked] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>(undefined);

  const handleAgree = async () => {
    setLocalError(undefined);
    try {
      await onAgree();
    } catch (e: unknown) {
      if (e instanceof Error) {
        setLocalError(e.message);
      } else {
        setLocalError('동의 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <Modal
      open={open}
      aria-labelledby="privacy-consent-title"
      aria-describedby="privacy-consent-description"
      disableEscapeKeyDown
      disableAutoFocus
      disableEnforceFocus={false}
      sx={{ zIndex: 2000 }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0,0,0,0.7)',
          pointerEvents: 'auto',
        },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 3,
          p: 4,
          minWidth: 340,
          maxWidth: 420,
          width: '90%',
          outline: 'none',
        }}
      >
        <Typography id="privacy-consent-title" variant="h6" fontWeight={700} gutterBottom>
          개인정보 수집·이용 동의
        </Typography>
        <Typography
          id="privacy-consent-description"
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: 'pre-line', mb: 2 }}
        >
          {PRIVACY_TEXT}
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={checked} onChange={(e) => setChecked(e.target.checked)} disabled={loading} />}
          label={<span>위 내용을 모두 읽고 동의합니다.</span>}
        />
        {(error || localError) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || localError}
          </Alert>
        )}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!checked || loading}
            onClick={handleAgree}
            fullWidth
            sx={{ fontWeight: 700 }}
          >
            {loading ? <CircularProgress size={22} /> : '확인'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PrivacyConsentModal;
