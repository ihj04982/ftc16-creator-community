import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, TextField, InputAdornment, CircularProgress, Alert } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAllUsers } from '../../services/userService';
import type { UserProfile } from '../../models/User';
import ProfileCompleteCard from './components/ProfileCompleteCard';
import MemberCard from './components/MemberCard';

const MembersPage: React.FC = () => {
  const [members, setMembers] = useState<UserProfile[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // 멤버 목록 로드
  useEffect(() => {
    const loadMembers = async () => {
      try {
        const users = await getAllUsers();
        const sortedUsers = users.sort((a, b) => {
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
        setMembers(sortedUsers);
        setFilteredMembers(sortedUsers);
      } catch {
        setError('멤버 목록을 불러오는 중 오류가 발생했습니다.');
      }
      setLoading(false);
    };

    loadMembers();
  }, []);

  // 검색 처리
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
    } else {
      const filtered = members.filter(
        (member) =>
          member.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (member.bio && member.bio.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (member.activityField && member.activityField.toLowerCase().includes(searchTerm.toLowerCase())),
      );
      const sortedFiltered = filtered.sort((a, b) => {
        const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      setFilteredMembers(sortedFiltered);
    }
  }, [searchTerm, members]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: 600 }}>
        크리에이터 멤버
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 검색 바 */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="이름, 소개, 활동 분야로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      <ProfileCompleteCard members={members} />

      {/* 멤버 카드 그리드 */}
      <MemberCard members={filteredMembers} />

      {/* 검색 결과 없음 */}
      {filteredMembers.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            검색 결과가 없습니다
          </Typography>
          <Typography variant="body2" color="text.secondary">
            다른 검색어를 시도해보세요
          </Typography>
        </Box>
      )}

      {/* 멤버 수 표시 */}
      {!loading && (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            총 {filteredMembers.length}명의 크리에이터
            {searchTerm && ` (전체 ${members.length}명 중)`}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MembersPage;
