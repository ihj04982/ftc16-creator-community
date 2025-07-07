import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  arrayUnion,
  arrayRemove,
  where,
} from 'firebase/firestore';
import type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../configs/firebaseConfigs';
import type { TagGroup, CreateTagGroupData, UpdateTagGroupData, TagGroupApplication } from '../models/TagGroup';
import { SnsType } from '../models/TagGroup';

const TAG_GROUPS_COLLECTION = 'tagGroups';

// Firestore 데이터를 TagGroup으로 변환
const convertFirestoreTagGroup = (doc: QueryDocumentSnapshot<DocumentData>): TagGroup => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || '',
    description: data.description || '',
    snsType: data.snsType || 'instagram', // 기본값으로 instagram 설정
    createdBy: data.createdBy || '',
    createdByName: data.createdByName || '',
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
    applications:
      data.applications?.map((app: DocumentData) => ({
        userId: app.userId || '',
        userDisplayName: app.userDisplayName || '',
        userInstagram: app.userInstagram || '', // 호환성을 위해 유지
        userSnsAccount: app.userSnsAccount || app.userInstagram || '', // 새 필드, 기존 데이터 호환
        appliedAt: app.appliedAt?.toDate() || new Date(),
      })) || [],
  };
};

// 태그 그룹 생성
export const createTagGroup = async (
  uid: string,
  userDisplayName: string,
  userInstagram: string,
  tagGroupData: CreateTagGroupData,
): Promise<string> => {
  try {
    const tagGroupRef = doc(collection(db, TAG_GROUPS_COLLECTION));
    const now = Timestamp.now();

    // 생성자를 자동으로 신청자 목록에 추가
    const creatorApplication: TagGroupApplication = {
      userId: uid,
      userDisplayName,
      userInstagram,
      userSnsAccount: userInstagram, // 호환성을 위해 Instagram 계정으로 설정
      appliedAt: new Date(),
    };

    await setDoc(tagGroupRef, {
      ...tagGroupData,
      createdBy: uid,
      createdByName: userDisplayName,
      createdAt: now,
      updatedAt: now,
      applications: [
        {
          ...creatorApplication,
          appliedAt: now,
        },
      ],
    });

    return tagGroupRef.id;
  } catch (error) {
    console.error('Error creating tag group:', error);
    throw new Error('태그 그룹 생성 중 오류가 발생했습니다.');
  }
};

// 태그 그룹 조회
export const getTagGroup = async (id: string): Promise<TagGroup | null> => {
  try {
    const tagGroupRef = doc(db, TAG_GROUPS_COLLECTION, id);
    const tagGroupSnap = await getDoc(tagGroupRef);

    if (tagGroupSnap.exists()) {
      return convertFirestoreTagGroup(tagGroupSnap);
    }
    return null;
  } catch (error) {
    console.error('Error getting tag group:', error);
    throw new Error('태그 그룹 조회 중 오류가 발생했습니다.');
  }
};

// 모든 태그 그룹 목록 조회
export const getAllTagGroups = async (): Promise<TagGroup[]> => {
  try {
    const tagGroupsRef = collection(db, TAG_GROUPS_COLLECTION);
    const q = query(tagGroupsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreTagGroup);
  } catch (error) {
    console.error('Error getting all tag groups:', error);
    throw new Error('태그 그룹 목록 조회 중 오류가 발생했습니다.');
  }
};

// 활성화된 태그 그룹만 조회
export const getActiveTagGroups = async (): Promise<TagGroup[]> => {
  try {
    const tagGroupsRef = collection(db, TAG_GROUPS_COLLECTION);
    const q = query(tagGroupsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreTagGroup);
  } catch (error) {
    console.error('Error getting active tag groups:', error);
    throw new Error('활성 태그 그룹 조회 중 오류가 발생했습니다.');
  }
};

