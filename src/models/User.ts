export interface SocialMedia {
  ohouse?: string; // 오늘의집 ID
  instagram?: string; // 인스타그램 계정
  youtube?: string; // 유튜브 채널
  naver?: string; // 네이버 블로그 ID
}

export interface UserProfile {
  uid: string; // Firebase Auth UID
  displayName: string; // 오늘의집 닉네임
  email: string;
  profilePhoto?: string; // 프로필 사진 URL
  bio?: string; // 자기소개
  activityField?: string; // 활동 분야
  socialMedia: SocialMedia;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserProfileData = Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>;
export type UpdateUserProfileData = Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>>;
