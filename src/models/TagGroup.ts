// SNS 플랫폼 타입 정의
export enum SnsType {
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
  NAVER = 'naver',
  OHOUSE = 'ohouse',
}

// SNS 타입별 라벨 매핑
export const SNS_TYPE_LABELS: Record<SnsType, string> = {
  [SnsType.INSTAGRAM]: '인스타그램',
  [SnsType.YOUTUBE]: '유튜브',
  [SnsType.NAVER]: '네이버 블로그',
  [SnsType.OHOUSE]: '오늘의집',
};

// SNS 타입별 색상 매핑
export const SNS_TYPE_COLORS: Record<SnsType, string> = {
  [SnsType.INSTAGRAM]: '#E4405F',
  [SnsType.YOUTUBE]: '#FF0000',
  [SnsType.NAVER]: '#03C75A',
  [SnsType.OHOUSE]: '#35C5F0',
};

export interface TagGroupApplication {
  userId: string;
  userDisplayName: string;
  userInstagram: string; // 호환성을 위해 유지
  userSnsAccount: string; // 해당 SNS 계정 정보
  appliedAt: Date;
}

export interface TagGroup {
  id: string;
  name: string; // 태그 그룹 이름 (예: 인테리어 체험단)
  description?: string; // 설명
  snsType: SnsType; // SNS 플랫폼 타입
  createdBy: string; // 생성자 UID
  createdByName?: string; // 생성자 이름
  createdAt: Date;
  updatedAt: Date;
  applications: TagGroupApplication[]; // 신청자 목록
}

export type CreateTagGroupData = Omit<TagGroup, 'id' | 'createdAt' | 'updatedAt' | 'applications' | 'createdBy'>;
export type UpdateTagGroupData = Partial<Omit<TagGroup, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>>;