// SNS 타입별 활성화된 태그 그룹 조회
export const getActiveTagGroupsBySnsType = async (snsType: SnsType): Promise<TagGroup[]> => {
  try {
    const tagGroupsRef = collection(db, TAG_GROUPS_COLLECTION);
    const q = query(tagGroupsRef, where('snsType', '==', snsType), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(convertFirestoreTagGroup);
  } catch (error) {
    console.error('Error getting active tag groups by SNS type:', error);
    throw new Error('SNS 타입별 태그 그룹 조회 중 오류가 발생했습니다.');
  }
};

// 태그 그룹 업데이트
export const updateTagGroup = async (id: string, tagGroupData: UpdateTagGroupData): Promise<void> => {
  try {
    const tagGroupRef = doc(db, TAG_GROUPS_COLLECTION, id);
    await updateDoc(tagGroupRef, {
      ...tagGroupData,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error updating tag group:', error);
    throw new Error('태그 그룹 업데이트 중 오류가 발생했습니다.');
  }
};

// 태그 그룹 삭제
export const deleteTagGroup = async (id: string): Promise<void> => {
  try {
    const tagGroupRef = doc(db, TAG_GROUPS_COLLECTION, id);
    await deleteDoc(tagGroupRef);
  } catch (error) {
    console.error('Error deleting tag group:', error);
    throw new Error('태그 그룹 삭제 중 오류가 발생했습니다.');
  }
};

// 태그 그룹에 신청하기
export const applyToTagGroup = async (
  tagGroupId: string,
  userId: string,
  userDisplayName: string,
  userInstagram: string,
): Promise<void> => {
  try {
    const tagGroupRef = doc(db, TAG_GROUPS_COLLECTION, tagGroupId);

    const application: TagGroupApplication = {
      userId,
      userDisplayName,
      userInstagram,
      userSnsAccount: userInstagram, // 호환성을 위해 Instagram 계정으로 설정
      appliedAt: new Date(),
    };

    // 이미 신청했는지 확인
    const tagGroup = await getTagGroup(tagGroupId);
    if (tagGroup?.applications.some((app) => app.userId === userId)) {
      throw new Error('이미 신청한 태그 그룹입니다.');
    }

    await updateDoc(tagGroupRef, {
      applications: arrayUnion({
        ...application,
        appliedAt: Timestamp.now(),
      }),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error applying to tag group:', error);
    throw new Error(error instanceof Error ? error.message : '태그 그룹 신청 중 오류가 발생했습니다.');
  }
};

// 태그 그룹 신청 취소
export const cancelTagGroupApplication = async (tagGroupId: string, userId: string): Promise<void> => {
  try {
    const tagGroup = await getTagGroup(tagGroupId);
    if (!tagGroup) {
      throw new Error('태그 그룹을 찾을 수 없습니다.');
    }

    const application = tagGroup.applications.find((app) => app.userId === userId);
    if (!application) {
      throw new Error('신청 내역을 찾을 수 없습니다.');
    }

    const tagGroupRef = doc(db, TAG_GROUPS_COLLECTION, tagGroupId);
    await updateDoc(tagGroupRef, {
      applications: arrayRemove({
        ...application,
        appliedAt: Timestamp.fromDate(application.appliedAt),
      }),
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error canceling tag group application:', error);
    throw new Error(error instanceof Error ? error.message : '태그 그룹 신청 취소 중 오류가 발생했습니다.');
  }
};

// 사용자별 신청한 태그 그룹 조회
export const getUserTagGroupApplications = async (userId: string): Promise<TagGroup[]> => {
  try {
    const tagGroupsRef = collection(db, TAG_GROUPS_COLLECTION);
    const querySnapshot = await getDocs(tagGroupsRef);

    const userTagGroups = querySnapshot.docs
      .map(convertFirestoreTagGroup)
      .filter((tagGroup) => tagGroup.applications.some((app) => app.userId === userId));

    return userTagGroups;
  } catch (error) {
    console.error('Error getting user tag group applications:', error);
    throw new Error('사용자 태그 그룹 신청 내역 조회 중 오류가 발생했습니다.');
  }
};

// SNS별 태그/링크 생성
export const generateSNSTags = (applications: TagGroupApplication[], snsType: SnsType): string => {
  switch (snsType) {
    case SnsType.INSTAGRAM:
      return applications
        .filter((app) => app.userSnsAccount || app.userInstagram)
        .map((app) => {
          const account = app.userSnsAccount || app.userInstagram;
          return account.startsWith('@') ? account : `@${account}`;
        })
        .join(' ');

    case SnsType.YOUTUBE:
      return applications
        .filter((app) => app.userSnsAccount)
        .map((app) => `https://youtube.com/${app.userSnsAccount}`)
        .join('\n');

    case SnsType.NAVER:
      return applications
        .filter((app) => app.userSnsAccount)
        .map((app) => `https://blog.naver.com/${app.userSnsAccount}`)
        .join('\n');

    case SnsType.OHOUSE:
      return applications
        .filter((app) => app.userSnsAccount)
        .map((app) => {
          const nickname = app.userDisplayName;
          return `${nickname}`;
        })
        .join('\n');

    default:
      return '';
  }
};

// 호환성을 위한 기존 함수 유지
export const generateInstagramTags = (applications: TagGroupApplication[]): string => {
  return generateSNSTags(applications, SnsType.INSTAGRAM);
};
