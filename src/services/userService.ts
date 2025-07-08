import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  where,
} from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../configs/firebaseConfigs';
import type { UserProfile, CreateUserProfileData, UpdateUserProfileData, PrivacyConsent } from '../models/User';

const USERS_COLLECTION = 'users';

// Firebase Auth 사용자와 Firestore 프로필 정보를 결합하는 유틸리티 함수
export const getUserProfileWithAuthInfo = async (uid: string): Promise<UserProfile | null> => {
  try {
    // Firestore에서 추가 프로필 정보 조회
    const profile = await getUserProfile(uid);

    if (!profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error getting user profile with auth info:', error);
    throw new Error('사용자 정보 조회 중 오류가 발생했습니다.');
  }
};

// 사용자 프로필 존재 여부 확인
export const checkUserProfileExists = async (uid: string): Promise<boolean> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists();
  } catch (error) {
    console.error('Error checking user profile exists:', error);
    return false;
  }
};

// Firestore 데이터를 UserProfile로 변환
const convertFirestoreUser = (doc: QueryDocumentSnapshot<DocumentData>): UserProfile => {
  const data = doc.data();
  return {
    uid: doc.id,
    displayName: data.displayName || '',
    email: data.email || '',
    profilePhoto: data.profilePhoto || '',
    bio: data.bio || '',
    activityField: data.activityField || '',
    socialMedia: data.socialMedia || {
      ohouse: '',
      instagram: '',
      youtube: '',
      naver: '',
    },
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    privacyConsent: data.privacyConsent, // privacyConsent 필드 추가
  };
};

// 사용자 프로필 생성
export const createUserProfile = async (uid: string, userData: CreateUserProfileData): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const now = Timestamp.now();

    await setDoc(userRef, {
      ...userData,
      createdAt: now,
      updatedAt: now,
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw new Error('프로필 생성 중 오류가 발생했습니다.');
  }
};

// 사용자 프로필 조회
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return convertFirestoreUser(userSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new Error('프로필 조회 중 오류가 발생했습니다.');
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (uid: string, userData: UpdateUserProfileData): Promise<void> => {
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error('프로필 업데이트 중 오류가 발생했습니다.');
  }
};

// 모든 사용자 목록 조회
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('isProfileComplete', '==', true), orderBy('displayName'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreUser);
  } catch (error) {
    console.error('Error getting all users:', error);
    throw new Error('사용자 목록 조회 중 오류가 발생했습니다.');
  }
};

// 이름으로 사용자 검색
export const searchUsersByName = async (searchTerm: string): Promise<UserProfile[]> => {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    // Firestore에서 부분 문자열 검색은 제한적이므로 클라이언트에서 필터링
    const q = query(usersRef, orderBy('displayName'));
    const querySnapshot = await getDocs(q);

    const allUsers = querySnapshot.docs.map(convertFirestoreUser);

    return allUsers.filter((user) => user.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
  } catch (error) {
    console.error('Error searching users:', error);
    throw new Error('사용자 검색 중 오류가 발생했습니다.');
  }
};

// 개인정보 동의 저장 (UserProfile 없으면 최소 정보로 생성)
export const savePrivacyConsent = async (uid: string, email: string, privacyConsent: PrivacyConsent) => {
  const userRef = doc(db, USERS_COLLECTION, uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    await updateDoc(userRef, {
      privacyConsent,
      updatedAt: Timestamp.now(),
    });
  } else {
    await setDoc(userRef, {
      email,
      privacyConsent,
      isProfileComplete: false,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  }
};
