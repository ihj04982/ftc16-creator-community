export interface SocialMedia {
  ohouse?: string; // 오늘의집 ID
  instagram?: string; // 인스타그램 계정
  youtube?: string; // 유튜브 채널
  naver?: string; // 네이버 블로그 ID
}

export interface PrivacyConsent {
  agreed: boolean;
  agreedAt: Date;
  version: string;
  method: 'signup' | 'modal';
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
  privacyConsent?: PrivacyConsent; // 개인정보 수집 동의 정보
  isProfileComplete: boolean; // 프로필 완성 여부
}

export type CreateUserProfileData = Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'> & {
  isProfileComplete?: boolean;
};
export type UpdateUserProfileData = Partial<Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>> & {
  isProfileComplete?: boolean;
};
