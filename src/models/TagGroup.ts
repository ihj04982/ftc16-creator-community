export interface TagGroupApplication {
  userId: string;
  userDisplayName: string;
  userInstagram: string;
  appliedAt: Date;
}

export interface TagGroup {
  id: string;
  name: string; // 태그 그룹 이름 (예: 인테리어 체험단)
  description?: string; // 설명
  createdBy: string; // 생성자 UID
  createdAt: Date;
  updatedAt: Date;
  applications: TagGroupApplication[]; // 신청자 목록
  isActive: boolean; // 활성화 상태
}

export type CreateTagGroupData = Omit<TagGroup, 'id' | 'createdAt' | 'updatedAt' | 'applications' | 'createdBy'>;
export type UpdateTagGroupData = Partial<Omit<TagGroup, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
